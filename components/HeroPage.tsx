// components/HeroPage.tsx
'use client';
import Image from "next/image";

export default function HeroPage() {
    return (
        <div className="mt-[250px] relative">
            <div className="w-full bg-white py-20 px-4 mt-96" style={{ marginTop: "" }}>
                <div className="max-w-3xl mx-auto text-start">
                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0c1445] leading-snug">
                        Find the perfect <br className="hidden sm:block" /> professional for you
                    </h2>

                    {/* Subheading */}
                    <h4 className="mt-3 text-lg text-gray-400">
                        Get free quotes within minutes
                    </h4>

                    {/* Search Box */}
                    <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center w-full gap-0">
                        <input
                            type="text"
                            placeholder="What service are you looking for?"
                            className="flex-1 px-4 py-4 border border-gray-300 rounded-t-md sm:rounded-l-md sm:rounded-tr-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Postcode"
                            className="w-full sm:w-40 px-4 py-4 border border-gray-300 border-t-0 sm:border-t sm:border-l-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-b-md sm:rounded-r-md sm:rounded-bl-none shadow-md transition">
                            Search
                        </button>
                    </div>

                    {/* Popular Links */}
                    <p className="mt-6 text-sm text-gray-400">
                        Popular:{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            House Cleaning
                        </a>
                        ,{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Web Design
                        </a>
                        ,{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Personal Trainers
                        </a>
                    </p>
                </div>
            </div>
            <div className="relative  overflow-hidden bg-white py-6">
                {/* Wrapper for marquee */}
                <div className="flex animate-marquee space-x-6">
                    {/* Card 1 */}
                    <div className="relative w-80 h-60 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src="/gardening.jpg"
                            alt="Gardening"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 text-white font-semibold">
                            Gardening
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative w-80 h-60 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src="/accounting.jpg"
                            alt="Accounting"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Available online
                        </div>
                        <div className="absolute bottom-2 left-2 text-white font-semibold">
                            Accounting
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative w-80 h-60 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src="/counselling.jpg"
                            alt="Counselling"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Available online
                        </div>
                        <div className="absolute bottom-2 left-2 text-white font-semibold">
                            Counselling
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative w-80 h-60 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src="/personaltraining.jpg"
                            alt="Personal Trainers"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 text-white font-semibold">
                            Personal Trainers
                        </div>
                    </div>
                    {/* Card 5 */}
                    <div className="relative w-80 h-60 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src="/webdesign.jpg"
                            alt=" Web Design"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 text-white font-semibold">
                            Web Design
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
