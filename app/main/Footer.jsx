// src/components/Footer.jsx
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-700 pb-10">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Kartenity</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kartenity — your destination for premium products at unbeatable prices.
              Shop smart, shop stylish.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/pages/products" className="hover:text-white transition">Shop</Link>
              </li>
              <li>
                <Link href="/pages/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link href="/pages/contact" className="hover:text-white transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
        <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
                <li>
                <Link href="/infoPage/faq" className="hover:text-white transition">FAQs</Link>
                </li>
                <li>
                <Link href="/infoPage/shipping" className="hover:text-white transition">Shipping & Returns</Link>
                </li>
                <li>
                <Link href="/infoPage/privacy" className="hover:text-white transition">Privacy Policy</Link>
                </li>
                <li>
                <Link href="/infoPage/terms" className="hover:text-white transition">Terms & Conditions</Link>
                </li>
            </ul>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Kartenity. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition">
              <FaFacebookF />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-gray-800 hover:bg-pink-500 transition">
              <FaInstagram />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-gray-800 hover:bg-blue-400 transition">
              <FaTwitter />
            </Link>
            <Link href="#" className="p-2 rounded-full bg-gray-800 hover:bg-blue-700 transition">
              <FaLinkedinIn />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
