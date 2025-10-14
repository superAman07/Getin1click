import { FaSearch, FaStar, FaUsers, FaTools } from "react-icons/fa";
import { FaEnvelope, FaPhone } from "react-icons/fa";

export default function Helpcenter(){
    return (
       <div className="bg-gray-50 mt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-200 via-blue-300 to-blue-100 py-16" style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' , padding: '0 20px', boxSizing: 'border-box',backgroundImage: 'url(helpcenter.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="container mx-auto flex flex-col items-center justify-center">
         

          {/* Search bar */}
          <div className="w-full max-w-2xl bg-white rounded-md shadow-md flex items-center px-4 py-3">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Tell us how we can help..."
              className="w-full outline-none text-gray-600"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16" style={{backgroundColor:"#f0f8ff", padding: '44px 80px', boxSizing: 'border-box', minHeight: '60vh' , display: 'flex', flexDirection: 'column', justifyContent: 'center' , alignItems: 'center', textAlign: 'center'}}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <FaStar className="text-blue-500 text-4xl mb-4 mx-auto" style={{width:"200px",height:"80px"}} />
              <h3 className="text-lg font-semibold mb-2" style={{fontSize:"20px"}}> New to GetInOncClick </h3>
              <p className="text-gray-600 text-lg">
             
Discover everything you need to <br /> know to start your journey
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <FaUsers className="text-green-500 text-4xl mb-4 mx-auto" style={{width:"200px",height:"80px"}}/>
             <h3 className="text-lg font-semibold mb-2" style={{fontSize:"20px"}}> Professionals</h3>
              <p className="text-gray-600 text-lg">
                How GetInOncClick  works for professionals
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <FaTools className="text-orange-500 text-4xl mb-4 mx-auto" style={{width:"200px",height:"80px"}} />
           <h3 className="text-lg font-semibold mb-2" style={{fontSize:"20px"}}>Customers</h3>
              <p className="text-gray-600 text-lg">
Using GetInOncClick  and getting quotes
              </p>
            </div>
          </div>
        </div>
      </section>


 <div className="bg-gray-50">
      {/* Popular Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Popular</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-blue-600">
            {/* Column 1 */}
            <div className="space-y-4">
              <a href="#" className="block hover:underline">
                What is GetInOncClick  and how does it work?
              </a>
              <a href="#" className="block hover:underline">
                Where do I find my invoices?
              </a>
              <a href="#" className="block hover:underline">
                What is the Get Hired Guarantee?
              </a>
              <a href="#" className="block hover:underline">
                What is Enquiries?
              </a>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <a href="#" className="block hover:underline">
                How does GetInOncClick  screen leads I receive?
              </a>
              <a href="#" className="block hover:underline">
                What are Credit Pack Subscriptions?
              </a>
              <a href="#" className="block hover:underline">
                What is GetInOncClick  Verified?
              </a>
              <a href="#" className="block hover:underline">
                How many responses can a customer receive?
              </a>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <a href="#" className="block hover:underline">
                What is a credit and how much does it cost?
              </a>
              <a href="#" className="block hover:underline">
                How do I refer a friend?
              </a>
              <a href="#" className="block hover:underline">
                What is Elite Pro?
              </a>
              <a href="#" className="block hover:underline">
                How can I submit a general press enquiry?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Get in touch Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Get in touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Contact us */}
            <div className="border rounded-lg p-6 flex flex-col items-center hover:shadow-md transition" >
              <FaEnvelope className="text-blue-600 text-3xl mb-3" />
              <h3 className="text-lg font-semibold text-blue-700">Contact us</h3>
              <p className="text-gray-600 text-sm">Submit a request</p>
            </div>

            {/* Call us */}
            <div className="border rounded-lg p-6 flex flex-col items-center hover:shadow-md transition">
              <FaPhone className="text-blue-600 text-3xl mb-3" />
              <h3 className="text-lg font-semibold text-blue-700">Call us</h3>
              <p className="text-gray-600 text-sm">(+44) 02 03 697 0237</p>
            </div>
          </div>
        </div>
      </section>
    </div>

<section className="bg-cyan-100 py-12">
  <div className="container mx-auto text-center">
    <h2 className="text-2xl font-bold mb-6">
      Can't find what you're looking for?
    </h2>
    <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition">
      Submit a request
    </button>
  </div>
</section>


    </div>
    )
}