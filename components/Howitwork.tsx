export default function Howitwork() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-gray-800">
      <main className="mt-20">
        <section className="w-full bg-gradient-to-b from-white via-[#eef1fb] to-white py-16 flex flex-col items-center text-center">
          <h3 className=" font-bold " style={{ fontSize: "30px", marginTop: "-60px" }}>How It Work</h3>
          <h1 className=" font-bold " style={{ fontSize: "50px", }}>GetIn1Click for Pros</h1>
          <p className="text-lg max-w-2xl" style={{ fontSize: "18px" }}>
        GetIn1Click is the Amazon of services. Millions of people use us  <br /> worldwide to find what they need every day.</p>

          {/* Button */}
          <button className="bg-purple-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-purple-700 transition mt-10">
        Join as a Professional
          </button>


        </section>

        <section className="w-full bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Left Side Image */}
          <div className="relative w-full md:w-1/2 flex justify-center mt-20">
            <img
              src="/hiw-pro-1.png"
              alt="hiw-pro"
              className="rounded-2xl shadow-lg object-cover w-full md:w-[450px] h-[490px]"
            />


          </div>

          {/* Right Side Text */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Customers come to us <br /> with their needs
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6" style={{ fontSize: "18px" }}>
              We support every imaginable service, for both individuals <br /> and small
              businesses. We collect detailed information
              about <br />exactly what the
              customer is looking for.
            </p>
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: "18px" }}>
              Smart customers <span className="font-semibold">GetIn1Click it</span>, not{" "}
              <span className="font-semibold">Google it</span>. They know that <br /> we’ll
              provide relevant, professional companies that can <br /> meet their needs.
            </p>
          </div>
        </section>

        <section className="w-full bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Left Side Image */}


          {/* Right Side Text */}
          <div className="w-full md:w-1/2 justify-center mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Customers find you  <br /> on GetIn1Clicks
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6" style={{ fontSize: "18px" }}>
              Customers then find you on GetIn1Click and can reach out to you.  We’ll also <br /> send you all leads matching what you do.
            </p>
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: "18px" }}>
              We charge a small fee for each introduction and we give you the phone <br />  number and e-mail address of each potential customer so you <br /> can reach out.
            </p>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center">
            <img
              src="/hiw-pro-2-GB.png"
              alt="hiw-pro"
              className="rounded-2xl shadow-lg object-cover w-full md:w-[450px] h-[490px]"
            />


          </div>
        </section>

        <section className="w-full bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Left Side Image */}
          <div className="relative w-full md:w-1/2 flex justify-center">
            <img
              src="/hiw-pro-3.png"
              alt="hiw-pro"
              className="rounded-2xl shadow-lg object-cover w-full md:w-[450px] h-[490px]"
            />


          </div>

          {/* Right Side Text */}
          <div className="w-full md:w-1/2 text-center md:text-left mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Grow your business. <br /> Fast.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6" style={{ fontSize: "18px" }}>
              We take the hassle out of marketing your services. <br /> GetIn1Click professionals receive hot, live leads as  soon <br /> as they are placed.  Join as a professional now and get <br /> instant access to leads for your business.
            </p>

          </div>
        </section>

        <section className="w-full bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Left Side Image */}


          {/* Right Side Text */}
          <div className="w-full md:w-1/2 justify-center mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Plus tons of other  <br /> benefits
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6" style={{ fontSize: "18px" }}>
              As a GetIn1Click Pro, you’ll get an online profile which boosts your web presence and helps promote your business.         </p>
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: "18px" }}>
              You’ll also get access to our award winning customer success team, by both e-mail and telephone who will help you every step of the way.        </p>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center">
            <img
              src="/hiw-pro-4.png"
              alt="hiw-pro"
              className="rounded-2xl shadow-lg object-cover w-full md:w-[450px] h-[490px]"
            />


          </div>
        </section>


        <section className="w-full bg-gray-50 py-20 flex flex-col items-center px-6">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Register now
          </h2>

          {/* Input + Button */}
          <div className="flex w-full max-w-xl">
            <input
              type="text"
              placeholder="What service do you provide?"
              className="flex-1 px-4 py-3 rounded-l-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
            />
            <button className="bg-purple-600 text-white px-6 py-3 rounded-r-md shadow hover:bg-purple-700 transition">
              Get started
            </button>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md shadow-sm mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <p className="text-gray-900 font-medium">
                Create your <br /> account in minutes
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md shadow-sm mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-900 font-medium">
                Start receiving <br /> leads today
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-md shadow-sm mb-4">
                <span className="text-2xl">✔️</span>
              </div>
              <p className="text-gray-900 font-medium">
                No commission or <br /> hidden fees
              </p>
            </div>
          </div>
        </section>
        <br />
      </main>
    </div>

  );
}