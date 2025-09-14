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
            <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
              Content Executive
            </h1>
            <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
              Marketing · Bengaluru · <br /> Hybrid <span className="ml-1">📶</span>
            </h2>
          </div>

          <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
            <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
              Senior SDET (Remote, Spain)
            </h1>
            <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
              Engineering · Spain · <br /> Fully Remote <span className="ml-1">📶</span>
            </h2>
          </div>

          <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
            <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>

              Senior LLM Backend Engineer (Remote, Spain)
            </h1>
            <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
              Engineering · Spain · <br /> Fully Remote <span className="ml-1">📶</span>
            </h2>
          </div>

          <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
            <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
              Senior Backend Engineer (Remote, Spain)
            </h1>
            <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
              Engineering · Spain · <br /> Fully Remote <span className="ml-1">📶</span>
            </h2>
          </div>

          <div className="bg-gray-50 border rounded-lg p-6 transition hover:shadow-lg hover:border-blue-400 cursor-pointer h-50">
            <h1 className="text-blue-600 font-medium text-lg hover:none mt-5" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
              Head of Product - (Remote, Spain)
            </h1>
            <h2 className="text-gray-600 mt-2" style={{ lineHeight: '1.5', fontSize: '22px', textAlign: 'center' }}>
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
                We're honest and transparent; welcoming and encouraging feedback to help us collaborate across the business as we grow. We value connection and celebrating each other's expertise. We're open about challenging each other as our relationships are built on trust.
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
                We strive for excellence in everything we do, constantly inspiring each other to do our best. We are detail oriented and use data to drive smart decisions so we can be efficient in everything we do. We implement a proactive not reactive approach to our work.
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
                We're excited by the freedom to carve our own paths, constantly evolving to find new ways to make an impact on our customers and beyond. We're curious about the possibilities and that's what helps us solve problems creatively. We're not afraid to fail, learn fast and try again.
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

      {/* hub images */}

      <section className="w-full bg-white py-16 flex flex-col items-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900">Our Hubs</h2>
        <p className="text-gray-600 mt-2 mb-12">We're a global business</p>

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">

          {/* Card 1 - UK */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              UK
              <span className="block h-1 bg-gradient-to-r from-blue-300 to-blue-600 mt-2"></span>
            </h3>
            <div className="relative overflow-hidden rounded-md">
              <img
                src="/uk.webp"
                alt="UK"
                className="w-full h-64 object-cover transform transition duration-500 hover:scale-110"
              />
            </div>
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              You’ll find our Head Office in Paddington in the heart of London.
              There are over 150 people here operating across everything from
              Customer Experience to Engineering spanning multiple territories.
            </p>
          </div>

          {/* Card 2 - Spain */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              SPAIN
              <span className="block h-1 bg-gradient-to-r from-blue-300 to-blue-600 mt-2"></span>
            </h3>
            <div className="relative overflow-hidden rounded-md">
              <img
                src="/spain.webp"
                alt="Spain"
                className="w-full h-64 object-cover transform transition duration-500 hover:scale-110"
              />
            </div>
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              Our newest hub in Spain is home to a small, distributed team working
              remotely across the country. We're focused on building out our
              Engineering and Product functions, with exciting growth planned for
              2025 and beyond.
            </p>
          </div>

          {/* Card 3 - Australia */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              AUSTRALIA
              <span className="block h-1 bg-gradient-to-r from-blue-300 to-blue-600 mt-2"></span>
            </h3>
            <div className="relative overflow-hidden rounded-md">
              <img
                src="/australia.webp"
                alt="Australia"
                className="w-full h-64 object-cover transform transition duration-500 hover:scale-110"
              />
            </div>
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              Heading up the Southern Hemisphere is our Melbourne office. Here
              you’ll find the Sales and Marketing teams in charge of growth in
              Australia and New Zealand.
            </p>
          </div>


          {/* card 4 */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              INDIA
              <span className="block h-1 bg-gradient-to-r from-blue-300 to-blue-600 mt-2"></span>
            </h3>
            <div className="relative overflow-hidden rounded-md">
              <img
                src="/india.webp"
                alt="INDIA"
                className="w-full h-64 object-cover transform transition duration-500 hover:scale-110"
              />
            </div>
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              Our largest international office is based in Bengaluru, home to some of our Customer Experience, Sales, Marketing, and Finance teams. The team provides critical support across time zones and functions, helping us operate efficiently and scale effectively around the world.
            </p>
          </div>

          {/* card 5 */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              GERMANY
              <span className="block h-1 bg-gradient-to-r from-blue-300 to-blue-600 mt-2"></span>
            </h3>
            <div className="relative overflow-hidden rounded-md">
              <img
                src="/german.webp"
                alt="GERMANY"
                className="w-full h-64 object-cover transform transition duration-500 hover:scale-110"
              />
            </div>
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
              You’ll find our Berlin office in the Friedrichshain-Kreuzberg district. While the office may be small, it’s making a big impact in Sales and Customer Experience for our German-speaking markets.          </p>
          </div>

          {/* card 6 */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              FRANCE
              <span className="block h-1 bg-gradient-to-r from-blue-300 to-blue-600 mt-2"></span>
            </h3>
            <div className="relative overflow-hidden rounded-md">
              <img
                src="/france.webp"
                alt="FRANCE"
                className="w-full h-64 object-cover transform transition duration-500 hover:scale-110"
              />
            </div>
            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
            We launched our Paris office in 2023 and look forward to expanding it in the coming years. Based on banks of the River Seine, it’s where you’ll find our French Marketing, Sales and Customer Experience teams.          </p>
          </div>

        </div>
      </section>


      {/* team */}

      <section className="py-16 px-6" style={{ backgroundColor: '#f9f9f9', width: '100%' }}>
      <h2 className="text-3xl font-bold text-center mb-12">Our Teams</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Card 1 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/productimages.webp"
            alt="Product & Design"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">Product & Design</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/engreeing.webp"
            alt="Engineering"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">Engineering</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/data.webp"
            alt="Data & Insights"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">Data & Insights</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/marketing.webp"
            alt="Marketing"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">Marketing</h3>
          </div>
        </div>

        {/* Card 5 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/sales.webp"
            alt="Sales"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">Sales</h3>
          </div>
        </div>

        {/* Card 6 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/customer.webp"
            alt="Customer Operations"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">Customer Operations</h3>
          </div>
        </div>

               {/* Card 7 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/finance.webp"
            alt="Finance & Legal"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">Finance & Legal</h3>
          </div>
        </div>

                 {/* Card 8 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/internatinoal.webp"
            alt="International"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">International</h3>
          </div>
        </div>


                 {/* Card 9 */}
        <div className="relative group overflow-hidden rounded-xl shadow-md cursor-pointer h-70">
          <img
            src="/people.webp"
            alt="People"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition duration-500"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-2xl font-semibold">People</h3>
          </div>
        </div>

      </div>
    </section>

     <div className="min-h-screen bg-gray-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">Our People</h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-5xl mx-auto">
            At Bark, we hire for skills and shared values and that's pretty much it. We know that being brilliant in your role has 
            nothing to do with who you love or what you believe in and that people perform best when they can be their 
            unapologetic selves. We're intent on building a workforce as diverse as our platform and are proud to have a workplace 
            culture that's genuinely inclusive. To us, representation isn't just a tick-box exercise. Diversity is one of our strongest 
            assets and the driving force behind our ability to adapt, innovate and deliver exceptional value to our customers.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-center">
          
          {/* Gender Distribution - Pie Chart */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              {/* Pie Chart Background */}
              <div className="w-full h-full rounded-full bg-gray-800 relative overflow-hidden">
                {/* Blue section (58% - roughly 208 degrees) */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, #3b82f6 0deg 208deg, transparent 208deg 360deg)`
                  }}
                ></div>
                {/* White center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full"></div>
                
                {/* Gender symbols */}
                <div className="absolute top-4 left-6 text-white text-xl font-bold">♂</div>
                <div className="absolute bottom-8 left-4 text-blue-500 text-xl font-bold">♀</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900 mb-1">58% Male, 39% Female,</div>
              <div className="text-xl font-semibold text-gray-900">3% Other</div>
            </div>
          </div>

          {/* Ethnicities - Hands */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
              {/* Two hands reaching toward each other */}
              <div className="relative">
                {/* Left hand (blue) */}
                <div className="absolute -left-8 top-0">
                  <div className="w-16 h-20 bg-blue-500 rounded-t-full rounded-bl-full transform rotate-12 relative">
                    {/* Fingers */}
                    <div className="absolute -top-3 left-2 w-3 h-8 bg-blue-500 rounded-full transform -rotate-12"></div>
                    <div className="absolute -top-4 left-5 w-3 h-10 bg-blue-500 rounded-full transform -rotate-6"></div>
                    <div className="absolute -top-4 left-8 w-3 h-9 bg-blue-500 rounded-full transform rotate-6"></div>
                    <div className="absolute -top-2 left-11 w-3 h-6 bg-blue-500 rounded-full transform rotate-12"></div>
                  </div>
                </div>
                
                {/* Right hand (dark) */}
                <div className="absolute -right-8 top-0">
                  <div className="w-16 h-20 bg-gray-800 rounded-t-full rounded-br-full transform -rotate-12 relative">
                    {/* Fingers */}
                    <div className="absolute -top-3 right-2 w-3 h-8 bg-gray-800 rounded-full transform rotate-12"></div>
                    <div className="absolute -top-4 right-5 w-3 h-10 bg-gray-800 rounded-full transform rotate-6"></div>
                    <div className="absolute -top-4 right-8 w-3 h-9 bg-gray-800 rounded-full transform -rotate-6"></div>
                    <div className="absolute -top-2 right-11 w-3 h-6 bg-gray-800 rounded-full transform -rotate-12"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">13 Ethnicities</div>
            </div>
          </div>

          {/* Employees - People Icons */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 mb-6 flex items-center justify-center">
              <div className="flex space-x-4">
                {/* Person 1 - Light */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mb-2"></div>
                  <div className="w-16 h-20 bg-gray-300 rounded-t-full"></div>
                </div>
                
                {/* Person 2 - Blue */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mb-2"></div>
                  <div className="w-16 h-20 bg-blue-500 rounded-t-full"></div>
                </div>
                
                {/* Person 3 - Blue */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mb-2"></div>
                  <div className="w-16 h-20 bg-blue-500 rounded-t-full"></div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">240 Employees in 6</div>
              <div className="text-xl font-semibold text-gray-900">countries</div>
            </div>
          </div>

          {/* Nationalities - Globe */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 mb-6 flex items-center justify-center">
              <div className="w-32 h-40 bg-gray-800 rounded-2xl relative overflow-hidden">
                {/* Globe inside */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full relative">
                  {/* Continents */}
                  <div className="absolute top-2 left-3 w-6 h-4 bg-blue-500 rounded-full transform rotate-12"></div>
                  <div className="absolute top-6 right-2 w-8 h-6 bg-blue-500 rounded-full transform -rotate-6"></div>
                  <div className="absolute bottom-4 left-2 w-5 h-3 bg-blue-500 rounded-full"></div>
                  <div className="absolute bottom-2 right-4 w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div className="absolute top-8 left-8 w-3 h-5 bg-blue-500 rounded-full transform rotate-45"></div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">36 Nationalities</div>
            </div>
          </div>

        </div>
      </div>
    </div>


    </div>
  );
}