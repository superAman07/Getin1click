"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import toast from "react-hot-toast"
import { CheckCircle, Users } from "lucide-react"

type AuthFormsProps = {
  initialMode: "login" | "signup"
}

const calculatePasswordStrength = (password: string) => {
  if (!password) return 0
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z\d]/.test(password)) strength++
  return Math.min(5, strength)
}

const getStrengthColor = (strength: number) => {
  if (strength === 0) return "bg-gray-300"
  if (strength <= 2) return "bg-red-500"
  if (strength <= 3) return "bg-yellow-500"
  if (strength <= 4) return "bg-blue-500"
  return "bg-green-500"
}

const getStrengthLabel = (strength: number) => {
  if (strength === 0) return ""
  if (strength <= 2) return "Weak"
  if (strength <= 3) return "Fair"
  if (strength <= 4) return "Good"
  return "Strong"
}

export default function AuthPage({ initialMode }: AuthFormsProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [isActive, setIsActive] = useState(initialMode === "signup")
  const [isLoading, setIsLoading] = useState(false)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    setIsActive(initialMode === "signup")
  }, [initialMode])

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (initialMode !== "signup") {
      router.push("/auth/signup", { scroll: false })
    }
  }

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (initialMode !== "login") {
      router.push("/auth/login", { scroll: false })
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") {
        router.push("/admin")
      } else if (session?.user?.role === "PROFESSIONAL") {
        router.push("/professional")
      } else if (session?.user?.role === "CUSTOMER") {
        router.push("/customer/home")
      } else {
        router.push("/")
      }
    }
  }, [status, session, router])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading("Logging in...")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      })

      if (result?.error) {
        toast.error(result.error, { id: toastId })
      } else {
        toast.success("Logged in successfully!", { id: toastId })
      }
    } catch (err) {
      toast.error("An unexpected error occurred.", { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading("Registering...")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          name: registerUsername,
          role: "CUSTOMER",
        }),
      })

      if (res.ok) {
        toast.success("Registration successful! Please log in.", { id: toastId })
      } else {
        const data = await res.json()
        toast.error(data.message || "Registration failed.", { id: toastId })
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[rgb(232,229,230)] to-white flex items-center justify-center p-0 overflow-hidden relative">
      <style>{`
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Static bubble background - fixed position, low opacity, no animation */
        .bubble-bg {
          position: fixed;
          border-radius: 50%;
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }

        .slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
        .slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
        .fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }

        input:focus { outline: none; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="bubble-bg w-80 h-80 bg-gradient-to-br from-[#d23d88] to-[#8b4c9c] rounded-full top-10 left-10 blur-3xl"></div>
        <div className="bubble-bg w-96 h-96 bg-gradient-to-br from-[#f8a15e] to-[#ee3f7f] rounded-full top-1/4 right-20 blur-3xl"></div>
        <div className="bubble-bg w-72 h-72 bg-gradient-to-br from-[#3a509f] to-[#d23d88] rounded-full bottom-32 left-1/4 blur-3xl"></div>
        <div className="bubble-bg w-64 h-64 bg-gradient-to-br from-[#f06d6d] to-[#fcd6bb] rounded-full bottom-10 right-10 blur-3xl"></div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full h-screen relative z-10">
        {/* Left Side - Login Form + Customer Hero */}
        {!isActive && (
          <div className="w-full flex">
            <div
              className="w-1/2 flex items-center justify-center p-12"
              style={{ animation: "slide-in-left 0.8s ease-out" }}
            >
              <div className="w-full max-w-md">
                <div className="mb-8">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-[#3a509f] to-[#d23d88] bg-clip-text text-transparent mb-2">
                    Welcome <span className="text-cerise"> Back</span>
                  </h1>
                  <p className="text-gray-600 text-lg">Sign in to access your account.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">Email Address</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#8b4c9c] focus:shadow-lg focus:shadow-[#8b4c9c]/20 cursor-text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#8b4c9c] focus:shadow-lg focus:shadow-[#8b4c9c]/20 cursor-text pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#8b4c9c] cursor-pointer transition-colors duration-200"
                      >
                        {showLoginPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <a
                      href="/auth/forgot-password"
                      className="text-sm font-semibold text-[#8b4c9c] hover:text-[#d23d88] transition-colors duration-200 cursor-pointer"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-7 py-3.5 bg-gradient-to-r from-[#3a509f] to-[#8b4c9c] hover:shadow-lg hover:shadow-[#8b4c9c]/30 hover:scale-105 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>

                  <div className="mt-7 text-center">
                    <p className="text-gray-600 text-sm">
                      Don't have an account?{" "}
                      <button
                        onClick={handleRegisterClick}
                        className="font-bold text-[#d23d88] hover:text-[#8b4c9c] transition-colors duration-200 cursor-pointer"
                      >
                        Create one
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Hero - Customer Welcome */}
            <div
              className="w-1/2 bg-gradient-to-br from-[#3a509f]/10 to-[#d23d88]/10 flex flex-col items-center justify-center p-12 relative overflow-hidden"
              style={{ animation: "fade-in-up 0.8s ease-out 0.2s forwards" }}
            >
              <div className="relative z-10 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#f8a15e] to-[#d23d88] rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-4xl">👤</span>
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-chambray mb-2">The Perfect Connection</h2>
                <p className="text-jumbo mb-10">Where Expertise Meets Opportunity</p>
                <ul className="space-y-6 text-left max-w-sm mx-auto">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-affair mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-chambray">For Customers</h3>
                      <p className="text-jumbo text-sm">Find and hire trusted professionals for any project.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-affair mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-chambray">For Professionals</h3>
                      <p className="text-jumbo text-sm">Get quality leads and grow your business.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-affair mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-chambray">For Everyone</h3>
                      <p className="text-jumbo text-sm">Enjoy secure payments and seamless communication.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="absolute top-10 right-10 w-32 h-32 bg-[#f8a15e]/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#d23d88]/20 rounded-full blur-xl"></div>
            </div>
          </div>
        )}

        {/* Right Side - Signup Form + Professional Hero */}
        {isActive && (
          <div className="w-full flex">
            {/* Left Hero - Professional Welcome */}
            <div
              className="w-1/2 bg-gradient-to-br from-[#d23d88]/10 to-[#f8a15e]/10 flex flex-col items-center justify-center p-12 relative overflow-hidden"
              style={{ animation: "fade-in-up 0.8s ease-out 0.2s forwards" }}
            >
              <div className="relative z-10 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#d23d88] to-[#f8a15e] rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-4xl">⭐</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#d23d88] mb-3">For Professionals</h2>
                  <p className="text-gray-700 text-lg font-medium">Grow Your Business & Reputation</p>
                </div>

                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">✓</div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 mb-1">Showcase Your Skills</h3>
                      <p className="text-gray-600 text-sm">Build your professional portfolio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">✓</div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 mb-1">Get Quality Leads</h3>
                      <p className="text-gray-600 text-sm">Connect with serious clients</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">✓</div>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 mb-1">Grow Your Income</h3>
                      <p className="text-gray-600 text-sm">Increase earning opportunities</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-10 left-10 w-32 h-32 bg-[#d23d88]/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#f8a15e]/20 rounded-full blur-xl"></div>
            </div>

            <div
              className="w-1/2 flex items-center justify-center p-12"
              style={{ animation: "slide-in-right 0.8s ease-out" }}
            >
              <div className="w-full max-w-md">
                <div className="mb-8">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-[#d23d88] to-[#f8a15e] bg-clip-text text-transparent mb-2">
                    Join Today
                  </h1>
                  <p className="text-gray-600 text-lg">Create your account</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">Full Name</label>
                    <input
                      type="text"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#f8a15e] focus:shadow-lg focus:shadow-[#f8a15e]/20 cursor-text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">Email Address</label>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#f8a15e] focus:shadow-lg focus:shadow-[#f8a15e]/20 cursor-text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">Password</label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => {
                          setRegisterPassword(e.target.value)
                          setPasswordStrength(calculatePasswordStrength(e.target.value))
                        }}
                        required
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#f8a15e] focus:shadow-lg focus:shadow-[#f8a15e]/20 cursor-text pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#f8a15e] cursor-pointer transition-colors duration-200"
                      >
                        {showLoginPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>

                    {registerPassword && (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-200"
                                }`}
                            ></div>
                          ))}
                        </div>
                        <p
                          className={`text-xs font-semibold ${passwordStrength <= 2
                            ? "text-red-500"
                            : passwordStrength <= 3
                              ? "text-yellow-500"
                              : passwordStrength <= 4
                                ? "text-blue-500"
                                : "text-green-500"
                            }`}
                        >
                          Password Strength: {getStrengthLabel(passwordStrength)}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-7 py-3.5 bg-gradient-to-r from-[#d23d88] to-[#f8a15e] hover:shadow-lg hover:shadow-[#f8a15e]/30 hover:scale-105 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </button>

                  <div className="mt-7 text-center">
                    <p className="text-gray-600 text-sm">
                      Already have an account?{" "}
                      <button
                        onClick={handleLoginClick}
                        className="font-bold text-[#d23d88] hover:text-[#f8a15e] transition-colors duration-200 cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Layout - Single Form View */}
      <div className="lg:hidden w-full flex items-center justify-center p-4 sm:p-6">
        {/* Mobile Login */}
        {!isActive && (
          <div className="w-full max-w-md" style={{ animation: "slide-in-left 0.8s ease-out" }}>
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#3a509f] to-[#d23d88] bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">Continue your professional journey</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#8b4c9c] focus:shadow-lg focus:shadow-[#8b4c9c]/20 cursor-text"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#8b4c9c] focus:shadow-lg focus:shadow-[#8b4c9c]/20 cursor-text pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#8b4c9c] cursor-pointer transition-colors duration-200"
                  >
                    {showLoginPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-[#8b4c9c] hover:text-[#d23d88] transition-colors duration-200 cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-7 py-3.5 bg-gradient-to-r from-[#3a509f] to-[#8b4c9c] hover:shadow-lg hover:shadow-[#8b4c9c]/30 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="mt-7 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={handleRegisterClick}
                    className="font-bold text-[#d23d88] hover:text-[#8b4c9c] transition-colors duration-200 cursor-pointer"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Signup */}
        {isActive && (
          <div className="w-full max-w-md" style={{ animation: "slide-in-right 0.8s ease-out" }}>
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#d23d88] to-[#f8a15e] bg-clip-text text-transparent mb-2">
                Join Today
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">Create your account</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">Full Name</label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#f8a15e] focus:shadow-lg focus:shadow-[#f8a15e]/20 cursor-text"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">Email Address</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#f8a15e] focus:shadow-lg focus:shadow-[#f8a15e]/20 cursor-text"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value)
                      setPasswordStrength(calculatePasswordStrength(e.target.value))
                    }}
                    required
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-[#d23d88] focus:border-[#f8a15e] focus:shadow-lg focus:shadow-[#f8a15e]/20 cursor-text pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#f8a15e] cursor-pointer transition-colors duration-200"
                  >
                    {showLoginPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>

                {registerPassword && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? getStrengthColor(passwordStrength) : "bg-gray-200"
                            }`}
                        ></div>
                      ))}
                    </div>
                    <p
                      className={`text-xs font-semibold ${passwordStrength <= 2
                        ? "text-red-500"
                        : passwordStrength <= 3
                          ? "text-yellow-500"
                          : passwordStrength <= 4
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                    >
                      Password Strength: {getStrengthLabel(passwordStrength)}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-7 py-3.5 bg-gradient-to-r from-[#d23d88] to-[#f8a15e] hover:shadow-lg hover:shadow-[#f8a15e]/30 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>

              <div className="mt-7 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={handleLoginClick}
                    className="font-bold text-[#d23d88] hover:text-[#f8a15e] transition-colors duration-200 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div >
  )
}





// "use client"

// import type React from "react"
// import { useEffect, useRef, useState } from "react"
// import { signIn, useSession } from "next-auth/react"
// import { useParams, useRouter } from "next/navigation"
// import "./auth.css"
// import { FaEye, FaEyeSlash } from "react-icons/fa"
// import toast from "react-hot-toast"

// type AuthFormsProps = {
//   initialMode: 'login' | 'signup';
// };

// export default function AuthPage({ initialMode }: AuthFormsProps) {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const animatedShapeRef = useRef<HTMLDivElement>(null);

//   const [isActive, setIsActive] = useState(initialMode === 'signup');
//   const [isLoading, setIsLoading] = useState(false);

//   const [loginEmail, setLoginEmail] = useState("")
//   const [loginPassword, setLoginPassword] = useState("")
//   const [showLoginPassword, setShowLoginPassword] = useState(false);

//   const [registerEmail, setRegisterEmail] = useState("")
//   const [registerPassword, setRegisterPassword] = useState("")
//   const [registerUsername, setRegisterUsername] = useState("")

//   useEffect(() => {
//     setIsActive(initialMode === 'signup');
//   }, [initialMode]);

//   const handleAnimatedNavigation = (path: string, newIsActiveState: boolean) => {
//     const animatedElement = animatedShapeRef.current;
//     if (!animatedElement) return;

//     const navigate = () => {
//       router.push(path, { scroll: false });
//       animatedElement.removeEventListener('transitionend', navigate);
//     };

//     animatedElement.addEventListener('transitionend', navigate, { once: true });

//     setIsActive(newIsActiveState);
//   };

//   const handleRegisterClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (initialMode !== 'signup') {
//       handleAnimatedNavigation('/auth/signup', true);
//     }
//   };

//   const handleLoginClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (initialMode !== 'login') {
//       handleAnimatedNavigation('/auth/login', false);
//     }
//   };

//   useEffect(() => {
//     if (status === 'authenticated') {
//       if (session?.user?.role === 'ADMIN') {
//         router.push('/admin');
//       } else if (session?.user?.role === 'PROFESSIONAL') {
//         router.push('/professional')
//       } else if (session?.user?.role === 'CUSTOMER') { // <-- Add this block
//         router.push('/customer/home');
//       } else {
//         router.push('/');
//       }
//     }
//   }, [status, session, router]);

//   const handleLoginSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true);
//     const toastId = toast.loading('Logging in...');

//     try {
//       const result = await signIn("credentials", {
//         redirect: false,
//         email: loginEmail,
//         password: loginPassword,
//       })

//       if (result?.error) {
//         toast.error(result.error, { id: toastId });
//       } else {
//         toast.success('Logged in successfully!', { id: toastId });
//         // router.push("/")
//         // router.refresh()
//       }
//     } catch (err) {
//       toast.error('An unexpected error occurred.', { id: toastId });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const handleRegisterSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true);
//     const toastId = toast.loading('Registering...');

//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: registerEmail,
//           password: registerPassword,
//           name: registerUsername,
//           role: "CUSTOMER",
//         }),
//       })

//       if (res.ok) {
//         toast.success('Registration successful! Please log in.', { id: toastId });
//       } else {
//         const data = await res.json();
//         toast.error(data.message || 'Registration failed.', { id: toastId });
//       }
//     } catch (err: any) {
//       toast.error(err.message, { id: toastId });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="auth h-[100vh] bg-white flex justify-center items-center">
//       <div className={`container ${isActive ? "active" : ""}`}>
//         <div ref={animatedShapeRef} className="curved-shape"></div>
//         <div className="curved-shape2"></div>

//         <div className="form-box Login">
//           <h2 className="animation text-gray-300 font-extrabold" style={{ "--D": 0, "--S": 21 } as React.CSSProperties}>
//             Login
//           </h2>
//           <form onSubmit={handleLoginSubmit}>
//             <div className="input-box animation" style={{ "--D": 1, "--S": 22 } as React.CSSProperties}>
//               <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
//               <label>Email</label>
//             </div>
//             <div className="input-box animation" style={{ "--D": 2, "--S": 23 } as React.CSSProperties}>
//               <input
//                 type={`${showLoginPassword ? 'text' : 'password'}`}
//                 value={loginPassword}
//                 onChange={(e) => setLoginPassword(e.target.value)}
//                 required
//               />
//               <label>Password</label>
//               <span onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-white">
//                 {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             <div className="text-right mt-3 animation" style={{ "--D": 2, "--S": 23 } as React.CSSProperties}>
//               <a href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-white hover:underline">
//                 Forgot Password?
//               </a>
//             </div>
//             <button className="btn animation mt-6" type="submit" style={{ "--D": 3, "--S": 24 } as React.CSSProperties}>
//               {isLoading ? 'Loading...' : 'Login'}
//             </button>
//             <div className="regi-link animation" style={{ "--D": 4, "--S": 25 } as React.CSSProperties}>
//               <p>
//                 Don't have an account? <br />{" "}
//                 <a href="#" className="SignUpLink" onClick={handleRegisterClick}>
//                   Sign Up
//                 </a>
//               </p>
//             </div>
//           </form>
//         </div>
//         <div className="info-content Login">
//           <h2 className="animation font-extrabold text-gray-50 text-3xl" style={{ "--D": 0, "--S": 20 } as React.CSSProperties}>
//             WELCOME BACK!
//           </h2>
//           <p className="animation text-gray-50" style={{ "--D": 1, "--S": 21 } as React.CSSProperties}>
//             We are happy to have you with us again. If you need anything, we are here to help.
//           </p>
//         </div>

//         <div className="form-box Register">
//           <h2 className="animation text-gray-300 font-extrabold" style={{ "--li": 17, "--S": 0 } as React.CSSProperties}>
//             Register
//           </h2>
//           <form onSubmit={handleRegisterSubmit}>
//             <div className="input-box animation" style={{ "--li": 18, "--S": 1 } as React.CSSProperties}>
//               <input
//                 type="text"
//                 value={registerUsername}
//                 onChange={(e) => setRegisterUsername(e.target.value)}
//                 required
//               />
//               <label>Username</label>
//             </div>
//             <div className="input-box animation" style={{ "--li": 19, "--S": 2 } as React.CSSProperties}>
//               <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
//               <label>Email</label>
//             </div>
//             <div className="input-box animation" style={{ "--li": 19, "--S": 3 } as React.CSSProperties}>
//               <input type={showLoginPassword ? 'text' : 'password'} value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required autoComplete="new-password" />
//               <label>Password</label>
//               <span onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-white">
//                 {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             <button className="btn animation mt-6" type="submit" style={{ "--li": 20, "--S": 4 } as React.CSSProperties}>
//               {isLoading ? 'Loading...' : 'Register'}
//             </button>
//             <div className="regi-link animation text-gray-300" style={{ "--li": 21, "--S": 5 } as React.CSSProperties}>
//               <p>
//                 Already have an account? <br />{" "}
//                 <a href="#" className="SignInLink" onClick={handleLoginClick}>
//                   Sign In
//                 </a>
//               </p>
//             </div>
//           </form>
//         </div>
//         <div className="info-content Register">
//           <h2 className="animation text-gray-300 text-3xl font-extrabold" style={{ "--li": 17, "--S": 0 } as React.CSSProperties}>
//             WELCOME!
//           </h2>
//           <p className="animation text-gray-300" style={{ "--li": 18, "--S": 1 } as React.CSSProperties}>
//             We’re delighted to have you here. If you need any assistance, feel free to reach out.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }
