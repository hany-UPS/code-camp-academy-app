
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQSectionProps {
  toggleFAQ: (index: number) => void;
  language: "en" | "ar";
  translations: {
    faqTitle: string;
    faqDesc: string;
    faq1Title: string;
    faq1Answer: string;
    faq2Title: string;
    faq2Answer: string;
    faq3Title: string;
    faq3Answer: string;
    faq4Title: string;
    faq4Answer: string;
    faq5Title: string;
    faq5Answer: string;
  };
}

const FAQSection: React.FC<FAQSectionProps> = ({ toggleFAQ, language, translations }) => {
  return (
    <section className="content" id="faq">
      <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">{translations.faqTitle}</h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{translations.faqDesc}</p>
      
      <div className="faq-container">
        <div className="faq">
          <div className="faq-header" onClick={() => toggleFAQ(0)}>
            <div className="faq-icon">▶</div>
            <h3>{translations.faq1Title}</h3>
          </div>
          <div className="faq-content">{translations.faq1Answer}</div>
        </div>
        
        <div className="faq">
          <div className="faq-header" onClick={() => toggleFAQ(1)}>
            <div className="faq-icon">▶</div>
            <h3>{translations.faq2Title}</h3>
          </div>
          <div className="faq-content">{translations.faq2Answer}</div>
        </div>
        
        <div className="faq">
          <div className="faq-header" onClick={() => toggleFAQ(2)}>
            <div className="faq-icon">▶</div>
            <h3>{translations.faq3Title}</h3>
          </div>
          <div className="faq-content">{translations.faq3Answer}</div>
        </div>
        
        <div className="faq">
          <div className="faq-header" onClick={() => toggleFAQ(3)}>
            <div className="faq-icon">▶</div>
            <h3>{translations.faq4Title}</h3>
          </div>
          <div className="faq-content">{translations.faq4Answer}</div>
        </div>
        
        <div className="faq">
          <div className="faq-header" onClick={() => toggleFAQ(4)}>
            <div className="faq-icon">▶</div>
            <h3>{translations.faq5Title}</h3>
          </div>
          <div className="faq-content">{translations.faq5Answer}</div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
