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
            
            </div>
    );
}