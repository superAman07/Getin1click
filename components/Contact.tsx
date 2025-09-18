
import { FaSearch, FaStar, FaUsers, FaTools } from "react-icons/fa";
import { FaEnvelope, FaPhone } from "react-icons/fa";
export default function Contact() {
    return(
          <div className="bg-gray-50">
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

        <section className="bg-blue-100 py-12">
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
    );
}