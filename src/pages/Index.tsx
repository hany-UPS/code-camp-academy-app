
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import "@/styles/home.css";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [activeAge, setActiveAge] = useState<string>("7-9");
  const [selectedPlan, setSelectedPlan] = useState<string>("general");
  const sliderRef = useRef<HTMLDivElement>(null);
  const studentsSliderRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("select");
  const [continueCourse, setContinueCourse] = useState<boolean>(false);
  const [selectedPricePlan, setSelectedPricePlan] = useState<string>("");
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  
  // Arabic translations
  const translations = {
    en: {
      home: "Home",
      ages: "Ages",
      price: "Price",
      courses: "Courses",
      faq: "FAQ",
      contact: "Contact",
      heroTitle: "Young Coders Today\nFuture Tech Leaders",
      heroDesc: "Enroll your kids in interactive programming sessions and empower their future with expert instructors.",
      startLearning: "Start Learning Today",
      coursesByAge: "Courses by Ages",
      pricingPlans: "Pricing Plans",
      pricingDesc: "Choose the right plan. We offer private plans for a single child and general plans for a group of 8-10 children. Choose what suits your needs.",
      general: "General",
      private: "Private",
      basic: "Basic",
      advanced: "Advanced",
      special: "Special",
      perMonth: "/ month",
      off: "off",
      oldPrice: "OLD PRICE",
      pricePerMonth: "Price per month",
      noDiscount: "No discount",
      monthsPlan: "months plan",
      discountApplied: "Discount applied",
      bookNow: "Book Now",
      studentProjects: "Student Projects",
      studentsDesc: "Our students' projects have led to major success stories, including scholarships and global competitions.",
      branches: "Branches",
      chooseBranch: "Choose the branch:",
      selectBranch: "Select a branch to see the details.",
      students: "Students",
      bookYourCourse: "Book Your Course",
      bookingFor: "You're booking the",
      plan: "plan",
      phoneNumber: "Phone Number",
      fullName: "Full Name",
      age: "Age",
      branch: "Branch",
      selectBranchOption: "Select a branch",
      previousCourse: "Have you taken a course with us before?",
      yes: "Yes",
      no: "No",
      previousCourseName: "Previous course name",
      coursePlan: "Course Plan",
      selectPlan: "Select a plan",
      submit: "Submit Booking"
    },
    ar: {
      home: "الرئيسية",
      ages: "الأعمار",
      price: "الأسعار",
      courses: "الدورات",
      faq: "الأسئلة الشائعة",
      contact: "اتصل بنا",
      heroTitle: "مبرمجو اليوم الصغار\nقادة التكنولوجيا في المستقبل",
      heroDesc: "سجل أطفالك في جلسات البرمجة التفاعلية وقوي مستقبلهم مع مدربين خبراء.",
      startLearning: "ابدأ التعلم اليوم",
      coursesByAge: "الدورات حسب العمر",
      pricingPlans: "خطط الأسعار",
      pricingDesc: "اختر الخطة المناسبة لك. نقدم خطط خاصة لطفل واحد وخطط عامة لمجموعة من 8-10 أطفال. اختر ما يناسب احتياجاتك.",
      general: "عام",
      private: "خاص",
      basic: "أساسي",
      advanced: "متقدم",
      special: "خاص",
      perMonth: "/ شهريًا",
      off: "خصم",
      oldPrice: "السعر القديم",
      pricePerMonth: "السعر شهريًا",
      noDiscount: "بدون خصم",
      monthsPlan: "خطة شهور",
      discountApplied: "تم تطبيق الخصم",
      bookNow: "احجز الآن",
      studentProjects: "مشاريع الطلاب",
      studentsDesc: "أدت مشاريع طلابنا إلى قصص نجاح كبيرة، بما في ذلك المنح الدراسية والمسابقات العالمية.",
      branches: "الفروع",
      chooseBranch: "اختر الفرع:",
      selectBranch: "اختر فرعًا لرؤية التفاصيل.",
      students: "الطلاب",
      bookYourCourse: "احجز دورتك",
      bookingFor: "أنت تحجز خطة",
      plan: "خطة",
      phoneNumber: "رقم الهاتف",
      fullName: "الاسم الكامل",
      age: "العمر",
      branch: "الفرع",
      selectBranchOption: "اختر فرعًا",
      previousCourse: "هل سبق لك أخذ دورة معنا من قبل؟",
      yes: "نعم",
      no: "لا",
      previousCourseName: "اسم الدورة السابقة",
      coursePlan: "خطة الدورة",
      selectPlan: "اختر خطة",
      submit: "تقديم الحجز"
    }
  };
  
  const t = translations[language];
  
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

  const coursesData = {
    "7-9": [
      { title: "2D Game Design With Pictoblox", image: "https://i.postimg.cc/63m998Yc/Picto-Blox-Blocks.gif" },
      { title: "Advancie Game design ", image: "https://i.postimg.cc/hG8zP1dr/FW5-ZUSFJSCG1-VNW.gif" },
      { title: "Intro to AI", image: "https://i.postimg.cc/Y0TqxvF0/Hand-Gesture-Beetle-in-the-Maze.gif" }
    ],
    "10-12": [
      { title: "Robotics and Electronics Basics", image: "https://i.postimg.cc/25WddWBb/elec.gif" },
      { title: "Robotics projects with Arduino ", image: "https://i.postimg.cc/yxfBfkSc/robot.gif" },
      { title: "Advanced Arduino Projects", image: "https://i.postimg.cc/W3F4qmDC/home.webp" }
    ],
    "13-15": [
      { title: "Web Development Basics", image: "https://i.postimg.cc/FKj4MPL9/web-0.gif" },
      { title: "Web Development advanced", image: "https://i.postimg.cc/G25sZhYw/web-3.gif" },
      { title: "Web Development Projects", image: "https://i.postimg.cc/m2F6pPM4/web-22.gif" },
      { title: "Web Development with AI", image: "https://i.postimg.cc/P5ybSH6h/web1.gif" }
    ],
    "16-18": [
      { title: "Python Basics", image: "https://i.postimg.cc/NFn77kbX/pyhton-0.gif" },
      { title: "AI with Python", image: "https://i.postimg.cc/sf78fB62/ai-python.gif" },
      { title: "Data Analysis", image: "https://i.postimg.cc/6qthpQq7/data-0.gif" },
      { title: "Machine Learning", image: "https://i.postimg.cc/wTJ0cS8T/machine.gif" }
    ],
    "19-40": [
      { title: "AI Intro and Tools", image: "https://i.postimg.cc/KzyP0Yn9/ai-tool.gif" },
      { title: "web Development with AI", image: "https://i.postimg.cc/SRSWpt1C/ai-code.gif" },
      { title: "Graphic Design  with AI", image: "https://i.postimg.cc/0yb0QFkC/ai-gaphics.gif" },
      { title: "Freelancing and Earning Money ", image: "https://i.postimg.cc/LXRPzbpw/freelance.gif" }
    ]
  };

  useEffect(() => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }

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

    
    renderCourses(activeAge);

    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ar" : "en");
    
    // Toggle active class on language icons
    const englishIcon = document.getElementById("english-icon");
    const arabicIcon = document.getElementById("arabic-icon");
    
    if (englishIcon && arabicIcon) {
      englishIcon.classList.toggle("active");
      arabicIcon.classList.toggle("active");
    }
    
    // Set RTL/LTR direction on body
    document.body.dir = language === "en" ? "rtl" : "ltr";
  };

  const handleAgeChange = (age: string) => {
    
    setActiveAge(age);
    renderCourses(age);
  };

  const togglePlans = (planType: string) => {
    
    setSelectedPlan(planType);
    
    const generalCards = document.querySelector('.general');
    const privateCards = document.querySelector('.private');
    
    if (planType === 'general') {
      if (generalCards) generalCards.classList.remove('hidden');
      if (privateCards) privateCards.classList.add('hidden');
    } else {
      if (generalCards) generalCards.classList.add('hidden');
      if (privateCards) privateCards.classList.remove('hidden');
    }
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

  const renderCourses = (ageGroup: string) => {
    
    const courseListContainer = document.getElementById('course-list');
    if (!courseListContainer || !coursesData[ageGroup as keyof typeof coursesData]) return;
    
    const coursesHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${coursesData[ageGroup as keyof typeof coursesData].map(course => `
          <div class="course-card bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="aspect-video w-full overflow-hidden">
              <img 
                src="${course.image}" 
                alt="${course.title}" 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="text-xl font-semibold">${course.title}</h3>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    courseListContainer.innerHTML = coursesHTML;
  };

  const scrollToBookingForm = (planName: string) => {
    setSelectedPricePlan(planName);
    
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ behavior: 'smooth' });
      
      
      const coursePriceSel = document.getElementById('course-Pric-sel') as HTMLSelectElement;
      if (coursePriceSel) {
        const options = Array.from(coursePriceSel.options);
        const option = options.find(opt => opt.value.includes(planName));
        if (option) {
          coursePriceSel.value = option.value;
        }
      }
    }
  };

  const toggleCourseInput = (value: boolean) => {
    setContinueCourse(value);
    const extraCourseInput = document.getElementById('extra-course-input');
    if (extraCourseInput) {
      if (value) {
        extraCourseInput.classList.add('active');
      } else {
        extraCourseInput.classList.remove('active');
      }
    }
    
    
    const yesNoButtons = document.querySelectorAll('.yes-no-buttons button');
    yesNoButtons.forEach((btn, index) => {
      if ((index === 0 && value) || (index === 1 && !value)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const age = formData.get('age') as string;
    const branch = formData.get('branch') as string;
    const plan = formData.get('course-Pric-sel') as string;

    const previousCourseButton = document.querySelector('.yes-no-buttons .active');
    const previousCourse = previousCourseButton && previousCourseButton.textContent === (language === 'en' ? 'Yes' : 'نعم');
    const course = previousCourse ? formData.get('course') as string : null;

    
    if (!name || !phone || !age || !branch || !plan) {
      toast.error(language === 'en' ? 'Please fill out all required fields.' : 'يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ 
          name, 
          age, 
          phone, 
          previous_course: previousCourse, 
          branch, 
          course, 
          plan 
        }]);

      if (error) throw error;

      toast.success(language === 'en' ? 'Booking submitted successfully!' : 'تم تقديم الحجز بنجاح!');
      
      (e.target as HTMLFormElement).reset();
      setSelectedPricePlan("");
      setContinueCourse(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error(language === 'en' ? 'There was an error submitting your booking. Please try again.' : 'حدث خطأ أثناء تقديم الحجز الخاص بك. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      <Header />
      
      <main className="flex-1">
        
        <nav className="custom-nav bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <button className="hamburger" id="hamburger">☰</button>
            
            <ul className="nav-links" id="nav-links">
              <li><a href="#home">{t.home}</a></li>
              <li><a href="#Ages">{t.ages}</a></li>
              <li><a href="#price">{t.price}</a></li>
              <li><a href="#courses">{t.courses}</a></li>
              <li><a href="#faq">{t.faq}</a></li>
              <li><a href="#contact">{t.contact}</a></li>
            </ul>

            <div className="language-toggle" id="language-toggle" onClick={toggleLanguage}>
              <img src="https://flagcdn.com/w20/gb.png" alt="English" id="english-icon" className={`language-icon ${language === 'en' ? 'active' : ''}`} />
              <img src="https://flagcdn.com/w20/sa.png" alt="Arabic" id="arabic-icon" className={`language-icon ${language === 'ar' ? 'active' : ''}`} />
            </div>
          </div>
        </nav>

        
        <section className="hero" id="home">
          <div className="hero-container mx-auto px-5 py-8">
            <div className="hero-content">
              <h1>{t.heroTitle}</h1>
              <p>{t.heroDesc}</p>
              <a href="http://wa.me/+201204262410" className="cta">{t.startLearning}</a>
            </div>
            <img 
              src="https://i.postimg.cc/VNy5F8Dk/ezgif-com-animated-gif-maker-7.gif" 
              alt="Students learning to code" 
              className="hero-image"
            />
          </div>
        </section>

        
        <section className="content" id="Ages">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-8">{t.coursesByAge}</h2>
          
          <div className="button-container grid grid-cols-2 md:grid-cols-5 gap-1">
            {Object.keys(coursesData).map(age => (
              <button 
                key={age}
                className={`button ${activeAge === age ? 'active' : ''}`} 
                data-group={age}
                onClick={() => handleAgeChange(age)}
              >
                {language === 'en' ? `Age ${age}` : `العمر ${age}`}
              </button>
            ))}
          </div>

          <div className="courses" id="course-list">
            
          </div>
        </section>

        
        <section className="content" id="courses">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">{t.courses}</h2>
          
          <div className="slider-container">
            <div className="slider" ref={sliderRef}>
              <div className="slide">
                <img src="https://i.postimg.cc/fysgZ6HW/ezgif-com-animated-gif-maker-4.gif" alt="Snake Game" />
                <div className="slide-info">
                  <div className="slide-title">Snake Game using Pictoblox</div>
                  <div className="slide-description">Advanced level of game design.</div>
                </div>
              </div>

              <div className="slide">
                <img src="https://i.postimg.cc/7Lsmj5zV/ezgif-com-animated-gif-maker-5.gif" alt="Calculator using Python" />
                <div className="slide-info">
                  <div className="slide-title">Calculator using Python</div>
                  <div className="slide-description">Python level: Introduction to AI.</div>
                </div>
              </div>

              <div className="slide">
                <img src="https://i.postimg.cc/0yX3mXNZ/ezgif-com-animated-gif-maker-2.gif" alt="Geometric Drawing Game" />
                <div className="slide-info">
                  <div className="slide-title">Geometric Drawing Game</div>
                  <div className="slide-description">Beginner level of game design.</div>
                </div>
              </div>

              <div className="slide">
                <img src="https://i.postimg.cc/G2GSWcxS/ezgif-com-animated-gif-maker-1.gif" alt="Planet Website Design" />
                <div className="slide-info">
                  <div className="slide-title">Planet Website Design</div>
                  <div className="slide-description">Second level of web design.</div>
                </div>
              </div>

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

        
        <section className="content" id="price">
          <h2 className="text-4xl font-bold text-center text-purple-900 mt-5 mb-1">{t.pricingPlans}</h2>
          <p className="text-center text-gray-700 mb-6">
            {t.pricingDesc}
          </p>

          <div className="container mx-auto px-4">
            <div className="toggle-buttons mb-6">
              <button 
                className={`general-btn ${selectedPlan === 'general' ? 'active' : ''}`} 
                onClick={() => togglePlans('general')}
              >
                {t.general}
              </button>
              <button 
                className={`private-btn ${selectedPlan === 'private' ? 'active' : ''}`} 
                onClick={() => togglePlans('private')}
              >
                {t.private}
              </button>
            </div>

            
            <div className="pricing-cards" id="pricing-cards">
              
              <div className={`active-cards private ${selectedPlan === 'private' ? 'flex' : 'hidden'}`}>
                <div className="card private-card">
                  <div className="card-title basic">{t.basic}</div>
                  <div className="price">2000 EGP {t.perMonth}</div>
                  <div className="discount">0% {t.off}</div>
                  <span className="line-through">2000.00</span>
                  <span className="text-xs">{t.oldPrice}</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;{t.pricePerMonth}</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;{t.noDiscount}</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => scrollToBookingForm("Private 2000")}>{t.bookNow}</button>
                </div>
                <div className="card private-card">
                  <div className="card-title advanced rounded-t-lg">{t.advanced}</div>
                  <div className="price">3400 EGP {t.perMonth}</div>
                  <div className="discount">15% {t.off}</div>
                  <span className="line-through">4000.00</span>
                  <span className="text-xs">{t.oldPrice}</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;2 {t.monthsPlan}</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;600 {t.discountApplied}</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => scrollToBookingForm("Private 3400")}>{t.bookNow}</button>
                </div>
                <div className="card private-card shadow-card">
                  <div className="card-title special rounded-t-lg">{t.special}</div>
                  <div className="price">7500 EGP {t.perMonth}</div>
                  <div className="discount">25% {t.off}</div>
                  <span className="line-through">10000.00</span>
                  <span className="text-xs">{t.oldPrice}</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;5 {t.monthsPlan}</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;2500 {t.discountApplied}</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => scrollToBookingForm("Private 7500")}>{t.bookNow}</button>
                </div>
              </div>

              
              <div className={`active-cards general ${selectedPlan === 'general' ? 'flex' : 'hidden'}`}>
                <div className="card general-card">
                  <div className="card-title basic rounded-t-lg">{t.basic}</div>
                  <div className="price">600 EGP {t.perMonth}</div>
                  <div className="discount">0% {t.off}</div>
                  <span className="line-through">600.00</span>
                  <span className="text-xs">{t.oldPrice}</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;{t.pricePerMonth}</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;{t.noDiscount}</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => scrollToBookingForm("General 600")}>{t.bookNow}</button>
                </div>
                <div className="card general-card">
                  <div className="card-title advanced rounded-t-lg">{t.advanced}</div>
                  <div className="price">1530 EGP {t.perMonth}</div>
                  <div className="discount">15% {t.off}</div>
                  <span className="line-through">1800.00</span>
                  <span className="text-xs">{t.oldPrice}</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;3 {t.monthsPlan}</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;270 {t.discountApplied}</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => scrollToBookingForm("General 1530")}>{t.bookNow}</button>
                </div>
                <div className="card general-card shadow-card">
                  <div className="card-title special rounded-t-lg">{t.special}</div>
                  <div className="price">2250 EGP {t.perMonth}</div>
                  <div className="discount">25% {t.off}</div>
                  <span className="line-through">3000.00</span>
                  <span className="text-xs">{t.oldPrice}</span>
                  <ul>
                    <li><span className="check">✓</span>&nbsp;&nbsp;5 {t.monthsPlan}</li>
                    <li><span className="check">✓</span>&nbsp;&nbsp;750 {t.discountApplied}</li>
                  </ul>
                  <button className="book-now-btn" onClick={() => scrollToBookingForm("General 2250")}>{t.bookNow}</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="content">
          <h1 className="text-4xl font-bold text-center text-purple-900 mb-2">{t.studentProjects}</h1>
          <p className="text-center text-gray-600 mb-8">
            {t.studentsDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
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

        
        <section className="content flex my-10 flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-purple-900 mb-6 mt-3">{t.branches}</h1>

          <div className="relative w-11/12 max-w-md h-64 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-105">
            <img id="mapImage" src="https://i.postimg.cc/4xCxsymT/loc.png" alt="Map of Egypt" className="w-full h-full object-cover" />
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <label htmlFor="locationSelect" className="text-lg font-medium text-gray-700">{t.chooseBranch}</label>
            <select 
              id="locationSelect" 
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <option value="select">{language === 'en' ? 'Select' : 'اختر'}</option>
              <option value="El minia">{language === 'en' ? 'El minia' : 'المنيا'}</option>
              <option value="new_El minia">{language === 'en' ? 'New minia' : 'المنيا الجديدة'}</option>
              <option value="smaluat">{language === 'en' ? 'Smaluat' : 'سمالوط'}</option>
              <option value="magagh">{language === 'en' ? 'Magagh' : 'مغاغة'}</option>
              <option value="bany_mazar">{language === 'en' ? 'Bani Mazar' : 'بني مزار'}</option>
              <option value="abo_gurags">{language === 'en' ? 'Abu Qurqas' : 'أبو قرقاص'}</option>
              <option value="mallya">{language === 'en' ? 'Mallawi' : 'ملوي'}</option>
              <option value="online">{language === 'en' ? 'Online' : 'اونلاين'}</option>
            </select>
          </div>
          
          <div className="mt-6 text-center text-lg font-medium text-gray-700 bg-white p-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 max-w-md w-full">
            {selectedLocation === "select" 
              ? t.selectBranch 
              : locationData[selectedLocation]}
          </div>
        </section>

        
        <section className="content" id="images">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-2">{t.students}</h2>
          
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
        
        <section className="content booking-section" id="booking" ref={bookingFormRef}>
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-8">{t.bookYourCourse}</h2>
          
          <div className="booking-form-container max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6">
            {selectedPricePlan && (
              <div className="selected-plan-banner mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md text-center">
                <p className="text-blue-800 font-medium">
                  {t.bookingFor} <span className="font-bold">{selectedPricePlan}</span> {t.plan}
                </p>
              </div>
            )}
            
            <form id="userForm" onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t.phoneNumber} *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    placeholder={language === 'en' ? "Phone number with country key" : "رقم الهاتف مع مفتاح الدولة"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required 
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t.fullName} *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder={language === 'en' ? "Your name" : "اسمك"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">{t.age} *</label>
                  <select 
                    id="age" 
                    name="age" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="7-9">7-9</option>
                    <option value="10-12">10-12</option>
                    <option value="13-15">13-15</option>
                    <option value="16-18">16-18</option>
                    <option value="19-40">19-40</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">{t.branch} *</label>
                  <select 
                    id="branch" 
                    name="branch" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">{t.selectBranchOption}</option>
                    <option value="El minia">{language === 'en' ? 'El minia' : 'المنيا'}</option>
                    <option value="new_El minia">{language === 'en' ? 'New minia' : 'المنيا الجديدة'}</option>
                    <option value="smaluat">{language === 'en' ? 'Smaluat' : 'سمالوط'}</option>
                    <option value="magagh">{language === 'en' ? 'Magagh' : 'مغاغة'}</option>
                    <option value="bany_mazar">{language === 'en' ? 'Bani Mazar' : 'بني مزار'}</option>
                    <option value="abo_gurags">{language === 'en' ? 'Abu Qurqas' : 'أبو قرقاص'}</option>
                    <option value="mallya">{language === 'en' ? 'Mallawi' : 'ملوي'}</option>
                    <option value="online">{language === 'en' ? 'Online' : 'اونلاين'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.previousCourse}</label>
                <div className="yes-no-buttons">
                  <button 
                    type="button" 
                    className={continueCourse ? "active" : ""} 
                    onClick={() => toggleCourseInput(true)}
                  >
                    {t.yes}
                  </button>
                  <button 
                    type="button" 
                    className={!continueCourse ? "active" : ""} 
                    onClick={() => toggleCourseInput(false)}
                  >
                    {t.no}
                  </button>
                </div>
              </div>

              <div id="extra-course-input" className={`${continueCourse ? 'active' : ''}`}>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">{t.previousCourseName}</label>
                <select 
                  id="course" 
                  name="course" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Start from begining">{language === 'en' ? 'Start from beginning' : 'البدء من البداية'}</option>
                  <option value="Pictoblox Basics">{language === 'en' ? 'Pictoblox Basics' : 'أساسيات بيكتوبلوكس'}</option>
                  <option value="Pictoblox Advanced">{language === 'en' ? 'Pictoblox Advanced' : 'بيكتوبلوكس متقدم'}</option>  
                  <option value="Pyhton Basics">{language === 'en' ? 'Python Basics' : 'أساسيات بايثون'}</option>
                  <option value="AI with Python">{language === 'en' ? 'AI with Python' : 'الذكاء الاصطناعي مع بايثون'}</option>
                  <option value="Machine Learning">{language === 'en' ? 'Machine Learning' : 'تعلم الآلة'}</option>
                  <option value="Arduino Level 1">{language === 'en' ? 'Arduino Level 1' : 'أردوينو المستوى 1'}</option>
                  <option value="Arduino level 2">{language === 'en' ? 'Arduino level 2' : 'أردوينو المستوى 2'}</option>
                  <option value="Arduino Projects">{language === 'en' ? 'Arduino Projects' : 'مشاريع أردوينو'}</option>
                  <option value="Web HTML">{language === 'en' ? 'Web HTML' : 'تطوير الويب HTML'}</option>
                  <option value="Web CSS">{language === 'en' ? 'Web CSS' : 'تطوير الويب CSS'}</option>
                  <option value="Web JavaScript">{language === 'en' ? 'Web JavaScript' : 'تطوير الويب JavaScript'}</option>
                  <option value="Other">{language === 'en' ? 'Other' : 'أخرى'}</option>
                </select>
              </div>

              <div>
                <label htmlFor="course-Pric-sel" className="block text-sm font-medium text-gray-700 mb-1">{t.coursePlan} *</label>
                <select 
                  id="course-Pric-sel" 
                  name="course-Pric-sel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">{t.selectPlan}</option>
                  <option value="Private 2000">{language === 'en' ? 'Private Basic - 2000 EGP/month' : 'خاص أساسي - 2000 جنيه/شهر'}</option>
                  <option value="Private 3400">{language === 'en' ? 'Private Advanced - 3400 EGP/month' : 'خاص متقدم - 3400 جنيه/شهر'}</option>
                  <option value="Private 7500">{language === 'en' ? 'Private Special - 7500 EGP/month' : 'خاص مميز - 7500 جنيه/شهر'}</option>
                  <option value="General 600">{language === 'en' ? 'General Basic - 600 EGP/month' : 'عام أساسي - 600 جنيه/شهر'}</option>
                  <option value="General 1530">{language === 'en' ? 'General Advanced - 1530 EGP/month' : 'عام متقدم - 1530 جنيه/شهر'}</option>
                  <option value="General 2250">{language === 'en' ? 'General Special - 2250 EGP/month' : 'عام مميز - 2250 جنيه/شهر'}</option>
                </select>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {t.submit}
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className="content" id="faq">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-8">{t.faq}</h2>
          <div className="faq-container max-w-4xl mx-auto">
            <div className="faq" data-color="rgba(255, 165, 0, 0.7)">
              <div 
                className="faq-header" 
                onClick={(e) => toggleFAQ(e.currentTarget)}
              >
                <div className="faq-icon" style={{background: 'orange'}}>▶</div>
                {language === 'en' ? 'What age group are your courses designed for?' : 'ما هي الفئة العمرية التي صممت دوراتك لها؟'}
              </div>
              <div className="faq-content">{language === 'en' ? 'Our courses are tailored for children aged 7-17 years...' : 'دوراتنا مصممة للأطفال الذين تتراوح أعمارهم بين 7 و 17 عامًا...'}</div>
            </div>
            
            <div className="faq" data-color="rgba(255, 99, 71, 0.7)">
              <div 
                className="faq-header" 
                onClick={(e) => toggleFAQ(e.currentTarget)}
              >
                <div className="faq-icon" style={{background: 'red'}}>▶</div>
                {language === 'en' ? 'When does the course start?' : 'متى تبدأ الدورة؟'}
              </div>
              <div className="faq-content">{language === 'en' ? 'After registration, we will contact you via WhatsApp once the group is formed.' : 'بعد التسجيل، سنتواصل معك عبر واتساب بمجرد تشكيل المجموعة.'}</div>
            </div>
            
            <div className="faq" data-color="rgba(60, 179, 113, 0.7)">
              <div 
                className="faq-header" 
                onClick={(e) => toggleFAQ(e.currentTarget)}
              >
                <div className="faq-icon" style={{background: 'darkgreen'}}>▶</div>
                {language === 'en' ? 'How are the course schedules determined?' : 'كيف يتم تحديد جداول الدورة؟'}
              </div>
              <div className="faq-content">{language === 'en' ? 'Once the group is formed, we create a WhatsApp group and discuss the most convenient schedule for everyone.' : 'بمجرد تشكيل المجموعة، ننشئ مجموعة واتساب ونناقش الجدول الزمني الأكثر ملاءمة للجميع.'}</div>
            </div>
            
            <div className="faq" data-color="rgba(218, 165, 32, 0.7)">
              <div 
                className="faq-header" 
                onClick={(e) => toggleFAQ(e.currentTarget)}
              >
                <div className="faq-icon" style={{background: 'goldenrod'}}>▶</div>
                {language === 'en' ? 'Is there a sibling discount?' : 'هل هناك خصم للأخوة؟'}
              </div>
              <div className="faq-content">{language === 'en' ? 'Yes, there is a 10% discount.' : 'نعم، هناك خصم 10٪.'}</div>
            </div>
            
            <div className="faq" data-color="rgba(70, 130, 180, 0.7)">
              <div 
                className="faq-header" 
                onClick={(e) => toggleFAQ(e.currentTarget)}
              >
                <div className="faq-icon" style={{background: 'steelblue'}}>▶</div>
                {language === 'en' ? 'How do I know which course is right for my child?' : 'كيف أعرف أي دورة مناسبة لطفلي؟'}
              </div>
              <div className="faq-content">{language === 'en' ? 'We offer a free assessment session to determine the most suitable course based on your child's interests and abilities.' : 'نقدم جلسة تقييم مجانية لتحديد الدورة الأنسب بناءً على اهتمامات طفلك وقدراته.'}</div>
            </div>
          </div>
        </section>

        {/* WhatsApp Float Button */}
        <a href="http://wa.me/+201204262410" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/767px-WhatsApp.svg.png" alt="WhatsApp" />
        </a>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
