import { motion } from "framer-motion";



export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      {/* Illustration */}
      <div className="mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="300"
          viewBox="0 0 512 512"
          fill="none"
          className="mx-auto"
        >
          {/* Example illustration similar to your image */}
          <rect x="100" y="120" width="300" height="200" rx="20" fill="#5B9985" />
          <rect x="140" y="170" width="220" height="15" rx="7" fill="#fff" />
          <rect x="140" y="210" width="220" height="15" rx="7" fill="#fff" />
          <rect x="140" y="250" width="220" height="15" rx="7" fill="#fff" />
          <path
            d="M90 320C110 310 130 300 140 290"
            stroke="#F7B6A1"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      </div>



      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
        Our new blog is coming <br className="hidden sm:block" /> soon
      </h1>

      {/* Subtext */}
      <p className="text-gray-600 text-lg max-w-xl">
        We’ll be serving up lots of tips, tricks, and hacks for making your life easier.
      </p>
    </div>
  );
}
