import React from "react";
import {
  AiFillFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineYoutube,
} from "react-icons/ai";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
      {/* Subscribe Section */}
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-6 py-10 border-b border-teal-500/40">
        <h1 className="lg:text-3xl text-2xl font-semibold mb-6 md:mb-0">
          <span className="text-yellow-300">Subscribe</span> for latest news,  
          <br className="hidden sm:block" /> events & exclusive offers
        </h1>
        <div className="flex flex-col sm:flex-row items-center w-full md:w-auto">
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="text-gray-800 bg-white sm:w-72 w-full sm:mr-3 mb-4 sm:mb-0 py-2.5 rounded-md px-3 outline-none"
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 duration-300 px-6 py-2.5 rounded-md text-gray-900 font-medium w-full sm:w-auto">
            Subscribe
          </button>
        </div>
      </div>

      {/* Links Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-12 sm:px-12">
        {/* Logo + Socials */}
        <div>
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Logo"
            className="mb-4 brightness-0 invert"
          />
          <p className="text-gray-200 text-sm leading-6">
            Your one-stop shop for quality products and great deals.
          </p>
          <div className="flex space-x-4 mt-5">
            <AiFillFacebook size={24} className="cursor-pointer hover:text-yellow-300" />
            <AiOutlineTwitter size={24} className="cursor-pointer hover:text-yellow-300" />
            <AiOutlineInstagram size={24} className="cursor-pointer hover:text-yellow-300" />
            <AiOutlineYoutube size={24} className="cursor-pointer hover:text-yellow-300" />
          </div>
        </div>

        {/* Company */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Company</h2>
          <ul className="space-y-2">
            {footerProductLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-gray-200 hover:text-yellow-300 duration-300 text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Shop</h2>
          <ul className="space-y-2">
            {footercompanyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-gray-200 hover:text-yellow-300 duration-300 text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Support</h2>
          <ul className="space-y-2">
            {footerSupportLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.link}
                  className="text-gray-200 hover:text-yellow-300 duration-300 text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-teal-500/40 text-gray-200 text-sm py-6 px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between">
        <span>© {new Date().getFullYear()} Ali’s Store. All rights reserved.</span>
        <span className="mt-2 md:mt-0">Terms • Privacy Policy</span>
        <div className="mt-4 md:mt-0">
          <img
            src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
            alt="Payments"
            className="w-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;