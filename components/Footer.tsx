'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  // Show button after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-gradient-to-r from-[#6B3F69] via-[#5A3359] to-[#6B3F69] text-white py-12 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                {/* <Image
                  src=""
                  alt="GetInOncClick"
                  width={45}
                  height={45}
                  className="rounded-md"
                /> */}
                <span className="text-2xl font-bold tracking-wide">GetInOncClick</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed pr-6">
                We connect customers with trusted professionals to get the job done right. 
                Reliable services, verified experts & fast support — all in one platform.
              </p>
            </div>

            {/* About */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#E4C2E7]">About</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/Home" className="hover:text-[#E4C2E7] transition">Home</a></li>
                <li><a href="/about" className="hover:text-[#E4C2E7] transition">About</a></li>
                <li><a href="/Career" className="hover:text-[#E4C2E7] transition">Career</a></li>
                <li><a href="#" className="hover:text-[#E4C2E7] transition">Blog</a></li>
              </ul>
            </div>

            {/* For Customers */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#E4C2E7]">For Customers</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-[#E4C2E7] transition">Find a Professional</a></li>
                <li><a href="/Howitwork" className="hover:text-[#E4C2E7] transition">How it works</a></li>
                <li><a href="/login" className="hover:text-[#E4C2E7] transition">Login</a></li>
              </ul>
            </div>

            {/* For Professionals */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-[#E4C2E7]">For Professionals</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/Howitwork" className="hover:text-[#E4C2E7] transition">How it works</a></li>
                <li><a href="/joinasprofessional" className="hover:text-[#E4C2E7] transition">Join as Professional</a></li>
                <li><a href="/Helpcenter" className="hover:text-[#E4C2E7] transition">Help Centre</a></li>
              </ul>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-[#8F5D8B]"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Contact & Social */}
            <div className="flex flex-col md:flex-row items-center gap-5">
              <a
                href="/Contact"
                className="bg-[#8F5D8B] hover:bg-[#7C4D79] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg transition"
              >
                Contact Us
              </a>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-[#8F5D8B] p-2 rounded-full transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.25c7.55 0 11.68-6.25 11.68-11.68 0-.18 0-.36-.01-.53A8.35 8.35 0 0022 5.92a8.2 8.2 0 01-2.36.65 4.1 4.1 0 001.8-2.27 8.24 8.24 0 01-2.6.99 4.1 4.1 0 00-7 3.74 11.65 11.65 0 01-8.46-4.29 4.1 4.1 0 001.27 5.48 4.07 4.07 0 01-1.85-.5v.05a4.1 4.1 0 003.29 4.02 4.1 4.1 0 01-1.85.07 4.1 4.1 0 003.83 2.85A8.24 8.24 0 012 18.4a11.62 11.62 0 006.29 1.85"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-[#8F5D8B] p-2 rounded-full transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-[#8F5D8B] p-2 rounded-full transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73A1.75 1.75 0 116.5 3a1.75 1.75 0 010 3.73zM19 19h-3v-5.6c0-3.36-4-3.11-4 0V19h-3V8h3v1.76c1.4-2.58 7-2.78 7 2.48V19z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Trust Score & Links */}
            <div className="text-center md:text-right text-gray-300 text-sm space-y-2">
              <div>
                © 2025 GetInOncClick | 
                <a href="/Termandcondition" className="hover:text-[#E4C2E7] mx-1">Terms</a>|
                <a href="#" className="hover:text-[#E4C2E7] mx-1">Cookie</a>|
                <a href="/Privacypolicy" className="hover:text-[#E4C2E7] mx-1">Privacy</a>
              </div>
              <div className="font-medium">
                ⭐ TrustScore 4.1 • 104,920 reviews
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-[#8F5D8B] hover:bg-[#7C4D79] text-white p-3 rounded-full shadow-lg transition z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </footer>
    </>
  );
}
