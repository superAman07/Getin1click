'use client'
import Link from "next/link";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 pt-20">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-white via-purple-50 to-white py-16 flex flex-col items-center text-center px-4">
        <h1 className="font-bold text-4xl sm:text-5xl" style={{ marginTop: "-50px" }}>
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg max-w-2xl mt-4 text-gray-600">
          Receive unlimited leads for free. You only pay a small fee in credits to connect with the customers you choose. No commission, no hidden fees.
        </p>
        <Link href="/joinasprofessional" className="bg-purple-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-purple-700 transition mt-10 cursor-pointer font-semibold">
          Join as a Professional
        </Link>
      </section>

      {/* Section 1: Credits at the ready */}
      <section className="w-full bg-gray-50 py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">
        <div className="relative w-full md:w-1/2 flex justify-center mt-10 md:mt-20">
          <img
            src="/pricing-1.png"
            alt="A professional reviewing leads"
            className="w-full md:w-[500px] h-auto"
            style={{ marginTop: "-20px" }}
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left mt-10 md:mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Credits at the Ready
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6 text-lg">
            Our system is built on credits. Purchase a credit bundle that suits your needs, and you're ready to connect with potential clients.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Smart customers <span className="font-semibold text-purple-700">GetIn1Click it</span>, not Google it. They trust us to find relevant, verified professionals who can meet their needs.
          </p>
        </div>
      </section>

      {/* Section 2: You're in control */}
      <section className="w-full bg-white py-16 px-6 md:px-16 flex flex-col-reverse md:flex-row items-center md:items-start gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left mt-10 md:mt-40">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            You're in Control
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6 text-lg">
            You decide which leads you respond to. The credit cost for each lead is clearly displayed upfront, so you always know exactly how much you're spending.
          </p>
        </div>
        <div className="relative w-full md:w-1/2 flex justify-center mt-10 md:mt-20">
          <img
            src="/pricing-leads-GB.png"
            alt="A professional choosing a lead"
            className="w-full md:w-[500px] h-auto"
          />
        </div>
      </section>

      {/* Section 3: Get Hired Guarantee */}
      <section className="w-full bg-gray-50 py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">
        <div className="relative w-full md:w-1/2 flex justify-center mt-10 md:mt-20">
          <img
            src="/ghg-pricing.png"
            alt="A guarantee seal"
            className="w-full md:w-[450px] h-auto"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left mt-10 md:mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            New Business, Guaranteed
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6 text-lg">
            We’re so confident you’ll win business with your first credit pack, we offer a Get Hired Guarantee. If you don't, we'll return all your credits. No questions asked.
          </p>
        </div>
      </section>
    </div>
  );
}