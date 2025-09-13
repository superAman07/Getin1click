export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">The people behind the platform </h1>
      <p className="max-w-2xl text-center mb-4">
Bark is the world’s fastest growing marketplace and we have no intention of slowing down any time soon. Our sights are set firmly on global expansion and connecting people to services all over the world. We’re a work-hard, praise-hard culture that pushes ourselves to be 1% better everyday and our global team of energetic, passionate and dedicated individuals make work something to look forward to.      </p>
    

      <img src="/gardening.jpg" alt="About Us" />


      {/* job services */}

          <section className="w-full bg-white py-16 flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Jobs</h2>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full px-4">
        {/* Job Card */}
        <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
          <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Content Executive
          </h1>
          <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Marketing · Bengaluru · <br/> Hybrid <span className="ml-1">📶</span>
          </h2>
        </div>

        <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
          <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Senior SDET (Remote, Spain)
          </h1>
          <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Engineering · Spain · <br /> Fully Remote <span className="ml-1">📶</span>
          </h2>
        </div>

        <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
                  <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>

            Senior LLM Backend Engineer (Remote, Spain)
          </h1>
                <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Engineering · Spain · <br /> Fully Remote <span className="ml-1">📶</span>
          </h2>
        </div>

        <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
           <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Senior Backend Engineer (Remote, Spain)
          </h1>
                   <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Engineering · Spain · <br/> Fully Remote <span className="ml-1">📶</span>
          </h2>
        </div>

        <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
           <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Head of Product - (Remote, Spain)
          </h1>
         <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px',textAlign: 'center' }}>
            Product & Design · Spain · Fully Remote <span className="ml-1">📶</span>
          </h2>
        </div>
      </div>

      {/* All Jobs Button */}
      <div className="mt-12">
        <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium transition hover:bg-gray-800">
          All jobs →
        </button>
      </div>
    </section>

{/* images */}

  <section className="w-full bg-white py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Image 1 */}
        <div className="relative group">
          <img
            src="/original.webp"
            alt="original"
            className="w-full h-72 object-cover rounded-md"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-lg font-medium">
            
          </div>
        </div>

        {/* Image 2 */}
        <div className="relative group">
          <img
            src="/original (1).webp"
            alt="original"
            className="w-full h-72 object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-lg font-medium">
           
          </div>
        </div>

        {/* Image 3 */}
        <div className="relative group">
          <img
            src="/original (2).webp"
            alt="original"
            className="w-full h-72 object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-lg font-medium">
        
          </div>
        </div>

        {/* Image 4 */}
        <div className="relative group">
          <img
            src="/original (3).webp"
            alt="original"
            className="w-full h-72 object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-lg font-medium">
           
          </div>
        </div>
      </div>
    </section>

    {/* card1 */}
    
    <section className="w-full bg-white py-16 flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
      <p className="text-gray-600 mt-2 mb-12">A Platform for People</p>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full px-4">
        
        {/* Card 1 */}
        <div className="relative group bg-[#0B1134] text-white  rounded-md overflow-hidden cursor-pointer">
          
          {/* Default State */}
          <div className="transition-opacity duration-500 group-hover:opacity-0">
         
            <img src="/original (4).webp" alt="Team" className="mx-auto lg:mx-0 w-100" />
          </div>
          {/* Hover Content */}
          <div className="absolute inset-0 p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-lg leading-relaxed">
              We're honest and transparent; welcoming and encouraging feedback
              to help us collaborate as we grow. Relationships are built on trust.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative group bg-white border text-gray-900  rounded-md overflow-hidden cursor-pointer">
          {/* Default State */}
            <div className="transition-opacity duration-500 group-hover:opacity-0">
         
            <img src="/original (5).webp" alt="Team" className="mx-auto lg:mx-0 w-100" />
          </div>
          {/* Hover Content */}
          <div className="absolute inset-0 p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-lg leading-relaxed text-gray-700">
              We set the bar high and always strive to go above it.
              Excellence is our minimum standard.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative group bg-[#2B72EC] text-white rounded-md overflow-hidden cursor-pointer">
          {/* Default State */}
            <div className="transition-opacity duration-500 group-hover:opacity-0">
         
            <img src="/original (6).webp" alt="Team" className="mx-auto lg:mx-0 w-100" />
          </div>
          {/* Hover Content */}
          <div className="absolute inset-0 p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-lg leading-relaxed">
              There's power in exploration. We embrace curiosity to find
              solutions others might overlook.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="relative group bg-white border text-gray-900 rounded-md overflow-hidden cursor-pointer">
          {/* Default State */}
              <div className="transition-opacity duration-500 group-hover:opacity-0">
         
            <img src="/original (7).webp" alt="Team" className="mx-auto lg:mx-0 w-100" />
          </div>
          {/* Hover Content */}
          <div className="absolute inset-0 p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-lg leading-relaxed text-gray-700" >
          We are always looking for ways to provide better value to our professionals. The most exciting opportunities are discovered when we're thinking about the bigger picture. We're not afraid to make bold moves. We don't do things just to tick boxes. Our focus is on the outcome, rather than the output.
            </p>
          </div>
        </div>

      </div>
    </section>

    </div>
  );
}