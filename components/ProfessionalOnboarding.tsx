'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Define the steps
const STEPS = {
    ACCOUNT: 1,
    SERVICES: 2,
    PROFILE: 3,
};

export default function ProfessionalOnboarding() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialService = searchParams.get('service'); // Get service from previous page

    const [step, setStep] = useState(STEPS.ACCOUNT);

    // State for Step 1: Account Creation
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for future steps
    // const [selectedServices, setSelectedServices] = useState([initialService]);
    // const [postcode, setPostcode] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleAccountCreation = async () => {
        setIsLoading(true);
        const toastId = toast.loading('Creating your account...');

        try {
            // 1. Create the user account first
            const res = await axios.post('/api/auth/signup', {
                name,
                email,
                password,
                role: 'PROFESSIONAL',
            });

            if (res.status === 201) {
                toast.success('Account created!', { id: toastId });

                // 2. Automatically log the new user in
                const loginResult = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (!loginResult?.ok) {
                    throw new Error('Auto-login failed. Please try logging in manually.');
                }

                // 3. Move to the next step of the wizard
                setStep(STEPS.SERVICES);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'An error occurred.';
            toast.error(errorMessage, { id: toastId });
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
                        {/* Service selection UI will go here */}
                        <p>Initial service: {initialService}</p>
                        <button onClick={() => setStep(STEPS.PROFILE)} className="w-full bg-blue-600 text-white p-3 mt-6 rounded-md hover:bg-blue-700">
                            Next: Complete Profile
                        </button>
                    </div>
                );
            case STEPS.PROFILE:
                return (
                    <div>
                        <h2 className="text-2xl font-bold">Tell us about your business</h2>
                        {/* Postcode, business name, etc. will go here */}
                        <button
                            onClick={handleFinishOnboarding}
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white p-3 mt-6 rounded-md hover:bg-green-700 disabled:bg-green-400"
                        >
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
                {/* Progress Bar (optional but recommended) */}
                <div className="mb-8">
                    <div className="h-2 w-full bg-slate-200 rounded-full">
                        <div
                            className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${(step / Object.keys(STEPS).length) * 100}%` }}
                        ></div>
                    </div>
                </div>
                {renderStep()}
            </div>
        </div>
    );
}