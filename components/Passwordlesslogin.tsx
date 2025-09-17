import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

export default function Passwordlesslogin()
{
    return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white p-10 rounded-lg shadow-md" style={{boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '20px',height: '500px'}}>
        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          Passwordless <br /> login
        </h2>

        {/* Email */}
        <div className="mb-6 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaEnvelope />
          </span>
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Send button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md flex justify-center items-center gap-2">
          <FaPaperPlane /> Send
        </button>

        {/* Return to login */}
        <p className="text-sm text-gray-500 mt-6 cursor-pointer hover:underline">
          Return to login
        </p>
      </div>
    </div>
    );
}