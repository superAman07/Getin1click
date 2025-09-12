// Calendar SVG component
const Calendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Building2 SVG component
const Building2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <rect x="7" y="3" width="10" height="4" rx="1" />
    <path d="M9 11h2v2H9zm4 0h2v2h-2z" />
  </svg>
);

// BookOpen SVG component
const BookOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M2 6a2 2 0 0 1 2-2h7v16H4a2 2 0 0 1-2-2V6zm18-2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7V4h7z" />
  </svg>
);

// MoreHorizontal SVG component
const MoreHorizontal = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="6" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="18" cy="12" r="2" />
  </svg>
);
// Home SVG component
const Home = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M3 12l9-9 9 9v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8z" />
  </svg>
);
// components/HeroPage.tsx
import Image from "next/image";
// Heart SVG component
const Heart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function HeroPage() {
  return (
    <div className="relative pt-16 sm:pt-24 lg:pt-32">
            <div className="w-full bg-white py-12 px-4">
                <div className="max-w-3xl mx-auto text-start">
                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0c1445] leading-snug">
                        Find the perfect <br className="hidden sm:block" /> professional for you
                    </h2>

                    {/* Subheading */}
                    <h4 className="mt-3 text-base sm:text-lg text-gray-400">
                        Get free quotes within minutes
                    </h4>

                    {/* Search Box */}
                    <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center w-full gap-2">
            <input
              type="text"
              placeholder="What service are you looking for?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-t-md sm:rounded-l-md sm:rounded-tr-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Postcode"
              className="w-full sm:w-32 px-4 py-3 border border-gray-300 border-t-0 sm:border-t sm:border-l-0 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-b-md sm:rounded-r-md sm:rounded-bl-none shadow-md transition">
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
      <div className="relative overflow-x-auto bg-white py-6">
        {/* Wrapper for marquee */}
        <div className="flex animate-marquee space-x-4 sm:space-x-6">
          {/* Card 1 */}
          <div className="relative w-64 sm:w-80 h-40 sm:h-60 rounded-lg overflow-hidden flex-shrink-0">
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
                    <div className="relative w-64 sm:w-80 h-40 sm:h-60 rounded-lg overflow-hidden flex-shrink-0">
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
                    <div className="relative w-64 sm:w-80 h-40 sm:h-60 rounded-lg overflow-hidden flex-shrink-0">
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
                    <div className="relative w-64 sm:w-80 h-40 sm:h-60 rounded-lg overflow-hidden flex-shrink-0">
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
                    <div className="relative w-64 sm:w-80 h-40 sm:h-60 rounded-lg overflow-hidden flex-shrink-0">
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

          <div className="bg-gray-100 py-10 px-2 sm:px-4" style={{ marginTop: "80px" , }}>
  <div className="max-w-7xl mx-auto">
        {/* Media Logos Section */}
  <div className="mb-10 sm:mb-10">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-12 lg:gap-16">
            {/* BBC Logo */}
            <div className="flex items-center justify-center h-10 sm:h-12 md:h-16">
              <div className="flex space-x-1">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-400 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">B</span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-400 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">B</span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-400 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm md:text-base">C</span>
                </div>
              </div>
            </div>

            {/* Daily Mail Logo */}
            <div className="flex items-center justify-center h-10 sm:h-12 md:h-16">
              <div className="text-gray-400 font-serif text-xl md:text-2xl lg:text-3xl">
                Daily <span className="font-bold">Mail</span>
              </div>
            </div>

            {/* The Guardian Logo */}
            <div className="flex items-center justify-center h-10 sm:h-12 md:h-16">
              <div className="text-gray-400 font-serif text-xl md:text-2xl lg:text-3xl lowercase">
                theguardian
              </div>
            </div>

            {/* Bazaar Logo */}
            <div className="flex items-center justify-center h-10 sm:h-12 md:h-16">
              <div className="text-gray-400 font-serif text-xl md:text-2xl lg:text-3xl tracking-wider">
                BAZAAR
              </div>
            </div>

            {/* Cosmopolitan Logo */}
            <div className="flex items-center justify-center h-10 sm:h-12 md:h-16">
              <div className="text-gray-400 font-sans text-xl md:text-2xl lg:text-3xl tracking-widest">
                COSMOPOLITAN
              </div>
            </div>
          </div>
        </div>
        </div>
</div>
          <div className="bg-light-100 py-10 px-2 sm:px-4" style={{ marginTop: "80px" , }}>

        {/* Discover Section */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-10 sm:mb-16">
            Discover
          </h2>

          {/* Service Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8 md:gap-12">
            {/* Home & Garden */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-4 group cursor-pointer">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <Home className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-teal-600" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">Home</div>
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">& Garden</div>
              </div>
            </div>

            {/* Health & Wellbeing */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-4 group cursor-pointer">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-600" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">Health</div>
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">& Wellbeing</div>
              </div>
            </div>

            {/* Weddings & Events */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-4 group cursor-pointer">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-pink-600" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">Weddings</div>
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">& Events</div>
              </div>
            </div>

            {/* Business Services */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-4 group cursor-pointer">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">Business</div>
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">Services</div>
              </div>
            </div>

            {/* Lessons & Training */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-4 group cursor-pointer">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-purple-600" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">Lessons</div>
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">& Training</div>
              </div>
            </div>

            {/* Other Services */}
            <div className="flex flex-col items-center space-y-2 sm:space-y-4 group cursor-pointer">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <MoreHorizontal className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-600" />
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">Other</div>
                <div className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">services</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    



        </div>
    );
}
