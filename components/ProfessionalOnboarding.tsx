'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Service } from '@/types/servicesTypes';
import { X } from 'lucide-react';

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
    const { data: session, status: sessionStatus , update: updateSession } = useSession();
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
            return <div className='loader'>Loading onboarding step...</div>;
        }
        switch (step) {
            case STEPS.ACCOUNT:
                return (
                    <div>
                        <h2 className="text-2xl font-bold">Create your Professional Account</h2>
                        <p className="text-slate-600 mb-6">Let's start with the basics.</p>
                        <div className="space-y-4">
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-md" />
                            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-md" />
                            <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-md" />
                        </div>
                        <button onClick={handleAccountCreation} disabled={isLoading} className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Creating...' : 'Next: Choose Services'}
                        </button>
                    </div>
                );
            case STEPS.SERVICES:
                return (
                    <div>
                        <h2 className="text-2xl font-bold">What services do you offer?</h2>
                        <p className="text-slate-600 mb-6">Select all that apply. You can change this later.</p>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for a service..."
                                value={serviceSearchTerm}
                                onChange={(e) => { setServiceSearchTerm(e.target.value); setIsServiceDropdownOpen(true); }}
                                onFocus={() => setIsServiceDropdownOpen(true)}
                                className="w-full p-3 border rounded-md"
                            />
                            {isServiceDropdownOpen && filteredServices.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {filteredServices.map(service => (
                                        <div key={service.id} onClick={() => handleAddService(service)} className="p-3 hover:bg-slate-100 cursor-pointer">
                                            {service.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Services Tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedServiceIds.map(id => {
                                const service = allServices.find(s => s.id === id);
                                return service ? (
                                    <div key={id} className="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                        {service.name}
                                        <button onClick={() => handleRemoveService(id)} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : null;
                            })}
                        </div>
                        <button onClick={handleProceedToProfile} className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700 cursor-pointer">
                            Next: Your Details
                        </button>
                    </div>
                );
            case STEPS.DETAILS:
                return (
                    <div>
                        <h2 className="text-2xl font-bold">Your Business Details</h2>
                        <p className="text-slate-600 mb-6">This helps us connect you with the right customers.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Your name</label>
                                <input type="text" value={session?.user?.name || ''} disabled className="w-full p-3 border rounded-md bg-slate-100 cursor-not-allowed" />
                            </div>
                            {/* Add email field as requested */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">Email address</label>
                                <input type="email" value={session?.user?.email || ''} disabled className="w-full p-3 border rounded-md bg-slate-100 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Company name (optional)</label>
                                <input type="text" placeholder="e.g., Aman's Cleaning Co." value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Phone number</label>
                                <input type="tel" placeholder="Your contact number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Primary work pincode</label>
                                <input type="text" placeholder="e.g., 400001" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full p-3 border rounded-md" maxLength={6} />
                                {isPincodeLoading && <p className="text-xs text-slate-500 mt-1">Verifying...</p>}
                                {locationName && <p className="text-sm text-green-600 font-medium mt-1">{locationName}</p>}
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button onClick={handleBack} className="w-1/3 bg-slate-200 text-slate-800 p-3 rounded-md hover:bg-slate-300 cursor-pointer">
                                Back
                            </button>
                            <button onClick={handleProceedToQuestions} disabled={isLoading} className="w-2/3 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 cursor-pointer">
                                {isLoading ? 'Loading...' : 'Next'}
                            </button>
                        </div>
                    </div>
                );
            case STEPS.QUESTIONS:
                return (
                    <div>
                        <h2 className="text-2xl font-bold">About Your Services</h2>
                        <p className="text-slate-600 mb-6">A few final questions to help us match you with the right clients.</p>

                        <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 -mr-4">
                            {serviceQuestions.length > 0 ? (
                                serviceQuestions.map(group => (
                                    <div key={group.serviceName} className="space-y-6">
                                        {/* Service Group Header */}
                                        <h3 className="font-semibold text-lg text-slate-800 border-b pb-2">
                                            For {group.serviceName}
                                        </h3>
                                        
                                        {/* Questions within the group */}
                                        {group.questions.map(q => (
                                            <div key={q.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                <label className="block text-sm font-medium text-gray-800 mb-3">{q.text}</label>
                                                
                                                {/* Renders a Text Input */}
                                                {q.inputType === 'TEXT' && (
                                                    <input
                                                        type="text"
                                                        id={q.id}
                                                        value={answers[q.id] || ''}
                                                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                        className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 transition"
                                                    />
                                                )}

                                                {/* Renders Radio Button Options */}
                                                {q.inputType === 'SINGLE_CHOICE' && (
                                                    <div className="space-y-2">
                                                        {q.options.map(option => (
                                                            <label key={option.id} className="flex items-center p-3 border rounded-md hover:bg-slate-100 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400 transition cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    id={option.id}
                                                                    name={q.id}
                                                                    value={option.text}
                                                                    checked={answers[q.id] === option.text}
                                                                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                                />
                                                                <span className="ml-3 block text-sm text-gray-700">{option.text}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 px-6 bg-slate-50 rounded-lg">
                                    <p className="text-slate-600">No specific questions for your selected services. You're all set!</p>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button onClick={handleBack} className="w-1/3 bg-slate-200 text-slate-800 p-3 rounded-md hover:bg-slate-300 transition cursor-pointer">
                                Back
                            </button>
                            <button onClick={handleFinishOnboarding} disabled={isLoading} className="w-2/3 bg-green-600 text-white p-3 rounded-md hover:bg-green-700 disabled:bg-green-400 transition cursor-pointer">
                                {isLoading ? 'Saving...' : 'Finish & Go to Dashboard'}
                            </button>
                        </div>
                    </div>
                );
            default:
                return <div>Loading...</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
                <div className="mb-8">
                    <div className="h-2 w-full bg-slate-200 rounded-full">
                        <div
                            className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${((step || 0) / Object.keys(STEPS).length) * 100}%` }}
                        ></div>
                    </div>
                </div>
                {renderStep()}
            </div>
        </div>
    );
}