
import React from "react";

interface HeroProps {
  language: "en" | "ar";
  translations: {
    heroTitle: string;
    heroDesc: string;
    startLearning: string;
  };
}

const Hero: React.FC<HeroProps> = ({ language, translations }) => {
  return (
    <section className="hero" id="home">
      <div className="hero-container mx-auto px-5 py-8">
        <div className="hero-content">
          <h1>{translations.heroTitle}</h1>
          <p>{translations.heroDesc}</p>
          <a href="http://wa.me/+201204262410" className="cta">{translations.startLearning}</a>
        </div>
        <img 
          src="https://i.postimg.cc/VNy5F8Dk/ezgif-com-animated-gif-maker-7.gif" 
          alt="Students learning to code" 
          className="hero-image"
        />
      </div>
    </section>
  );
};

export default Hero;
