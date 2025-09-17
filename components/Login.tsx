import { FaEnvelope, FaLock, FaKey, FaLink, FaApple, FaGoogle } from "react-icons/fa";
export default function Login(){
    return(
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8" style={{boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '20px',height: '600px'}}>
        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Login</h2>

        {/* Email */}
        <div className="mb-4 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaEnvelope />
          </span>
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaLock />
          </span>
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Keep me signed in */}
        <div className="flex items-center mb-6">
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember" className="text-sm text-gray-700">
            Keep me signed in
          </label>
          <span className="ml-1 text-gray-400 cursor-pointer text-sm">i</span>
        </div>

        {/* Login button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md flex justify-center items-center gap-2">
          <FaKey /> Login
        </button>

        {/* Forgot password */}
        <p className="text-sm text-gray-500 text-center mt-3 cursor-pointer">
          Forgot your password?
        </p>

        {/* OR Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Magic Link */}
        <button className="w-full border border-blue-500 text-blue-600 font-medium py-2 rounded-md hover:bg-blue-50 flex justify-center items-center gap-2">
          <FaLink /> Login with a magic link
        </button>

        {/* Apple Login */}
        <button className="w-full bg-black text-white font-medium py-2 rounded-md mt-3 flex justify-center items-center gap-2">
          <FaApple /> Sign in with Apple
        </button>

        {/* Google Login */}
        <button className="w-full bg-blue-500 text-white font-medium py-2 rounded-md mt-3 flex justify-center items-center gap-2">
          <FaGoogle /> Login with Google
        </button>
      </div>
    </div>
    
    );
}