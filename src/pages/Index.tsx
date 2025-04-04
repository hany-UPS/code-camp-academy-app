
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Code, Youtube } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-academy-orange" />,
      title: "Engaging Courses",
      description: "Kid-friendly programming courses designed to make learning fun and interactive."
    },
    {
      icon: <Code className="h-10 w-10 text-academy-blue" />,
      title: "Learn Coding",
      description: "From Scratch to Python to game development, we cover various programming languages."
    },
    {
      icon: <Youtube className="h-10 w-10 text-academy-orange" />,
      title: "Video Tutorials",
      description: "Well-structured video lessons that keep children engaged and interested."
    },
    {
      icon: <Users className="h-10 w-10 text-academy-blue" />,
      title: "Student Progress",
      description: "Track learning progress through our comprehensive tracking system."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-academy-light-orange to-academy-light-blue py-16 md:py-24">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 leading-tight">
                Learn Programming the <span className="text-academy-orange">Fun</span> Way
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
                UPS Junior Programming Academy makes learning to code exciting for kids through 
                engaging video courses and interactive sessions.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Button 
                  className="bg-academy-orange hover:bg-orange-600 text-white px-8 py-6 rounded-lg text-lg"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-academy-blue text-academy-blue hover:bg-academy-light-blue px-8 py-6 rounded-lg text-lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end animate-bounce-slow">
              <img 
                src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=500&auto=format&fit=crop" 
                alt="Kids coding" 
                className="rounded-3xl shadow-2xl max-w-full h-auto"
              />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why UPS Junior Academy?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join UPS Junior Programming Academy today and help your child develop valuable 
              coding skills in a fun and engaging environment.
            </p>
            <Button 
              className="bg-academy-orange hover:bg-orange-600 text-white px-8 py-6 rounded-lg text-lg"
              onClick={() => navigate("/login")}
            >
              Sign In Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
