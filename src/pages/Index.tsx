
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/styles/home.css";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [activeAge, setActiveAge] = useState<string>("7-9");
  const [selectedPlan, setSelectedPlan] = useState<string>("general");
  const sliderRef = useRef<HTMLDivElement>(null);
  const studentsSliderRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("select");
  const locationData: Record<string, string> = {
    "El minia": "123 Main Street, El Minia, Egypt - Contact: +20 123 456 789",
    "new_El minia": "456 New Avenue, New Minia City - Contact: +20 123 456 790",
    "smaluat": "789 Central Road, Smaluat - Contact: +20 123 456 791",
    "magagh": "101 Plaza Street, Magagh - Contact: +20 123 456 792",
    "bany_mazar": "202 Northern Blvd, Bani Mazar - Contact: +20 123 456 793",
    "abo_gurags": "303 Southern Street, Abu Qurqas - Contact: +20 123 456 794",
    "mallya": "404 Eastern Road, Mallawi - Contact: +20 123 456 795",
    "online": "Learn from anywhere! All you need is an internet connection and a computer or tablet."
  };

  const coursesData: Record<string, Array<{title: string, description: string, image: string}>> = {
    "7-9": [
      {
        title: "Scratch Basics",
        description: "Introduction to programming with fun animations and games",
        image: "https://i.postimg.cc/0yX3mXNZ/ezgif-com-animated-gif-maker-2.gif"
      },
      {
        title: "Digital Art",
        description: "Create colorful drawings and simple animations",
        image: "https://i.postimg.cc/G2GSWcxS/ezgif-com-animated-gif-maker-1.gif"
      }
    ],
    "10-12": [
      {
        title: "Game Development",
        description: "Build interactive games with Scratch and PictoBlox",
        image: "https://i.postimg.cc/WbHG3dvK/apple-ezgif-com-resize.gif"
      },
      {
        title: "Web Design Basics",
        description: "Create simple websites with HTML and CSS",
        image: "https://i.postimg.cc/G2GSWcxS/ezgif-com-animated-gif-maker-1.gif"
      }
    ],
    "13-15": [
      {
        title: "Python Programming",
        description: "Introduction to Python with practical applications",
        image: "https://i.postimg.cc/7Lsmj5zV/ezgif-com-animated-gif-maker-5.gif"
      },
      {
        title: "Advanced Game Development",
        description: "Create complex games with logic and physics",
        image: "https://i.postimg.cc/fysgZ6HW/ezgif-com-animated-gif-maker-4.gif"
      }
    ],
    "16-18": [
      {
        title: "Web Development",
        description: "Full-stack development with React and Node.js",
        image: "https://i.postimg.cc/mkJ61hnY/ezgif-com-animated-gif-maker-8.gif"
      },
      {
        title: "App Development",
        description: "Build mobile apps for Android and iOS",
        image: "https://i.postimg.cc/SsZPqg7t/ezgif-com-resize-1.gif"
      }
    ],
    "19-40": [
      {
        title: "Advanced Programming",
        description: "Professional software development with Python, Java, and more",
        image: "https://i.postimg.cc/pdH4BhLk/ezgif-com-resize-2.gif"
      },
      {
        title: "Data Science",
        description: "Analysis and visualization with Python and R",
        image: "https://i.postimg.cc/yxkbN0L6/ezgif-com-resize-3.gif"
      }
    ]
  };

  useEffect(() => {
    // Hamburger menu toggle logic
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }

    // Auto slide for course slider
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

      // Do the same for students slider
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

  const handleAgeChange = (age: string) => {
    setActiveAge(age);
  };

  const togglePlans = (planType: string) => {
    setSelectedPlan(planType);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  const toggleFAQ = (header: HTMLElement) => {
    const faq = header.parentElement;
    if (faq) {
      faq.classList.toggle('active');
      const icon = header.querySelector('.faq-icon');
      if (icon) {
        icon.textContent = faq.classList.contains('active') ? '▼' : '▶';
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Custom Navigation */}
        <nav className="custom-nav bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <button className="hamburger" id="hamburger">☰</button>
            
            <ul className="nav-links" id="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#Ages">Ages</a></li>
              <li><a href="#price">Price</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>

            {/* Language Toggle */}
            <div className="language-toggle" id="language-toggle">
              <img src="https://flagcdn.com/w20/gb.png" alt="English" id="english-icon" className="language-icon active" />
              <img src="https://flagcdn.com/w20/sa.png" alt="Arabic" id="arabic-icon" className="language-icon" />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-container mx-auto px-5 py-8">
            <div className="hero-content">
              <h1>Young Coders Today<br/>Future Tech Leaders</h1>
              <p>Enroll your kids in interactive programming sessions and empower their future with expert instructors.</p>
              <a href="http://wa.me/+201204262410" className="cta">Start Learning Today</a>
            </div>
            <img 
              src="https://i.postimg.cc/VNy5F8Dk/ezgif-com-animated-gif-maker-7.gif" 
              alt="Students learning to code" 
              className="hero-image"
            />
          </div>
        </section>

        {/* Ages Section */}
        <section className="content" id="Ages">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-8">Courses by Ages</h2>
          
          <div className="button-container grid grid-cols-2 md:grid-cols-5 gap-1">
            {Object.keys(coursesData).map(age => (
              <button 
                key={age}
                className={`button ${activeAge === age ? 'active' : ''}`} 
                data-group={age}
                onClick={() => handleAgeChange(age)}
              >
                Age {age}
              </button>
            ))}
          </div>

          <div className="courses" id="course-list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coursesData[activeAge].map((course, index) => (
                <div key={index} className="course-card bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Slider Section */}
        <section className="content" id="courses">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">Courses</h2>
          
          <div className="slider-container">
            <div className="slider" ref={sliderRef}>
              {/* Project 1 */}
              <div className="slide">
                <img src="https://i.postimg.cc/fysgZ6HW/ezgif-com-animated-gif-maker-4.gif" alt="Snake Game" />
                <div className="slide-info">
                  <div className="slide-title">Snake Game using Pictoblox</div>
                  <div className="slide-description">Advanced level of game design.</div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="slide">
                <img src="https://i.postimg.cc/7Lsmj5zV/ezgif-com-animated-gif-maker-5.gif" alt="Calculator using Python" />
                <div className="slide-info">
                  <div className="slide-title">Calculator using Python</div>
                  <div className="slide-description">Python level: Introduction to AI.</div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="slide">
                <img src="https://i.postimg.cc/0yX3mXNZ/ezgif-com-animated-gif-maker-2.gif" alt="Geometric Drawing Game" />
                <div className="slide-info">
                  <div className="slide-title">Geometric Drawing Game</div>
                  <div className="slide-description">Beginner level of game design.</div>
                </div>
              </div>

              {/* Project 4 */}
              <div className="slide">
                <img src="https://i.postimg.cc/G2GSWcxS/ezgif-com-animated-gif-maker-1.gif" alt="Planet Website Design" />
                <div className="slide-info">
                  <div className="slide-title">Planet Website Design</div>
                  <div className="slide-description">Second level of web design.</div>
                </div>
              </div>

              {/* Project 5 */}
              <div className="slide">
                <img src="https://i.postimg.cc/WbHG3dvK/apple-ezgif-com-resize.gif" alt="Apple War Game" />
                <div className="slide-info">
                  <div className="slide-title">Apple War Game</div>
                  <div className="slide-description">Second level of game design.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="content" id="price">
          <h2 className="text-4xl font-bold text-center text-purple-900 mt-5 mb-1">Pricing Plans</h2>
          <p className="text-center text-gray-700 mb-6">
            Choose the right plan. We offer private plans for a single child and general plans for a group of 8-10 children. Choose what suits your needs.
          </p>

          <div className="container mx-auto px-4">
            <div className="overlay" id="overlay"></div>

            <div className="toggle-buttons mb-6">
              <button 
                className={`general-btn ${selectedPlan === 'general' ? 'active' : ''}`} 
                onClick={() => togglePlans('general')}
              >
                General
              </button>
              <button 
                className={`private-btn ${selectedPlan === 'private' ? 'active' : ''}`} 
                onClick={() => togglePlans('private')}
              >
                Private
              </button>
            </div>

            {/* Pricing Cards */}
            <div className="pricing-cards" id="pricing-cards">
              {/* Private Plans */}
              <div className={`active-cards private ${selectedPlan === 'private' ? 'flex' : 'hidden'}`}>
                <div className="card private-card">
                  <div className="card-title basic">Basic</div>
                  <div className="price">2000 EGP / month</div>
                  <div className="discount">0% off</div>
                  <span className="line-through">2000.00</span>
                  <span className="text-xs">OLD PRICE</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;Price per month</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;No discount</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => navigate("/login")}>Book Now</button>
                </div>
                <div className="card private-card">
                  <div className="card-title advanced rounded-t-lg">Advanced</div>
                  <div className="price">3400 EGP / month</div>
                  <div className="discount">15% off</div>
                  <span className="line-through">4000.00</span>
                  <span className="text-xs">OLD PRICE</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;2 months plan</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;600 Discount applied</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => navigate("/login")}>Book Now</button>
                </div>
                <div className="card private-card shadow-card">
                  <div className="card-title special rounded-t-lg">Special</div>
                  <div className="price">7500 EGP / month</div>
                  <div className="discount">25% off</div>
                  <span className="line-through">10000.00</span>
                  <span className="text-xs">OLD PRICE</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;5 months plan</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;2500 Discount applied</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => navigate("/login")}>Book Now</button>
                </div>
              </div>

              {/* General Plans */}
              <div className={`active-cards general ${selectedPlan === 'general' ? 'flex' : 'hidden'}`}>
                <div className="card general-card">
                  <div className="card-title basic rounded-t-lg">Basic</div>
                  <div className="price">600 EGP / month</div>
                  <div className="discount">0% off</div>
                  <span className="line-through">600.00</span>
                  <span className="text-xs">OLD PRICE</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;Price per month</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;No discount</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => navigate("/login")}>Book Now</button>
                </div>
                <div className="card general-card">
                  <div className="card-title advanced rounded-t-lg">Advanced</div>
                  <div className="price">1530 EGP / month</div>
                  <div className="discount">15% off</div>
                  <span className="line-through">1800.00</span>
                  <span className="text-xs">OLD PRICE</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;3 months plan</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;270 Discount applied</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => navigate("/login")}>Book Now</button>
                </div>
                <div className="card general-card shadow-card">
                  <div className="card-title special rounded-t-lg">Special</div>
                  <div className="price">2250 EGP / month</div>
                  <div className="discount">25% off</div>
                  <span className="line-through">3000.00</span>
                  <span className="text-xs">OLD PRICE</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;5 months plan</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;750 Discount applied</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => navigate("/login")}>Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Student Projects Section */}
        <section className="content">
          <h1 className="text-4xl font-bold text-center text-purple-900 mb-2">Student Projects</h1>
          <p className="text-center text-gray-600 mb-8">
            Our students' projects have led to major success stories, including scholarships and global competitions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {/* Project 1 */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <iframe className="w-full rounded-t-lg" height="200" src="https://www.youtube.com/embed/B5COE6bLbgA" width="300" frameBorder="0" allowFullScreen></iframe>
              <h2 className="text-xl font-bold text-orange-500 mt-4">AI & Data Analysis</h2>
              <div className="flex items-center mt-2">
                <img className="w-12 h-12 rounded-full" src="https://i.postimg.cc/Hnj1Bcmc/1-2.jpg" alt="Student"/>
                <div className="ml-4 mx-4">
                  <p className="text-gray-800 font-bold">Joyce</p>
                  <p className="text-gray-600">15 years old</p>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                AI project focused on data analysis, big data algorithms, and machine learning models to solve real-world problems.
              </p>
            </div>

            {/* Project 2 */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <iframe className="w-full rounded-t-lg" height="200" src="https://www.youtube.com/embed/rgObQSfFWEw" width="300" frameBorder="0" allowFullScreen></iframe>
              <h2 className="text-xl font-bold text-green-500 mt-4">Engineering Design</h2>
              <div className="flex items-center mt-2">
                <img className="w-12 h-12 rounded-full" src="https://i.postimg.cc/bJmjx07f/1-3.jpg" alt="Student"/>
                <div className="ml-4 mx-4">
                  <p className="text-gray-800 font-bold">Mariam</p>
                  <p className="text-gray-600">10 years old</p>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                Car design and simulation using 3D modeling, aerodynamics analysis, and competing against professional engineers.
              </p>
            </div>

            {/* Project 3 */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <iframe className="w-full rounded-t-lg" height="200" src="https://www.youtube.com/embed/Uw5SFcFbaxI" width="300" frameBorder="0" allowFullScreen></iframe>
              <h2 className="text-xl font-bold text-orange-500 mt-4">Advanced Arduino</h2>
              <div className="flex items-center mt-2">
                <img className="w-12 h-12 rounded-full" src="https://i.postimg.cc/PxXjvVFM/1-1.jpg" alt="Student"/>
                <div className="ml-4 mx-4">
                  <p className="text-gray-800 font-bold">Yustus</p>
                  <p className="text-gray-600">11 years old</p>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                Electronics and microcontrollers, smart home automation, and building an electronic cane for the visually impaired.
              </p>
            </div>
          </div>
        </section>

        {/* Branches Section */}
        <section className="content flex my-10 flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-purple-900 mb-6 mt-3">Branches</h1>

          <div className="relative w-11/12 max-w-md h-64 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-105">
            <img id="mapImage" src="https://i.postimg.cc/4xCxsymT/loc.png" alt="Map of Egypt" className="w-full h-full object-cover" />
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <label htmlFor="locationSelect" className="text-lg font-medium text-gray-700">Choose the branch:</label>
            <select 
              id="locationSelect" 
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <option value="select">Select</option>
              <option value="El minia">El minia</option>
              <option value="new_El minia">New minia</option>
              <option value="smaluat">Smaluat</option>
              <option value="magagh">Magagh</option>
              <option value="bany_mazar">Bani Mazar</option>
              <option value="abo_gurags">Abu Qurqas</option>
              <option value="mallya">Mallawi</option>
              <option value="online">Online</option>
            </select>
          </div>
          
          <div className="mt-6 text-center text-lg font-medium text-gray-700 bg-white p-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 max-w-md w-full">
            {selectedLocation === "select" 
              ? "Select a branch to see the details." 
              : locationData[selectedLocation]}
          </div>
        </section>

        {/* Students Section */}
        <section className="content" id="images">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">Students</h2>
          
          <div className="slider-container">
            <div className="slider" ref={studentsSliderRef}>
              <div className="slide">
                <img src="https://i.postimg.cc/mkJ61hnY/ezgif-com-animated-gif-maker-8.gif" alt="3D Ping Pong" />
              </div>
              
              <div className="slide">
                <img src="https://i.postimg.cc/SsZPqg7t/ezgif-com-resize-1.gif" alt="AI Self Driving" />
              </div>
              
              <div className="slide">
                <img src="https://i.postimg.cc/pdH4BhLk/ezgif-com-resize-2.gif" alt="Weather Simulation" />
              </div>
              
              <div className="slide">
                <img src="https://i.postimg.cc/yxkbN0L6/ezgif-com-resize-3.gif" alt="Maze Solver" />
              </div>
              
              <div className="slide">
                <img src="https://i.postimg.cc/85kYq2W6/ezgif-com-resize-5.gif" alt="Digital Clock" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="content" id="faq">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-8">FAQs</h2>
          <div className="faq-container max-w-4xl mx-auto">
            <div className="faq" data-color="rgba(255, 165, 0, 0.7)">
              <div className="faq-header" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <div className="faq-icon" style={{background: 'orange'}}>▶</div>
                What age group are your courses designed for?
              </div>
              <div className="faq-content">Our courses are tailored for children aged 7-17 years...</div>
            </div>
            
            <div className="faq" data-color="rgba(255, 99, 71, 0.7)">
              <div className="faq-header" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <div className="faq-icon" style={{background: 'red'}}>▶</div>
                When does the course start?
              </div>
              <div className="faq-content">After registration, we will contact you via WhatsApp once the group is formed.</div>
            </div>
            
            <div className="faq" data-color="rgba(60, 179, 113, 0.7)">
              <div className="faq-header" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <div className="faq-icon" style={{background: 'darkgreen'}}>▶</div>
                How are the course schedules determined?
              </div>
              <div className="faq-content">Once the group is formed, we create a WhatsApp group and discuss the most convenient schedule for everyone.</div>
            </div>
            
            <div className="faq" data-color="rgba(218, 165, 32, 0.7)">
              <div className="faq-header" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <div className="faq-icon" style={{background: 'goldenrod'}}>▶</div>
                Is there a sibling discount?
              </div>
              <div className="faq-content">Yes, there is a 10% discount.</div>
            </div>
            
            <div className="faq" data-color="rgba(70, 130, 180, 0.7)">
              <div className="faq-header" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <div className="faq-icon" style={{background: 'steelblue'}}>▶</div>
                Does the child choose the specialization, or does the academy decide?
              </div>
              <div className="faq-content">The child is placed in a suitable specialization based on our expertise. Children also go through multiple specializations to discover their strengths.</div>
            </div>
            
            <div className="faq" data-color="rgba(123, 104, 238, 0.7)">
              <div className="faq-header" onClick={(e) => toggleFAQ(e.currentTarget)}>
                <div className="faq-icon" style={{background: 'mediumpurple'}}>▶</div>
                Are there any required tools?
              </div>
              <div className="faq-content">Tools are only required for robotics courses, including electronics, batteries, motors, and more.</div>
            </div>
          </div>
        </section>

        {/* Floating WhatsApp Icon */}
        <a href="http://wa.me/+201204262410" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
        </a>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
