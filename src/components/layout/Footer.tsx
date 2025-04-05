
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start">
            <span className="text-orange-400 font-bold text-xl">UPS</span>
            <span className="text-blue-400 font-bold text-xl">Junior</span>
          </div>
          <p className="text-gray-300 mt-2 text-center md:text-left">
            Helping kids learn programming the fun way
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
          <div>
            <h3 className="font-semibold mb-2 text-center md:text-left">Quick Links</h3>
            <ul className="space-y-1 text-center md:text-left">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <a href="https://www.facebook.com/UPSJuniors/" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 text-center md:text-left">Contact</h3>
            <ul className="space-y-1 text-center md:text-left">
              <li className="text-gray-300">
                Email: info@upsjunior.com
              </li>
              <li className="text-gray-300">
                <a href="http://wa.me/+201204262410" className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                  WhatsApp: +201204262410
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0">
          <p className="text-gray-400 text-sm text-center md:text-right">
            &copy; {new Date().getFullYear()} UPS Junior Programming Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
