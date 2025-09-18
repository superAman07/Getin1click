import Image from "next/image";

export default function Joinasprofessional() {
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <main className="min-h-screen flex flex-col md:flex-row bg-white" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "12px", overflow: "hidden",  width: "100%" }}>
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Secure jobs and grow your business
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          1000’s of local and remote clients are already waiting for your services
        </p>

        {/* Search box */}
        <div className="flex mt-6 max-w-xl">
          <input
            type="text"
            placeholder="What service do you provide?"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 transition">
            Get started
          </button>
        </div>

        {/* Popular services */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-gray-700">
          <p className="flex items-center gap-2">🏠 House Cleaning</p>
          <p className="flex items-center gap-2">🧑‍🏫 Life Coaching</p>
          <p className="flex items-center gap-2">💻 Web Design</p>
          <p className="flex items-center gap-2">📷 General Photography</p>
          <p className="flex items-center gap-2">{`</>`} Web Development</p>
          <p className="flex items-center gap-2">📢 Social Media Marketing</p>
          <p className="flex items-center gap-2">✏️ Graphic Design</p>
          <p className="flex items-center gap-2">📑 Bookkeeping Services</p>
          <p className="flex items-center gap-2">🔨 General Builders</p>
          <p className="flex items-center gap-2">💪 Personal Trainers</p>
          <p className="flex items-center gap-2">🌱 Gardening</p>
          <p className="flex items-center gap-2">🏢 Commercial & Office Cleaning</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-50">
        <div className="relative w-full h-[500px] md:h-full">
          <Image
  src="/rated-excellent-image.jpg" // replace with your uploaded image
  alt="Happy client"
  fill
  className="object-cover rounded-tl-2xl md:rounded-none"
/>

          {/* Overlay content */}
          <div className="absolute top-6 left-6 text-white text-2xl font-semibold">
            Bark is rated <span className="font-bold">Great</span>
          </div>

          {/* Trustpilot Rating */}
          <div className="absolute bottom-6 left-6 bg-black/60 p-3 rounded-lg flex flex-col">
            <span className="text-green-400 font-semibold">Trustpilot</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-green-500 text-2xl">★ ★ ★ ★ ☆</span>
            </div>
            <span className="text-sm text-gray-200 mt-1">
              TrustScore 4.1 | 104,146 reviews
            </span>
          </div>
        </div>
      </div>
    </main>


    <section className="py-16 bg-white mt-12 w-full" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "12px" }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center md:items-start">
          {/* Icon Box */}
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-6">
            <span className="text-2xl">⏱️</span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Get quality leads
          </h3>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li>View leads locally or nationwide</li>
            <li>Review leads for free</li>
            <li>Get leads sent to you in real time</li>
          </ul>

          <a
            href="#"
            className="text-white-600 font-medium hover:underline border border-gray-200 rounded-md px-4 py-2" style={{ textDecoration: 'none', display: 'inline-block' ,backgroundColor: '#271bc7ff',color: 'white'}}
          >
            How it works
          </a>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-6">
            <span className="text-2xl">💬</span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Win new clients
          </h3>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li>Pick the best leads for your business</li>
            <li>Unlock verified contact details</li>
            <li>Call or email them to win the job</li>
          </ul>

          <a
            href="#"
            className="text-white-600 font-medium hover:underline border border-gray-200 rounded-md px-4 py-2" style={{ textDecoration: 'none', display: 'inline-block' ,backgroundColor: '#271bc7ff',color: 'white'}}
          >
            See an example lead
          </a>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-6">
            <span className="text-2xl">✔️</span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Grow your business
          </h3>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li>Keep 100% of what you earn</li>
            <li>No commission or hidden fees</li>
            <li>Get Hired Guarantee on first leads</li>
          </ul>

          <a
            href="#"
            className="text-white-600 font-medium hover:underline border border-gray-200 rounded-md px-4 py-2" style={{ textDecoration: 'none', display: 'inline-block' ,backgroundColor: '#271bc7ff',color: 'white'}}
          >
            See more about pricing
          </a>
        </div>

      </div>
    </section>
            </div>
    );
   
}