
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-academy-orange font-bold text-xl">UPS</span>
              <span className="text-academy-blue font-bold text-xl">Junior</span>
            </div>
            <p className="text-gray-600 mt-2 text-center md:text-left">
              Helping kids learn programming the fun way
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
            <div>
              <h3 className="font-semibold mb-2 text-center md:text-left">Quick Links</h3>
              <ul className="space-y-1 text-center md:text-left">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-academy-orange transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-600 hover:text-academy-orange transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-center md:text-left">Contact</h3>
              <ul className="space-y-1 text-center md:text-left">
                <li className="text-gray-600">
                  Email: info@upsjunior.com
                </li>
                <li className="text-gray-600">
                  Phone: (123) 456-7890
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} UPS Junior Programming Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
