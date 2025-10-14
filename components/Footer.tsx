'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      setShowScroll(window.scrollY > 100); // Lower threshold for easier testing
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once in case user is already scrolled
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-r from-[#6B3F69] via-[#5A3359] to-[#6B3F69] text-white py-12 px-6 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
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
          className="fixed bottom-6 right-6 bg-[#8F5D8B] hover:bg-[#7C4D79] text-white p-3 cursor-pointer rounded-full shadow-lg transition z-50 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          {/* Up Arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </footer>
  );
}