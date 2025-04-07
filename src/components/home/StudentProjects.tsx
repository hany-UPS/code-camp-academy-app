
import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

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
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  
  // YouTube video IDs
  const videoIds = [
    "dQw4w9WgXcQ",
    "dQw4w9WgXcQ",
    "dQw4w9WgXcQ"
  ];
  
  const handleVideoClick = (index: number) => {
    setPlayingVideo(index);
  };
  
  const handleVideoClose = () => {
    setPlayingVideo(null);
  };

  return (
    <section className="content" id="students">
      <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">{translations.studentProjects}</h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">{translations.studentsDesc}</p>
      
      <div className="max-w-4xl mx-auto px-4">
        <Carousel className="w-full">
          <CarouselContent>
            {/* Project 1 */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="slide p-2 h-full">
                <div className="relative">
                  {playingVideo === 0 ? (
                    <div className="youtube-embed">
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoIds[0]}?autoplay=1`}
                        title="Student Project 1"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <button 
                        onClick={handleVideoClose}
                        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 z-10"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="youtube-thumbnail cursor-pointer"
                      onClick={() => handleVideoClick(0)}
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${videoIds[0]}/hqdefault.jpg`} 
                        alt="Student Project 1"
                        className="w-full rounded-t-md h-48 object-cover" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 text-white rounded-full p-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="slide-info">
                  <div className="slide-title">{translations.project1Title}</div>
                  <div className="slide-description">
                    <strong>{translations.project1Student}</strong> - {translations.project1Age}<br />
                    {translations.project1Desc}
                  </div>
                </div>
              </div>
            </CarouselItem>
            
            {/* Project 2 */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="slide p-2 h-full">
                <div className="relative">
                  {playingVideo === 1 ? (
                    <div className="youtube-embed">
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoIds[1]}?autoplay=1`}
                        title="Student Project 2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <button 
                        onClick={handleVideoClose}
                        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 z-10"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="youtube-thumbnail cursor-pointer"
                      onClick={() => handleVideoClick(1)}
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${videoIds[1]}/hqdefault.jpg`} 
                        alt="Student Project 2" 
                        className="w-full rounded-t-md h-48 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 text-white rounded-full p-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="slide-info">
                  <div className="slide-title">{translations.project2Title}</div>
                  <div className="slide-description">
                    <strong>{translations.project2Student}</strong> - {translations.project2Age}<br />
                    {translations.project2Desc}
                  </div>
                </div>
              </div>
            </CarouselItem>
            
            {/* Project 3 */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <div className="slide p-2 h-full">
                <div className="relative">
                  {playingVideo === 2 ? (
                    <div className="youtube-embed">
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoIds[2]}?autoplay=1`}
                        title="Student Project 3"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <button 
                        onClick={handleVideoClose}
                        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1 z-10"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="youtube-thumbnail cursor-pointer"
                      onClick={() => handleVideoClick(2)}
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${videoIds[2]}/hqdefault.jpg`} 
                        alt="Student Project 3" 
                        className="w-full rounded-t-md h-48 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 text-white rounded-full p-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="slide-info">
                  <div className="slide-title">{translations.project3Title}</div>
                  <div className="slide-description">
                    <strong>{translations.project3Student}</strong> - {translations.project3Age}<br />
                    {translations.project3Desc}
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  );
};

export default StudentProjects;
