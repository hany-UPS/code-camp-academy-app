
import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppFloat: React.FC = () => {
  return (
    <a 
      href="http://wa.me/+201204262410" 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <MessageCircle color="white" size={28} />
    </a>
  );
};

export default WhatsAppFloat;
