'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Service } from '@/types/servicesTypes';

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
    const { data: session, status: sessionStatus } = useSession();
    const searchParams = useSearchParams();
    const initialService = searchParams.get('service');

    const [step, setStep] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for Step 2: Services
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

    // State for Step 3: Profile & Questions
    const [serviceQuestions, setServiceQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pincode, setPincode] = useState('');

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
            // This is a fallback, should not happen in normal flow
            toast.error("No service selected. Please go back.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/admin/services/${selectedServiceIds[0]}/questions?type=PROFESSIONAL`);
            setServiceQuestions(response.data);
            setStep(STEPS.QUESTIONS); // Move to the final step
        } catch (error) {
            toast.error("Could not load service-specific questions.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishOnboarding = async () => {
        setIsLoading(true);
        try {
            await axios.put('/api/professional/complete-onboarding');
            toast.success('Setup complete! Welcome aboard.');
            router.push('/professional/dashboard');
        } catch (error) {
            toast.error('Could not finalize your setup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                        <div className="space-y-2 max-h-60 overflow-y-auto border p-4 rounded-md">
                            {allServices.map(service => (
                                <div key={service.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={service.id}
                                        checked={selectedServiceIds.includes(service.id)}
                                        onChange={(e) => {
                                            setSelectedServiceIds(
                                                e.target.checked
                                                    ? [...selectedServiceIds, service.id]
                                                    : selectedServiceIds.filter(id => id !== service.id)
                                            );
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={service.id} className="ml-3 block text-sm font-medium text-gray-700">
                                        {service.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleProceedToProfile} className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700">
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
                                <input type="text" placeholder="e.g., 400001" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full p-3 border rounded-md" />
                            </div>
                        </div>
                        <button onClick={handleProceedToQuestions} disabled={isLoading} className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                            {isLoading ? 'Loading Questions...' : 'Next: Service Questions'}
                        </button>
                    </div>
                );
            case STEPS.QUESTIONS:
                return (
                    <div>
                        <h2 className="text-2xl font-bold">About Your Services</h2>
                        <p className="text-slate-600 mb-6">Answer a few questions to complete your profile.</p>

                        {/* The dynamic question rendering logic we built before */}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {serviceQuestions.length > 0 ? (
                                serviceQuestions.map(q => (
                                    <div key={q.id}>
                                        <label htmlFor={q.id} className="block text-sm font-medium text-gray-700 mb-1">{q.text}</label>
                                        {q.inputType === 'TEXT' && (
                                            <input
                                                type="text"
                                                id={q.id}
                                                value={answers[q.id] || ''}
                                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                className="w-full p-3 border rounded-md"
                                            />
                                        )}
                                        {q.inputType === 'SINGLE_CHOICE' && q.options.map(option => (
                                            <div key={option.id} className="flex items-center mt-2">
                                                <input
                                                    type="radio"
                                                    id={option.id}
                                                    name={q.id}
                                                    value={option.text}
                                                    checked={answers[q.id] === option.text}
                                                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <label htmlFor={option.id} className="ml-3 block text-sm text-gray-700">
                                                    {option.text}
                                                </label>
                                            </div>
                                        ))}
                                        {/* Add MULTIPLE_CHOICE handling if needed */}
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500">No specific questions for this service. You can proceed.</p>
                            )}
                        </div>

                        <button onClick={handleFinishOnboarding} disabled={isLoading} className="w-full bg-green-600 text-white p-3 mt-6 rounded-md hover:bg-green-700 disabled:bg-green-400">
                            {isLoading ? 'Saving...' : 'Finish & Go to Dashboard'}
                        </button>
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