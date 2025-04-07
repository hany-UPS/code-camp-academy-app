
import React, { useRef, useEffect } from "react";

interface CoursesSliderProps {
  language: "en" | "ar";
  translations: {
    courses: string;
  };
}

const CoursesSlider: React.FC<CoursesSliderProps> = ({ language, translations }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const firstSlide = sliderRef.current.querySelector('.slide');
        if (firstSlide) {
          sliderRef.current.appendChild(firstSlide.cloneNode(true));
          sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
          sliderRef.current.style.transform = 'translateX(-300px)';
          
          setTimeout(() => {
            if (sliderRef.current) {
              sliderRef.current.style.transition = 'none';
              sliderRef.current.style.transform = 'translateX(0)';
              sliderRef.current.removeChild(sliderRef.current.firstChild as Node);
            }
          }, 500);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const courses = {
    en: [
      {
        title: "Snake Game using Pictoblox",
        description: "Advanced level of game design."
      },
      {
        title: "Calculator using Python",
        description: "Python level: Introduction to AI."
      },
      {
        title: "Geometric Drawing Game",
        description: "Beginner level of game design."
      }
    ],
    ar: [
      {
        title: "لعبة الثعبان باستخدام بيكتوبلوكس",
        description: "مستوى متقدم من تصميم الألعاب."
      },
      {
        title: "آلة حاسبة باستخدام بايثون",
        description: "بايثون: مقدمة للذكاء الاصطناعي."
      },
      {
        title: "لعبة الرسم الهندسي",
        description: "مستوى مبتدئ من تصميم الألعاب."
      }
    ]
  };

  return (
    <section className="content" id="courses">
      <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">{translations.courses}</h2>
      
      <div className="slider-container">
        <div className="slider" ref={sliderRef}>
          <div className="slide">
            <img src="https://i.postimg.cc/fysgZ6HW/ezgif-com-animated-gif-maker-4.gif" alt="Snake Game" />
            <div className="slide-info">
              <div className="slide-title">{courses[language][0].title}</div>
              <div className="slide-description">{courses[language][0].description}</div>
            </div>
          </div>

          <div className="slide">
            <img src="https://i.postimg.cc/7Lsmj5zV/ezgif-com-animated-gif-maker-5.gif" alt="Calculator using Python" />
            <div className="slide-info">
              <div className="slide-title">{courses[language][1].title}</div>
              <div className="slide-description">{courses[language][1].description}</div>
            </div>
          </div>

          <div className="slide">
            <img src="https://i.postimg.cc/0yX3mXNZ/ezgif-com-animated-gif-maker-2.gif" alt="Geometric Drawing Game" />
            <div className="slide-info">
              <div className="slide-title">{courses[language][2].title}</div>
              <div className="slide-description">{courses[language][2].description}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSlider;
