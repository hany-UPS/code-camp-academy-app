
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
            <p>{locationData[selectedLocation]}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
