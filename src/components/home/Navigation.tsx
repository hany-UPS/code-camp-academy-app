
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  language: "en" | "ar";
  isAuthenticated: boolean;
  toggleLanguage: () => void;
  logout: () => void;
  translations: {
    home: string;
    ages: string;
    price: string;
    courses: string;
    faq: string;
    contact: string;
  };
}

const Navigation: React.FC<NavigationProps> = ({
  language,
  isAuthenticated,
  toggleLanguage,
  logout,
  translations
}) => {
  
  React.useEffect(() => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }

    return () => {
      if (hamburger && navLinks) {
        hamburger.removeEventListener("click", () => {
          navLinks.classList.toggle("show");
        });
      }
    };
  }, []);

  return (
    <nav className="custom-nav bg-white shadow-md py-4 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-academy-blue">
          Academy
        </Link>
        
        <div className="flex items-center space-x-4">
          <ul className="nav-links hidden md:flex items-center space-x-6" id="nav-links">
            <li><a href="#home">{translations.home}</a></li>
            <li><a href="#Ages">{translations.ages}</a></li>
            <li><a href="#price">{translations.price}</a></li>
            <li><a href="#courses">{translations.courses}</a></li>
            <li><a href="#faq">{translations.faq}</a></li>
            <li><a href="#contact">{translations.contact}</a></li>
          </ul>

          <div className="language-toggle flex items-center" onClick={toggleLanguage}>
            <img 
              src="https://flagcdn.com/w20/gb.png" 
              alt="English" 
              id="english-icon" 
              className={`language-icon ${language === 'en' ? 'active' : ''}`} 
            />
            <img 
              src="https://flagcdn.com/w20/sa.png" 
              alt="Arabic" 
              id="arabic-icon" 
              className={`language-icon ${language === 'ar' ? 'active' : ''}`} 
            />
          </div>
          
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={logout}>
              {language === 'en' ? 'Logout' : 'تسجيل خروج'}
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                {language === 'en' ? 'Login' : 'تسجيل الدخول'}
              </Button>
            </Link>
          )}

          <button className="hamburger block md:hidden" id="hamburger">☰</button>
        </div>
      </div>
      
      {/* Mobile nav links - shown when hamburger is clicked */}
      <div className="md:hidden">
        <ul className="nav-links flex-col space-y-2 max-h-0 overflow-hidden" id="nav-links">
          <li><a href="#home">{translations.home}</a></li>
          <li><a href="#Ages">{translations.ages}</a></li>
          <li><a href="#price">{translations.price}</a></li>
          <li><a href="#courses">{translations.courses}</a></li>
          <li><a href="#faq">{translations.faq}</a></li>
          <li><a href="#contact">{translations.contact}</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
