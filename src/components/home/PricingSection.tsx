
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
  // Updated pricing data based on the provided values
  const pricingData = {
    private: {
      basic: {
        price: "2000",
        displayPrice: "2000", 
        perMonthPrice: "2000",
        discountPercent: "0",
        discountAmount: "0",
        months: "1",
        oldPrice: "2000.00"
      },
      advanced: {
        price: "3400",
        displayPrice: "3400",
        perMonthPrice: "1700",
        discountPercent: "15",
        discountAmount: "600",
        months: "2",
        oldPrice: "4000.00"
      },
      special: {
        price: "7500",
        displayPrice: "7500",
        perMonthPrice: "1500",
        discountPercent: "25",
        discountAmount: "2500",
        months: "5",
        oldPrice: "10000.00"
      }
    },
    general: {
      basic: {
        price: "600",
        displayPrice: "600",
        perMonthPrice: "600",
        discountPercent: "0",
        discountAmount: "0",
        months: "1",
        oldPrice: "600.00"
      },
      advanced: {
        price: "1530",
        displayPrice: "1530",
        perMonthPrice: "510",
        discountPercent: "15",
        discountAmount: "270",
        months: "3",
        oldPrice: "1800.00"
      },
      special: {
        price: "2250",
        displayPrice: "2250",
        perMonthPrice: "450",
        discountPercent: "25",
        discountAmount: "750",
        months: "5",
        oldPrice: "3000.00"
      }
    }
  };

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
      
      {/* Private Plans */}
      <div className={`active-cards private ${selectedPlan === 'private' ? '' : 'hidden'}`}>
        <div className="card private-card">
          <div className="card-title basic rounded-t-lg">{translations.basic}</div>
          <div className="price">{pricingData.private.basic.displayPrice} EGP{translations.perMonth}</div>
          <div className="discount">{pricingData.private.basic.discountPercent}% {translations.off}</div>
          <span className="line-through">{pricingData.private.basic.oldPrice}</span>
          <span className="text-xs">{translations.oldPrice}</span>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: {pricingData.private.basic.perMonthPrice} EGP</li>
            <li><span className="check">✓</span> {pricingData.private.basic.months} {translations.monthsPlan}</li>
            {parseInt(pricingData.private.basic.discountPercent) > 0 ? (
              <li><span className="check">✓</span> {translations.discountApplied}: {pricingData.private.basic.discountAmount}</li>
            ) : (
              <li><span className="check">✓</span> {translations.noDiscount}</li>
            )}
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Basic Private')}>{translations.bookNow}</button>
        </div>
        
        <div className="card private-card">
          <div className="card-title advanced rounded-t-lg">{translations.advanced}</div>
          <div className="price">{pricingData.private.advanced.displayPrice} EGP{translations.perMonth}</div>
          <div className="discount">{pricingData.private.advanced.discountPercent}% {translations.off}</div>
          <span className="line-through">{pricingData.private.advanced.oldPrice}</span>
          <span className="text-xs">{translations.oldPrice}</span>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: {pricingData.private.advanced.perMonthPrice} EGP</li>
            <li><span className="check">✓</span> {pricingData.private.advanced.months} {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: {pricingData.private.advanced.discountAmount}</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Advanced Private')}>{translations.bookNow}</button>
        </div>
        
        <div className="card private-card shadow-card">
          <div className="card-title special rounded-t-lg">{translations.special}</div>
          <div className="price">{pricingData.private.special.displayPrice} EGP{translations.perMonth}</div>
          <div className="discount">{pricingData.private.special.discountPercent}% {translations.off}</div>
          <span className="line-through">{pricingData.private.special.oldPrice}</span>
          <span className="text-xs">{translations.oldPrice}</span>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: {pricingData.private.special.perMonthPrice} EGP</li>
            <li><span className="check">✓</span> {pricingData.private.special.months} {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: {pricingData.private.special.discountAmount}</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Special Private')}>{translations.bookNow}</button>
        </div>
      </div>
      
      {/* General Plans */}
      <div className={`active-cards general ${selectedPlan === 'general' ? '' : 'hidden'}`}>
        <div className="card general-card">
          <div className="card-title basic rounded-t-lg">{translations.basic}</div>
          <div className="price">{pricingData.general.basic.displayPrice} EGP{translations.perMonth}</div>
          <div className="discount">{pricingData.general.basic.discountPercent}% {translations.off}</div>
          <span className="line-through">{pricingData.general.basic.oldPrice}</span>
          <span className="text-xs">{translations.oldPrice}</span>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: {pricingData.general.basic.perMonthPrice} EGP</li>
            <li><span className="check">✓</span> {pricingData.general.basic.months} {translations.monthsPlan}</li>
            {parseInt(pricingData.general.basic.discountPercent) > 0 ? (
              <li><span className="check">✓</span> {translations.discountApplied}: {pricingData.general.basic.discountPercent}%</li>
            ) : (
              <li><span className="check">✓</span> {translations.noDiscount}</li>
            )}
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Basic General')}>{translations.bookNow}</button>
        </div>
        
        <div className="card general-card">
          <div className="card-title advanced rounded-t-lg">{translations.advanced}</div>
          <div className="price">{pricingData.general.advanced.displayPrice} EGP{translations.perMonth}</div>
          <div className="discount">{pricingData.general.advanced.discountPercent}% {translations.off}</div>
          <span className="line-through">{pricingData.general.advanced.oldPrice}</span>
          <span className="text-xs">{translations.oldPrice}</span>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: {pricingData.general.advanced.perMonthPrice} EGP</li>
            <li><span className="check">✓</span> {pricingData.general.advanced.months} {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: {pricingData.general.advanced.discountAmount}</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Advanced General')}>{translations.bookNow}</button>
        </div>
        
        <div className="card general-card shadow-card">
          <div className="card-title special rounded-t-lg">{translations.special}</div>
          <div className="price">{pricingData.general.special.displayPrice} EGP{translations.perMonth}</div>
          <div className="discount">{pricingData.general.special.discountPercent}% {translations.off}</div>
          <span className="line-through">{pricingData.general.special.oldPrice}</span>
          <span className="text-xs">{translations.oldPrice}</span>
          <ul>
            <li><span className="check">✓</span> {translations.pricePerMonth}: {pricingData.general.special.perMonthPrice} EGP</li>
            <li><span className="check">✓</span> {pricingData.general.special.months} {translations.monthsPlan}</li>
            <li><span className="check">✓</span> {translations.discountApplied}: {pricingData.general.special.discountAmount}</li>
          </ul>
          <button className="book-now-btn" onClick={() => scrollToBookingForm('Special General')}>{translations.bookNow}</button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
