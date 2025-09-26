"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import "./auth.css"

export default function AuthPage() {
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")

  const handleRegisterClick = () => setIsActive(true)
  const handleLoginClick = () => setIsActive(false)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      })

      if (result?.error) {
        setError("Invalid credentials. Please try again.")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("Something went wrong during login.")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          role: "CUSTOMER",
        }),
      })

      if (res.ok) { 
        handleLoginClick()
      } else {
        const data = await res.json()
        setError(data.message || "Registration failed.")
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="auth flex justify-center items-center">
      <div className={`container ${isActive ? "active" : ""}`}>
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        <div className="form-box Login">
          <h2 className="animation text-gray-300 font-extrabold" style={{ "--D": 0, "--S": 21 } as React.CSSProperties}>
            Login
          </h2>
          <form onSubmit={handleLoginSubmit}>
            {error && <p className="text-red-500">{error}</p>}
            <div className="input-box animation" style={{ "--D": 1, "--S": 22 } as React.CSSProperties}>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              <label>Email</label>
            </div>
            <div className="input-box animation" style={{ "--D": 2, "--S": 23 } as React.CSSProperties}>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <label>Password</label>
            </div>
            <button className="btn animation mt-12" type="submit" style={{ "--D": 3, "--S": 24 } as React.CSSProperties}>
              Login
            </button>
            <div className="regi-link animation" style={{ "--D": 4, "--S": 25 } as React.CSSProperties}>
              <p>
                Don't have an account? <br />{" "}
                <a href="#" className="SignUpLink" onClick={handleRegisterClick}>
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
        <div className="info-content Login">
          <h2 className="animation font-extrabold text-gray-50 text-3xl" style={{ "--D": 0, "--S": 20 } as React.CSSProperties}>
            WELCOME BACK!
          </h2>
          <p className="animation text-gray-50" style={{ "--D": 1, "--S": 21 } as React.CSSProperties}>
            We are happy to have you with us again. If you need anything, we are here to help.
          </p>
        </div>

        <div className="form-box Register">
          <h2 className="animation text-gray-300 font-extrabold" style={{ "--li": 17, "--S": 0 } as React.CSSProperties}>
            Register
          </h2>
          <form onSubmit={handleRegisterSubmit}>
            {error && <p className="text-red-500">{error}</p>}
            <div className="input-box animation" style={{ "--li": 18, "--S": 1 } as React.CSSProperties}>
              <input
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                required
              />
              <label>Username</label>
            </div>
            <div className="input-box animation" style={{ "--li": 19, "--S": 2 } as React.CSSProperties}>
              <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
              <label>Email</label>
            </div>
            <div className="input-box animation" style={{ "--li": 19, "--S": 3 } as React.CSSProperties}>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <label>Password</label>
            </div>
            <button className="btn animation mt-6" type="submit" style={{ "--li": 20, "--S": 4 } as React.CSSProperties}>
              Register
            </button>
            <div className="regi-link animation text-gray-300" style={{ "--li": 21, "--S": 5 } as React.CSSProperties}>
              <p>
                Already have an account? <br />{" "}
                <a href="#" className="SignInLink" onClick={handleLoginClick}>
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>
        <div className="info-content Register">
          <h2 className="animation text-gray-300 text-3xl font-extrabold" style={{ "--li": 17, "--S": 0 } as React.CSSProperties}>
            WELCOME!
          </h2>
          <p className="animation text-gray-300" style={{ "--li": 18, "--S": 1 } as React.CSSProperties}>
            We’re delighted to have you here. If you need any assistance, feel free to reach out.
          </p>
        </div>
      </div>
    </div>
  )
}
