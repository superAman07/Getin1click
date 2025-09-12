'use client';
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-white mt-auto border-t border-gray-200 py-12 px-4" style={{ backgroundColor: "#1a202c", width: "100%" }}>
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* For Customers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white-900 text-lg">For Customers</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Find a Professional
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* For Professionals */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white-900 text-lg">For Professionals</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Join as a Professional
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Help centre
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white-900 text-lg">About</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  About Bark
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Affiliates
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white-600 hover:text-blue-600 transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Right column - Contact and Social */}
          <div className="space-y-6">
            {/* Need help section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white-900 text-lg">Need help?</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                Contact us
              </button>
            </div>

            {/* Social media icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-white-400 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-white-400 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                </svg>
              </a>
              <a href="#" className="text-white-400 hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>

            {/* Country selector */}
            <div className="flex items-center space-x-2 text-white-600">
              <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors">
                <div className="w-6 h-4 bg-blue-600 relative overflow-hidden rounded-sm">
                  {/* UK Flag representation */}
                  <div className="absolute inset-0 bg-blue-600">
                    <div className="absolute inset-0 bg-white transform rotate-45 origin-center scale-150"></div>
                    <div className="absolute inset-0 bg-red-600 w-full h-0.5 top-1/2 transform -translate-y-1/2"></div>
                    <div className="absolute inset-0 bg-red-600 h-full w-0.5 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
                <span className="text-sm font-medium">United Kingdom</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

       
          </div>
        </div>

        {/* Copyright and legal links */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white-500">
              © 2025 Bark.com Global Limited.{" "}
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms & Conditions
              </a>{" "}
              /{" "}
              <a href="#" className="hover:text-blue-600 transition-colors">
                Cookie policy
              </a>{" "}
              /{" "}
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy policy
              </a>
            </div>
              {/* Trustpilot */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex text-green-500">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i} className={i < 4 ? "text-green-500" : "text-white-300"}>
                      {star}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-white-900">TrustScore 4.1</span>
              </div>
              <div className="text-xs text-white-500">
                <span className="font-medium">104,920</span> reviews
              </div>
              <div className="text-xs text-green-600 font-medium">
                ★ Trustpilot
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}