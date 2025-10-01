'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Service } from '@/types/servicesTypes';
import { X, CheckCircle2, Search, Building2, Phone, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: 'CUSTOMER' | 'PROFESSIONAL';
    inputType: 'TEXT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
    order: number;
    serviceId: string;
    options: { id: string; text: string }[];
}

const STEPS = {
    ACCOUNT: 1,
    SERVICES: 2,
    DETAILS: 3,
    QUESTIONS: 4,
};

export default function ProfessionalOnboarding() {
    const router = useRouter();
    const { data: session, status: sessionStatus, update: updateSession } = useSession();
    const searchParams = useSearchParams();
    const initialService = searchParams.get('service');

    const [step, setStep] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [allServices, setAllServices] = useState<Service[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

    const [serviceQuestions, setServiceQuestions] = useState<{ serviceName: string; questions: Question[] }[]>([]);
    const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pincode, setPincode] = useState('');
    const [locationName, setLocationName] = useState('');
    const [isPincodeLoading, setIsPincodeLoading] = useState(false);

    const [serviceSearchTerm, setServiceSearchTerm] = useState('');
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAllServices = async () => {
            try {
                const response = await axios.get('/api/professional/services');
                setAllServices(response.data);
                const initialServiceId: string | undefined = response.data.find((s: Service) => s.name === initialService)?.id;
                if (initialServiceId) {
                    setSelectedServiceIds([initialServiceId]);
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
            }
        };
        fetchAllServices();
    }, [initialService]);

    const handleProceedToProfile = async () => {
        if (selectedServiceIds.length === 0) {
            toast.error("Please select at least one service.");
            return;
        }
        try {
            const response = await axios.get(`/api/admin/services/${selectedServiceIds[0]}/questions?type=PROFESSIONAL`);
            setServiceQuestions(response.data);
            setStep(STEPS.DETAILS);
        } catch (error) {
            toast.error("Could not load service questions.");
        }
    };

    useEffect(() => {
        if (pincode.length === 6) {
            setIsPincodeLoading(true);
            setLocationName('');
            const fetchLocation = async () => {
                try {
                    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
                    if (response.data && response.data[0].Status === 'Success') {
                        const postOffice = response.data[0].PostOffice[0];
                        setLocationName(`${postOffice.District}, ${postOffice.State}`);
                    } else {
                        setLocationName('Invalid Pincode');
                    }
                } catch (error) {
                    setLocationName('Could not verify pincode');
                } finally {
                    setIsPincodeLoading(false);
                }
            };
            const debounce = setTimeout(fetchLocation, 500);
            return () => clearTimeout(debounce);
        } else {
            setLocationName('');
        }
    }, [pincode]);

    useEffect(() => {
        if (sessionStatus === 'loading') {
            return;
        }

        if (sessionStatus === 'authenticated') {
            setStep(STEPS.SERVICES);
        } else {
            setStep(STEPS.ACCOUNT);
        }
    }, [sessionStatus]);

    const handleAccountCreation = async () => {
        setIsLoading(true);
        const toastId = toast.loading('Creating your account...');

        try {
            const res = await axios.post('/api/auth/signup', {
                name,
                email,
                password,
                role: 'PROFESSIONAL',
            });

            if (res.status === 201) {
                toast.success('Account created!', { id: toastId });

                const loginResult = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (!loginResult?.ok) {
                    throw new Error('Auto-login failed. Please try logging in manually.');
                }

                setStep(STEPS.SERVICES);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'An error occurred.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleProceedToQuestions = async () => {
        if (selectedServiceIds.length === 0) {
            toast.error("No service selected. Please go back.");
            return;
        }
        setIsLoading(true);
        try {
            const questionPromises = selectedServiceIds.map(id =>
                axios.get(`/api/admin/services/${id}/questions?type=PROFESSIONAL`)
            );
            const responses = await Promise.all(questionPromises);

            const questionsByService = responses.map((response, index) => {
                const serviceId = selectedServiceIds[index];
                const service = allServices.find(s => s.id === serviceId);
                return {
                    serviceName: service?.name || 'Service',
                    questions: response.data,
                };
            }).filter(group => group.questions.length > 0);

            setServiceQuestions(questionsByService);
            setStep(STEPS.QUESTIONS);
        } catch (error) {
            toast.error("Could not load service-specific questions.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishOnboarding = async () => {
        setIsLoading(true);
        try {
            const payload = {
                companyName,
                phoneNumber,
                pincode,
                locationName,
                selectedServiceIds,
                answers,
            };

            await axios.post('/api/professional/profile', payload);
            console.log("session before update:", session);
            await updateSession();
            console.log("session after update:", session);

            toast.success('Setup complete! Welcome aboard.');
            router.push('/professional/dashboard');
        } catch (error) {
            console.error("Onboarding finish error:", error);
            toast.error('Could not finalize your setup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep(prev => (prev && prev > STEPS.SERVICES ? prev - 1 : prev));
    };

    const handleAddService = (service: Service) => {
        if (!selectedServiceIds.includes(service.id)) {
            setSelectedServiceIds([...selectedServiceIds, service.id]);
        }
        setServiceSearchTerm('');
        setIsServiceDropdownOpen(false);
    };

    const handleRemoveService = (serviceId: string) => {
        setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
    };

    const filteredServices = serviceSearchTerm
        ? allServices.filter(s =>
            s.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) && !selectedServiceIds.includes(s.id)
        )
        : [];

    const renderStep = () => {
        if (step === null) {
            return (
                <div className='flex items-center justify-center py-12'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }
        switch (step) {
            case STEPS.ACCOUNT:
                return (
                    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                                <Building2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Professional!</h2>
                            <p className="text-gray-600">Let's create your account and get you started</p>
                        </div>
                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 group-hover:border-gray-300"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 group-hover:border-gray-300"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Create Password</label>
                                <input
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 group-hover:border-gray-300"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleAccountCreation}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 mt-8 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account & Continue</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                );
            case STEPS.SERVICES:
                return (
                    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                                <CheckCircle2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Services</h2>
                            <p className="text-gray-600">Select all services you offer. You can update this anytime.</p>
                        </div>

                        <div className="relative mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Services</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Type to search services..."
                                    value={serviceSearchTerm}
                                    onChange={(e) => { setServiceSearchTerm(e.target.value); setIsServiceDropdownOpen(true); }}
                                    onFocus={() => setIsServiceDropdownOpen(true)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 cursor-pointer"
                                />
                            </div>
                            {isServiceDropdownOpen && filteredServices.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 mt-2 rounded-xl shadow-2xl z-10 max-h-72 overflow-y-auto">
                                    {filteredServices.map(service => (
                                        <div
                                            key={service.id}
                                            onClick={() => handleAddService(service)}
                                            className="p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{service.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedServiceIds.length > 0 && (
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Selected Services</label>
                                <div className="flex flex-wrap gap-2.5">
                                    {selectedServiceIds.map(id => {
                                        const service = allServices.find(s => s.id === id);
                                        return service ? (
                                            <div
                                                key={id}
                                                className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm font-semibold px-4 py-2.5 rounded-full border-2 border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 group"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>{service.name}</span>
                                                <button
                                                    onClick={() => handleRemoveService(id)}
                                                    className="ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-colors cursor-pointer"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setStep(STEPS.DETAILS)}
                            disabled={selectedServiceIds.length === 0}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            <span>Continue to Details</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                );
            case STEPS.DETAILS:
                return (
                    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                                <Building2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Details</h2>
                            <p className="text-gray-600">Help us connect you with the right customers</p>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={session?.user?.name || ''}
                                    disabled
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium cursor-not-allowed"
                                />
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={session?.user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium cursor-not-allowed"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Building2 className="w-4 h-4" />
                                    Company Name <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Aman's Cleaning Co."
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 group-hover:border-gray-300 cursor-pointer"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Your contact number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 group-hover:border-gray-300 cursor-pointer"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Primary Work Pincode
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 400001"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 group-hover:border-gray-300 cursor-pointer"
                                    maxLength={6}
                                />
                                {isPincodeLoading && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        <span>Verifying pincode...</span>
                                    </div>
                                )}
                                {locationName && !isPincodeLoading && (
                                    <div className="flex items-center gap-2 mt-2 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-semibold text-green-700">{locationName}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleBack}
                                className="w-1/3 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                            <button
                                onClick={handleProceedToQuestions}
                                disabled={isLoading}
                                className="w-2/3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Continue</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                );
            case STEPS.QUESTIONS:
                return (
                    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                                <CheckCircle2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Almost Done!</h2>
                            <p className="text-gray-600">Answer a few questions to help us match you with clients</p>
                        </div>

                        <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {serviceQuestions.length > 0 ? (
                                serviceQuestions.map((group, groupIndex) => (
                                    <div key={group.serviceName} className="space-y-5">
                                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl shadow-md z-10">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
                                                    {groupIndex + 1}
                                                </div>
                                                Questions for {group.serviceName}
                                            </h3>
                                        </div>

                                        {group.questions.map((q, qIndex) => (
                                            <div key={q.id} className="bg-white border-2 border-gray-200 p-5 rounded-xl hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                                                <label className="flex items-start gap-3 text-sm font-semibold text-gray-800 mb-4">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex-shrink-0 mt-0.5">
                                                        {qIndex + 1}
                                                    </span>
                                                    <span className="flex-1">{q.text}</span>
                                                </label>

                                                {q.inputType === 'TEXT' && (
                                                    <input
                                                        type="text"
                                                        id={q.id}
                                                        value={answers[q.id] || ''}
                                                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 cursor-pointer"
                                                        placeholder="Type your answer here..."
                                                    />
                                                )}

                                                {q.inputType === 'SINGLE_CHOICE' && (
                                                    <div className="space-y-2.5">
                                                        {q.options.map(option => (
                                                            <label
                                                                key={option.id}
                                                                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:shadow-md transition-all duration-200 cursor-pointer group"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    id={option.id}
                                                                    name={q.id}
                                                                    value={option.text}
                                                                    checked={answers[q.id] === option.text}
                                                                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                                    className="h-5 w-5 text-blue-600 border-2 border-gray-300 focus:ring-4 focus:ring-blue-100 cursor-pointer"
                                                                />
                                                                <span className="flex-1 text-sm font-medium text-gray-700 group-has-[:checked]:text-blue-700 group-has-[:checked]:font-semibold">
                                                                    {option.text}
                                                                </span>
                                                                {answers[q.id] === option.text && (
                                                                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                                                )}
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 px-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200">
                                    <CheckCircle2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                    <p className="text-lg font-semibold text-blue-900">Perfect! No additional questions needed.</p>
                                    <p className="text-sm text-blue-700 mt-2">You're all set to get started!</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-200">
                            <button
                                onClick={handleBack}
                                className="w-1/3 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                            <button
                                onClick={handleFinishOnboarding}
                                disabled={isLoading}
                                className="w-2/3 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Finalizing...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Complete Setup & Start</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className='flex items-center justify-center py-12'>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100">
                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-600">
                            Step {step} of {Object.keys(STEPS).length}
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                            {Math.round(((step || 0) / Object.keys(STEPS).length) * 100)}% Complete
                        </span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out shadow-lg"
                            style={{ width: `${((step || 0) / Object.keys(STEPS).length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step Content */}
                {renderStep()}
            </div>
        </div>
    );
}