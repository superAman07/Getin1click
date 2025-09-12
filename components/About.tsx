export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="max-w-2xl text-center mb-4">
        Welcome to our platform! We are dedicated to connecting customers with top-notch professionals across various fields. Our mission is to make it easy for you to find the right expert for your needs, whether it's for home improvement, personal services, or business solutions.
      </p>
      <p className="max-w-2xl text-center mb-4">
        Our team is passionate about providing a seamless experience for both customers and professionals. We carefully vet each professional to ensure they meet our high standards of quality and reliability. With our user-friendly interface, you can easily browse profiles, read reviews, and book services with just a few clicks.
      </p>
      <p className="max-w-2xl text-center">
        Thank you for choosing our platform. We look forward to helping you find the perfect professional for your next project!
      </p>

      <img src="/gardening.jpg" alt="About Us" />
    </div>
  );
}