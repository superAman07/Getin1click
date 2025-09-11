// app/components/Footer.tsx (Next.js 13+ with App Router)
// or place inside /components/Footer.jsx if using pages router

export default function HeroPage() {
  return (
    <header className="w-full bg-white py-12 px-6 border-t">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Find the perfect professional for you
        </h2>

        {/* Subheading */}
        <p className="mt-3 text-lg text-gray-500">
          Get free quotes within minutes
        </p>

        {/* Search Box */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            type="text"
            placeholder="What service are you looking for?"
            className="w-full sm:w-80 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Postcode"
            className="w-full sm:w-40 px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md shadow-md transition">
            Search
          </button>
        </div>

        {/* Popular Links */}
        <p className="mt-6 text-sm text-gray-500">
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
    </header>
  );
}
