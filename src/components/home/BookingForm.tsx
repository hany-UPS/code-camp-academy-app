
import React, { useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingFormProps {
  selectedPricePlan: string;
  selectedLocation: string;
  continueCourse: boolean;
  toggleCourseInput: (value: boolean) => void;
  locationData: Record<string, string>;
  handleFormSubmit: (e: React.FormEvent) => Promise<void>;
  language: "en" | "ar";
  translations: {
    bookYourCourse: string;
    bookingFor: string;
    plan: string;
    phoneNumber: string;
    fullName: string;
    age: string;
    branch: string;
    selectBranchOption: string;
    previousCourse: string;
    yes: string;
    no: string;
    previousCourseName: string;
    coursePlan: string;
    selectPlan: string;
    submit: string;
  };
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedPricePlan,
  selectedLocation,
  continueCourse,
  toggleCourseInput,
  locationData,
  handleFormSubmit,
  language,
  translations
}) => {
  const bookingFormRef = useRef<HTMLDivElement>(null);
  
  // List of previous courses for the dropdown
  const previousCourses = [
    "2D Game Design With Pictoblox",
    "Advanced Game design",
    "Intro to AI",
    "Robotics and Electronics Basics",
    "Robotics projects with Arduino",
    "Advanced Arduino Projects",
    "Web Development Basics",
    "Web Development Advanced",
    "Web Development Projects",
    "Python Basics",
    "AI with Python",
    "Data Analysis"
  ];

  return (
    <section className="booking-section" id="booking">
      <div className="max-w-2xl mx-auto booking-form-container" ref={bookingFormRef}>
        <h2 className="text-3xl font-bold text-center text-purple-900 mb-8">{translations.bookYourCourse}</h2>
        
        {selectedPricePlan && (
          <div className="selected-plan-banner p-3 mb-6 rounded-md text-center font-medium">
            {translations.bookingFor} <strong>{selectedPricePlan}</strong> {translations.plan}
          </div>
        )}
        
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">{translations.fullName}</label>
            <input 
              type="text" 
              name="name" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">{translations.phoneNumber}</label>
            <input 
              type="tel" 
              name="phone" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">{translations.age}</label>
            <input 
              type="number" 
              name="age" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
              min="5"
              max="60"
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">{translations.branch}</label>
            <select 
              name="branch" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
              value={selectedLocation !== "select" ? selectedLocation : ""}
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <option value="" disabled>{translations.selectBranchOption}</option>
              {Object.keys(locationData).map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">{translations.previousCourse}</label>
            <div className="yes-no-buttons">
              <button 
                type="button" 
                className={continueCourse ? "active" : ""} 
                onClick={() => toggleCourseInput(true)}
              >
                {translations.yes}
              </button>
              <button 
                type="button" 
                className={!continueCourse ? "active" : ""} 
                onClick={() => toggleCourseInput(false)}
              >
                {translations.no}
              </button>
            </div>
            
            <div id="extra-course-input" className={`extra-course-input ${continueCourse ? "block" : ""}`}>
              <label className="block text-gray-700 mb-2">{translations.previousCourseName}</label>
              <select
                name="course"
                className="w-full p-3 border border-gray-300 rounded-md"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {previousCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">{translations.coursePlan}</label>
            <select 
              id="course-Pric-sel" 
              name="course-Pric-sel" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <option value="">{translations.selectPlan}</option>
              <option value="Basic General">Basic General</option>
              <option value="Advanced General">Advanced General</option>
              <option value="Special General">Special General</option>
              <option value="Basic Private">Basic Private</option>
              <option value="Advanced Private">Advanced Private</option>
              <option value="Special Private">Special Private</option>
            </select>
          </div>
          
          <div className="text-center">
            <button 
              type="submit" 
              className="bg-purple-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-purple-800 transition-colors"
            >
              {translations.submit}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
