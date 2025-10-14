export default function Pricing(){
    return(

        <div className="min-h-screen flex flex-col items-center justify-center  text-gray-800">
               <section className="w-full bg-gradient-to-b from-white via-[#eef1fb] to-white py-16 flex flex-col items-center">
     <h1 className=" font-bold " style={{fontSize : "50px", marginTop:"-50px"}}>Pricing</h1>
          <p className="text-lg max-w-2xl text-center" style={{fontSize: "18px"}}>
From the moment you sign up, we'll send you leads for free. You only pay to contact customers that you think are the right fit for your business.</p>

      {/* Button */}
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition mt-10">
        Join as a Professional
      </button>

   
    </section>


             


    <section className="w-full bg-gray-100 py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">
      {/* Left Side Image */}
      <div className="relative w-full md:w-1/2 flex justify-center mt-20">
        <img
          src="/pricing-1.png"
          alt="hiw-pro"
          className=" w-full md:w-[500px] h-[500px]" style={{marginTop:"-20px"}}
        />

    
      </div>

      {/* Right Side Text */}
      <div className="w-full md:w-1/2 text-center md:text-left mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
         
Credits at the ready
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6" style={{fontSize: "18px"}}>
          We support every imaginable service, for both individuals <br /> and small
          businesses. We collect detailed information 
           about <br />exactly what the
          customer is looking for.
        </p>
        <p className="text-gray-600 leading-relaxed" style={{fontSize: "18px"}}>
          Smart customers <span className="font-semibold">GetInOncClick  it</span>, not{" "}
          <span className="font-semibold">Google it</span>. They know that <br /> we’ll
          provide relevant, professional companies that can <br /> meet their needs.
        </p>
      </div>
    </section>


       <section className="w-full bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">


      {/* Right Side Text */}
      <div className="w-full md:w-1/2 text-center md:text-Right mt-40">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
         You're in control
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6" style={{fontSize: "18px"}}>
        You decide which leads you respond to and you’ll <br /> know the cost in credits upfront. <br /> That way you always know how much you're spending.
        </p>
       
      </div>

            {/* Left Side Image */}
      <div className="relative w-full md:w-1/2 flex justify-center mt-20">
        <img
          src="/pricing-leads-GB.png"
          alt="hiw-pro"
          className="  w-full md:w-[500px] h-[500px]"
        />

    
      </div>
    </section>


       <section className="w-full bg-whitesmoke py-16 px-6 md:px-16 flex flex-col md:flex-row items-center md:items-start gap-12">
      {/* Left Side Image */}
      <div className="relative w-full md:w-1/2 flex justify-center mt-20">
        <img
          src="/ghg-pricing.png"
          alt="hiw-pro"
          className=" w-full md:w-[450px] h-[450px]"
        />

    
      </div>

      {/* Right Side Text */}
      <div className="w-full md:w-1/2 text-center md:text-left mt-50">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
         New business <br />
guaranteed
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6" style={{fontSize: "18px"}}>
          We’re so confident you’ll win business with your first <br /> credit pack, we’ll return all your credits if you <br /> don’t.
No questions asked.
        </p>
       
      </div>
    </section>


            
            </div>
    );
}