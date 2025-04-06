
import React, { useRef, useEffect } from "react";

interface StudentProjectsProps {
  language: "en" | "ar";
  translations: {
    studentProjects: string;
    studentsDesc: string;
    project1Title: string;
    project1Student: string;
    project1Age: string;
    project1Desc: string;
    project2Title: string;
    project2Student: string;
    project2Age: string;
    project2Desc: string;
    project3Title: string;
    project3Student: string;
    project3Age: string;
    project3Desc: string;
  };
}

const StudentProjects: React.FC<StudentProjectsProps> = ({ language, translations }) => {
  const studentsSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (studentsSliderRef.current) {
        const firstSlide = studentsSliderRef.current.querySelector('.slide');
        if (firstSlide) {
          studentsSliderRef.current.appendChild(firstSlide.cloneNode(true));
          studentsSliderRef.current.style.transition = 'transform 0.5s ease-in-out';
          studentsSliderRef.current.style.transform = 'translateX(-300px)';
          
          setTimeout(() => {
            if (studentsSliderRef.current) {
              studentsSliderRef.current.style.transition = 'none';
              studentsSliderRef.current.style.transform = 'translateX(0)';
              studentsSliderRef.current.removeChild(studentsSliderRef.current.firstChild as Node);
            }
          }, 500);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="content" id="students">
      <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">{translations.studentProjects}</h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{translations.studentsDesc}</p>
      
      <div className="slider-container">
        <div className="slider" ref={studentsSliderRef}>
          <div className="slide">
            <div className="youtube-embed">
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Student Project 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="slide-info">
              <div className="slide-title">{translations.project1Title}</div>
              <div className="slide-description">
                <strong>{translations.project1Student}</strong> - {translations.project1Age}<br />
                {translations.project1Desc}
              </div>
            </div>
          </div>

          <div className="slide">
            <div className="youtube-embed">
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Student Project 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="slide-info">
              <div className="slide-title">{translations.project2Title}</div>
              <div className="slide-description">
                <strong>{translations.project2Student}</strong> - {translations.project2Age}<br />
                {translations.project2Desc}
              </div>
            </div>
          </div>

          <div className="slide">
            <div className="youtube-embed">
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Student Project 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="slide-info">
              <div className="slide-title">{translations.project3Title}</div>
              <div className="slide-description">
                <strong>{translations.project3Student}</strong> - {translations.project3Age}<br />
                {translations.project3Desc}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentProjects;
