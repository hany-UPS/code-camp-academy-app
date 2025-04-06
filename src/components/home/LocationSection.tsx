
import React from "react";

interface LocationSectionProps {
  selectedLocation: string;
  locationData: Record<string, string>;
  handleLocationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  language: "en" | "ar";
  translations: {
    branches: string;
    chooseBranch: string;
    selectBranch: string;
  };
}

const LocationSection: React.FC<LocationSectionProps> = ({
  selectedLocation,
  locationData,
  handleLocationChange,
  language,
  translations
}) => {
  // Map of location names to image URLs
  const locationImages: Record<string, string> = {
    "El minia": "https://i.postimg.cc/RVMmFPcy/el-minia.jpg",
    "new_El minia": "https://i.postimg.cc/xTqHMhDW/new-minia.jpg",
    "smaluat": "https://i.postimg.cc/SxDnCmvv/smalaut.jpg",
    "magagh": "https://i.postimg.cc/qRHvYr6S/magagh.jpg",
    "bany_mazar": "https://i.postimg.cc/HxJNyv3F/bani-mazar.jpg",
    "abo_gurags": "https://i.postimg.cc/dVhTxx3p/abo-qurqas.jpg",
    "mallya": "https://i.postimg.cc/HW6KvP4v/mallawi.jpg",
    "online": "https://i.postimg.cc/PqVx4nyZ/online-learning.jpg"
  };

  return (
    <section className="content" id="branches">
      <h2 className="text-4xl font-bold text-center text-purple-900 mb-8">{translations.branches}</h2>
      
      <div className="max-w-2xl mx-auto">
        <label className="block text-lg font-medium mb-2">{translations.chooseBranch}</label>
        <select 
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          value={selectedLocation}
          onChange={handleLocationChange}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <option value="select">{translations.selectBranch}</option>
          {Object.keys(locationData).map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        
        <div className="p-4 bg-white rounded-lg shadow-md">
          {selectedLocation === "select" ? (
            <p className="text-gray-500">{translations.selectBranch}</p>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <img 
                  src={locationImages[selectedLocation] || "https://i.postimg.cc/PqVx4nyZ/online-learning.jpg"} 
                  alt={selectedLocation} 
                  className="w-full h-auto rounded-md"
                />
              </div>
              <div className="md:w-1/2">
                <p>{locationData[selectedLocation]}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
