'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUp } from "lucide-react";
import axios from "axios";

interface TrustScoreData {
  isVisible: boolean;
  trustScore?: string;
  reviewCount?: number;
}

export default function Footer() {
  const { data: session, status } = useSession();
  const [showScroll, setShowScroll] = useState(false);
  const [trustScoreData, setTrustScoreData] = useState<TrustScoreData | null>(null);

  const isCustomer = status === 'authenticated' && session?.user?.role === 'CUSTOMER';

  useEffect(() => {

    axios.get<TrustScoreData>('/api/trust-score')
      .then(response => setTrustScoreData(response.data))
      .catch(err => console.error("Failed to fetch trust score", err));

    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const aboutLinks = [
    { href: "/about", label: "About Us" },
    { href: "/career", label: "Careers" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact Us" },
  ];

  const customerLinks = [
    { href: "/services", label: "Browse Services" },
    ...(isCustomer
      ? [{ href: "/customer/my-jobs", label: "My Jobs" }]
      : [{ href: "/auth/login", label: "Customer Login" }]),
    ...(isCustomer
      ? [{ href: "/customer/post-a-job", label: "Post a Job" }]
      : []),
  ];

  const professionalLinks = [
    { href: "/how-it-works", label: "How It Works for Pros" },
    { href: "/joinasprofessional", label: "Join as a Professional" },
    { href: "/helpcenter", label: "Help Center" },
  ];

  return (
    <footer className="bg-gradient-to-r from-[#252525] via-gray-800 to-[#252525] text-white py-12 px-6 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <img src="/logo-white.png" alt="GetIn1Click Logo" className="h-12" />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed pr-6">
              Connecting customers with trusted professionals to get the job done right.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#E4C2E7]">Company</h3>
            <ul className="space-y-2 text-sm">
              {aboutLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#E4C2E7]">For Customers</h3>
            <ul className="space-y-2 text-sm">
              {customerLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#E4C2E7]">For Professionals</h3>
            <ul className="space-y-2 text-sm">
              {professionalLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="text-gray-300 hover:text-white transition">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#8F5D8B] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left text-gray-300 text-sm space-y-2">
              <p>© {new Date().getFullYear()} GetIn1Click. All rights reserved.</p>
              <div>
                <Link href="/termandcondition" className="hover:text-white mx-1">Terms</Link>|
                <Link href="/privacypolicy" className="hover:text-white mx-1">Privacy</Link>
              </div>
            </div>
            {trustScoreData?.isVisible && (
              <div className="font-medium text-gray-300">
                ⭐ TrustScore {trustScoreData.trustScore} • {trustScoreData.reviewCount?.toLocaleString()} reviews
              </div>
            )}
          </div>
        </div>
      </div>

      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#8F5D8B] hover:bg-[#7C4D79] text-white p-3 cursor-pointer rounded-full shadow-lg transition z-50 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </footer>
  );
}