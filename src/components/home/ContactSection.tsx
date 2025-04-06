
import React from "react";

interface ContactSectionProps {
  language: "en" | "ar";
  translations: {
    contactTitle: string;
    contactDesc: string;
    address: string;
    phone: string;
    email: string;
    followUs: string;
  };
}

const ContactSection: React.FC<ContactSectionProps> = ({ language, translations }) => {
  return (
    <section className="content" id="contact">
      <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">{translations.contactTitle}</h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{translations.contactDesc}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">{translations.address}</h3>
          <p>123 Coding Street, Tech City, El Minia, Egypt</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">{translations.phone}</h3>
          <p>+20 123 456 789</p>
          <p>+20 120 426 2410</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">{translations.email}</h3>
          <p>info@academy.com</p>
          <p>support@academy.com</p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold mb-3">{translations.followUs}</h3>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-blue-600 hover:text-blue-800">
            <i className="fab fa-facebook-f fa-2x"></i>
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-600">
            <i className="fab fa-twitter fa-2x"></i>
          </a>
          <a href="#" className="text-pink-600 hover:text-pink-800">
            <i className="fab fa-instagram fa-2x"></i>
          </a>
          <a href="#" className="text-red-600 hover:text-red-800">
            <i className="fab fa-youtube fa-2x"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
