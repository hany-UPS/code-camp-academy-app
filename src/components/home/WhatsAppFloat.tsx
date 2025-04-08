
import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppFloat: React.FC = () => {
  return (
    <a 
      href="http://wa.me/+201204262410" 
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      target="_blank" 
      rel="noopener noreferrer"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle color="white" size={28} strokeWidth={2.5} />
    </a>
  );
};

export default WhatsAppFloat;
