
import React from "react";

interface PricingSectionProps {
  selectedPlan: string;
  togglePlans: (planType: string) => void;
  scrollToBookingForm: (planName: string) => void;
  language: "en" | "ar";
  translations: {
    pricingPlans: string;
    pricingDesc: string;
    general: string;
    private: string;
    basic: string;
    advanced: string;
    special: string;
    perMonth: string;
    off: string;
    oldPrice: string;
    pricePerMonth: string;
    noDiscount: string;
    monthsPlan: string;
    discountApplied: string;
    bookNow: string;
  };
}

const PricingSection: React.FC<PricingSectionProps> = ({
  selectedPlan,
  togglePlans,
  scrollToBookingForm,
  language,
  translations
}) => {
  return (
    <section className="content" id="price">
      <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">{translations.pricingPlans}</h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{translations.pricingDesc}</p>
      
      <div className="toggle-buttons">
        <button 
          className={`general-btn ${selectedPlan === 'general' ? 'active' : ''}`}
          onClick={() => togglePlans('general')}
        >
          {translations.general}
        </button>
        <button 
          className={`private-btn ${selectedPlan === 'private' ? 'active' : ''}`}
          onClick={() => togglePlans('private')}
        >
          {translations.private}
        </button>
      </div>
      
      <div className={`active-cards general ${selectedPlan === 'general' ? '' : 'hidden'}`}>
        <div className="card">
          <div className="card-title basic">{translations.basic}</div>
          <div className="price">300 EGP{translations.perMonth}</div>
          <div className="discount">10% {translations.off}</div>
          <div className="line-through">{translations.oldPrice}: 333 EGP</div>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: 300 EGP</li>
            <li><span className="check">✓</span> 1 {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: 10%</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Basic General')}>{translations.bookNow}</button>
        </div>
        
        <div className="card shadow-card">
          <div className="card-title advanced">{translations.advanced}</div>
          <div className="price">250 EGP{translations.perMonth}</div>
          <div className="discount">25% {translations.off}</div>
          <div className="line-through">{translations.oldPrice}: 333 EGP</div>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: 250 EGP</li>
            <li><span className="check">✓</span> 3 {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: 25%</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Advanced General')}>{translations.bookNow}</button>
        </div>
        
        <div className="card">
          <div className="card-title special">{translations.special}</div>
          <div className="price">220 EGP{translations.perMonth}</div>
          <div className="discount">33% {translations.off}</div>
          <div className="line-through">{translations.oldPrice}: 333 EGP</div>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: 220 EGP</li>
            <li><span className="check">✓</span> 6 {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: 33%</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Special General')}>{translations.bookNow}</button>
        </div>
      </div>
      
      <div className={`active-cards private ${selectedPlan === 'private' ? '' : 'hidden'}`}>
        <div className="card">
          <div className="card-title basic">{translations.basic}</div>
          <div className="price">1800 EGP{translations.perMonth}</div>
          <div className="discount">{translations.noDiscount}</div>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: 1800 EGP</li>
            <li><span className="check">✓</span> 1 {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: 0%</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Basic Private')}>{translations.bookNow}</button>
        </div>
        
        <div className="card shadow-card">
          <div className="card-title advanced">{translations.advanced}</div>
          <div className="price">1500 EGP{translations.perMonth}</div>
          <div className="discount">17% {translations.off}</div>
          <div className="line-through">{translations.oldPrice}: 1800 EGP</div>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: 1500 EGP</li>
            <li><span className="check">✓</span> 3 {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: 17%</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Advanced Private')}>{translations.bookNow}</button>
        </div>
        
        <div className="card">
          <div className="card-title special">{translations.special}</div>
          <div className="price">1200 EGP{translations.perMonth}</div>
          <div className="discount">33% {translations.off}</div>
          <div className="line-through">{translations.oldPrice}: 1800 EGP</div>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: 1200 EGP</li>
            <li><span className="check">✓</span> 6 {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: 33%</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Special Private')}>{translations.bookNow}</button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
