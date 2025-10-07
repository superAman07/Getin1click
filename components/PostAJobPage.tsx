'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, MapPin, IndianRupee } from 'lucide-react';

interface ServiceQuestion {
  id: string;
  text: string;
  inputType: 'TEXT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  options: { id: string; text: string }[];
}

interface ServiceDetails {
  id: string;
  name: string;
  questions: ServiceQuestion[];
}

const urgencyLevels = {
  LOW: 'Flexible / Just browsing',
  MEDIUM: 'Within a few weeks',
  HIGH: 'Urgently needed',
};

export default function PostAJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  const [step, setStep] = useState<'questions' | 'details'>('questions');
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pincode, setPincode] = useState('');
  const [locationName, setLocationName] = useState('');
  const [budget, setBudget] = useState('');
  const [urgency, setUrgency] = useState('MEDIUM');
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!serviceId) {
      router.push('/');
      return;
    }

    const fetchServiceDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/services/${serviceId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setService(data);
        if (data.questions.length === 0) {
          setStep('details');
          setShowOverlay(false);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId, router]);

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(newPincode);

    if (newPincode.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${newPincode}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setLocationName(`${postOffice.District}, ${postOffice.State}`);
        } else {
          setLocationName('Invalid Pincode');
        }
      } catch (error) {
        setLocationName('Could not verify');
      }
    } else {
      setLocationName('');
    }
  };

  const handleAnswerChange = (
    qId: string,
    value: any,
    type: ServiceQuestion['inputType']
  ) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      if (type === 'MULTIPLE_CHOICE') {
        const current = newAnswers[qId] || [];
        newAnswers[qId] = current.includes(value)
          ? current.filter((i: string) => i !== value)
          : [...current, value];
      } else {
        newAnswers[qId] = value;
      }
      return newAnswers;
    });
  };

  const handleNextStep = () => {
    setShowOverlay(false);
    setTimeout(() => {
      setStep('details');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || locationName.includes('Invalid')) {
      alert('Please enter a valid pincode.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/customer/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          budget,
          urgency,
          serviceId,
          answers,
          location: `${pincode}, ${locationName}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to post job');
      router.push('/customer/my-jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8 overflow-hidden">
      {showOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-out"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            opacity: showOverlay ? 1 : 0,
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden transform transition-all duration-300 ease-out"
            style={{
              transform: showOverlay ? 'scale(1)' : 'scale(0.95)',
              opacity: showOverlay ? 1 : 0,
            }}
          >
            <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                First, a few questions about your{' '}
                <span className="text-blue-600">{service?.name}</span> project
              </h2>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(85vh-180px)] custom-scrollbar">
              <div className="space-y-6">
                {service?.questions.map((q) => (
                  <div key={q.id} className="space-y-3">
                    <label className="block text-base font-semibold text-slate-700">
                      {q.text}
                    </label>

                    {q.inputType === 'TEXT' && (
                      <input
                        type="text"
                        onChange={(e) =>
                          handleAnswerChange(q.id, e.target.value, q.inputType)
                        }
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 ease-out"
                        placeholder="Type your answer..."
                      />
                    )}

                    {q.inputType === 'SINGLE_CHOICE' && (
                      <div className="space-y-2">
                        {q.options.map((opt) => (
                          <label
                            key={opt.id}
                            className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-200 ease-out hover:border-blue-300 hover:bg-blue-50/50"
                            style={{
                              borderColor:
                                answers[q.id] === opt.text
                                  ? '#3b82f6'
                                  : undefined,
                              backgroundColor:
                                answers[q.id] === opt.text
                                  ? '#eff6ff'
                                  : undefined,
                            }}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt.text}
                              checked={answers[q.id] === opt.text}
                              onChange={(e) =>
                                handleAnswerChange(
                                  q.id,
                                  e.target.value,
                                  q.inputType
                                )
                              }
                              className="sr-only"
                            />
                            <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center transition-all duration-200 ease-out"
                              style={{
                                borderColor:
                                  answers[q.id] === opt.text
                                    ? '#3b82f6'
                                    : undefined,
                              }}
                            >
                              {answers[q.id] === opt.text && (
                                <div className="w-3 h-3 rounded-full bg-blue-600 transition-all duration-200 ease-out" />
                              )}
                            </div>
                            <span className="text-slate-700 font-medium">
                              {opt.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.inputType === 'MULTIPLE_CHOICE' && (
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isChecked =
                            (answers[q.id] || []).includes(opt.text);
                          return (
                            <label
                              key={opt.id}
                              className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition-all duration-200 ease-out hover:border-blue-300 hover:bg-blue-50/50"
                              style={{
                                borderColor: isChecked ? '#3b82f6' : undefined,
                                backgroundColor: isChecked
                                  ? '#eff6ff'
                                  : undefined,
                              }}
                            >
                              <input
                                type="checkbox"
                                value={opt.text}
                                checked={isChecked}
                                onChange={() =>
                                  handleAnswerChange(
                                    q.id,
                                    opt.text,
                                    q.inputType
                                  )
                                }
                                className="sr-only"
                              />
                              <div
                                className="flex-shrink-0 w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center transition-all duration-200 ease-out"
                                style={{
                                  borderColor: isChecked
                                    ? '#3b82f6'
                                    : undefined,
                                  backgroundColor: isChecked
                                    ? '#3b82f6'
                                    : undefined,
                                }}
                              >
                                {isChecked && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-slate-700 font-medium">
                                {opt.text}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleNextStep}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`w-full max-w-4xl mx-auto transition-all duration-300 ease-out ${
          showOverlay ? 'blur-sm pointer-events-none' : 'blur-0'
        }`}
        style={{
          opacity: showOverlay ? 0.6 : 1,
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Almost there! Just a few more details.
          </h1>
          <p className="text-slate-600">
            Help professionals understand your project better
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g., 'Kitchen Sink Leak Repair'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 ease-out"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              placeholder="Describe the work in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 ease-out resize-none custom-scrollbar"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Project Location (Pincode)
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={handlePincodeChange}
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 ease-out"
                  required
                />
              </div>
              {locationName && (
                <p
                  className={`text-sm mt-1 transition-colors duration-200 ${
                    locationName.includes('Invalid')
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {locationName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Your Budget
              </label>
              <div className="relative">
                <IndianRupee
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="number"
                  placeholder="e.g., 15000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 ease-out"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 ease-out bg-white cursor-pointer"
              required
            >
              {Object.entries(urgencyLevels).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:bg-blue-400 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              'Submit Job Request'
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
