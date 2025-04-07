
import React from "react";

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
  // Array of background colors for FAQ icons
  const iconColors = [
    "orange",
    "red", 
    "darkgreen", 
    "goldenrod", 
    "steelblue", 
    "mediumpurple", 
    "darkorange", 
    "orangered", 
    "green", 
    "blue"
  ];
  
  // Array of background colors for FAQ content
  const contentColors = [
    "rgba(255, 165, 0, 0.7)",
    "rgba(255, 99, 71, 0.7)", 
    "rgba(60, 179, 113, 0.7)", 
    "rgba(218, 165, 32, 0.7)", 
    "rgba(70, 130, 180, 0.7)", 
    "rgba(123, 104, 238, 0.7)", 
    "rgba(255, 140, 0, 0.7)", 
    "rgba(255, 69, 0, 0.7)", 
    "rgba(0, 128, 0, 0.7)", 
    "rgba(0, 0, 255, 0.7)"
  ];

  // FAQ data structure with all questions
  const faqs = [
    {
      title: "What age group are your courses designed for?",
      content: "Our courses are tailored for children aged 7-17 years...",
      color: iconColors[0],
      bgColor: contentColors[0]
    },
    {
      title: "When does the course start?",
      content: "After registration, we will contact you via WhatsApp once the group is formed.",
      color: iconColors[1],
      bgColor: contentColors[1]
    },
    {
      title: "How are the course schedules determined?",
      content: "Once the group is formed, we create a WhatsApp group and discuss the most convenient schedule for everyone.",
      color: iconColors[2],
      bgColor: contentColors[2]
    },
    {
      title: "Is there a sibling discount?",
      content: "Yes, there is a 10% discount.",
      color: iconColors[3],
      bgColor: contentColors[3]
    },
    {
      title: "Does the child choose the specialization, or does the academy decide?",
      content: "The child is placed in a suitable specialization based on our expertise. Children also go through multiple specializations to discover their strengths.",
      color: iconColors[4],
      bgColor: contentColors[4]
    },
    {
      title: "Are there any required tools?",
      content: "Tools are only required for robotics courses, including electronics, batteries, motors, and more.",
      color: iconColors[5],
      bgColor: contentColors[5]
    },
    {
      title: "Does the child need a laptop?",
      content: "No, a modern smartphone is sufficient and does not affect learning. We use programs that work on both laptops and phones. However, an advanced level may require a laptop.",
      color: iconColors[6],
      bgColor: contentColors[6]
    },
    {
      title: "What are the payment methods?",
      content: "Payment is made in advance. If you choose the 5-month advanced pricing plan, payment is split into two installments.",
      color: iconColors[7],
      bgColor: contentColors[7]
    },
    {
      title: "What is Scratch programming, and why is it beneficial?",
      content: "Scratch is a block-based programming language that helps children learn logical thinking...",
      color: iconColors[8],
      bgColor: contentColors[8]
    },
    {
      title: "Is Python suitable for children, and what do they learn?",
      content: "Python helps children develop logical thinking and problem-solving skills...",
      color: iconColors[9],
      bgColor: contentColors[9]
    }
  ];

  return (
    <section className="content" id="faq">
      <h2 className="faq_h2 text-4xl font-bold text-center text-purple-900 mb-2">{translations.faqTitle}</h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{translations.faqDesc}</p>
      
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq" data-color={faq.bgColor}>
            <div className="faq-header" onClick={() => toggleFAQ(index)}>
              <div className="faq-icon" style={{ background: faq.color }}>▶</div>
              {language === "en" ? faq.title : (translations[`faq${index + 1}Title` as keyof typeof translations] || faq.title)}
            </div>
            <div className="faq-content">
              {language === "en" ? faq.content : (translations[`faq${index + 1}Answer` as keyof typeof translations] || faq.content)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
