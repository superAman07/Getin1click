"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, Check, X, CheckCircle2, KeyRound } from 'lucide-react';

const PasswordRequirement = ({ isValid, text }: { isValid: boolean; text: string }) => (
  <li className={`flex items-center transition-colors ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
    {isValid ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
    {text}
  </li>
);

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordValidations = {
    length: password.length >= 8,
    number: /\d/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    uppercase: /[A-Z]/.test(password),
  };
  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!isPasswordValid) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { token, password });
      setIsSuccess(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Password Reset Successful</h2>
          <p className="mt-2 text-sm text-gray-600">
            You can now log in with your new password.
          </p>
          <a href="/auth/login" className="mt-6 inline-block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <KeyRound className="mx-auto h-10 w-10 text-blue-600" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Set New Password</h2>
        </div>
        
        {error && !token ? (
          <div className="mt-6 text-center text-red-600 bg-red-50 p-4 rounded-md">
            <p>{error}</p>
            <a href="/auth/forgot-password" className="font-medium text-blue-600 hover:underline">Request a new link</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <ul className="text-sm space-y-1 mt-4">
              <PasswordRequirement isValid={passwordValidations.length} text="At least 8 characters" />
              <PasswordRequirement isValid={passwordValidations.uppercase} text="Contains an uppercase letter" />
              <PasswordRequirement isValid={passwordValidations.number} text="Contains a number" />
              <PasswordRequirement isValid={passwordValidations.specialChar} text="Contains a special character (!@#$...)" />
            </ul>

            <div>
              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || password !== confirmPassword}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}