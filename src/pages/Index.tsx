import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import "@/styles/home.css";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [activeAge, setActiveAge] = useState<string>("7-9");
  const [selectedPlan, setSelectedPlan] = useState<string>("general");
  const sliderRef = useRef<HTMLDivElement>(null);
  const studentsSliderRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("select");
  const [continueCourse, setContinueCourse] = useState<boolean>(false);
  const [selectedPricePlan, setSelectedPricePlan] = useState<string>("");
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  
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
      submit: "Submit Booking",
      faqTitle: "Frequently Asked Questions",
      faqDesc: "Find answers to common questions about our courses and programs.",
      contactTitle: "Contact Us",
      contactDesc: "Have questions? Reach out to us through any of these channels.",
      address: "Address",
      phone: "Phone",
      email: "Email",
      followUs: "Follow Us",
      faq1Title: "What age groups do you teach?",
      faq1Answer: "We offer courses for children aged 7 to 18, as well as specialized programs for adults aged 19-40.",
      faq2Title: "How long are the courses?",
      faq2Answer: "Our courses typically run for 1 to 5 months, depending on the level and program you select.",
      faq3Title: "Do I need to have prior programming experience?",
      faq3Answer: "No, we offer courses for complete beginners as well as more advanced students.",
      faq4Title: "What equipment do I need for online courses?",
      faq4Answer: "You'll need a computer with internet connection and a webcam. Specific software requirements will be provided before the course starts.",
      faq5Title: "Are there any discounts available?",
      faq5Answer: "Yes, we offer discounts for multi-month commitments. The longer the commitment, the higher the discount.",
      project1Title: "AI & Data Analysis",
      project1Student: "Joyce",
      project1Age: "15 years old",
      project1Desc: "AI project focused on data analysis, big data algorithms, and machine learning models to solve real-world problems.",
      project2Title: "Engineering Design",
      project2Student: "Mariam",
      project2Age: "10 years old",
      project2Desc: "Car design and simulation using 3D modeling, aerodynamics analysis, and competing against professional engineers.",
      project3Title: "Advanced Arduino",
      project3Student: "Yustus",
      project3Age: "11 years old",
      project3Desc: "Electronics and microcontrollers, smart home automation, and building an electronic cane for the visually impaired."
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
      submit: "تقديم الحجز",
      faqTitle: "الأسئلة الشائعة",
      faqDesc: "اعثر على إجابات للأسئلة الشائعة حول دوراتنا وبرامجنا.",
      contactTitle: "اتصل بنا",
      contactDesc: "لديك أسئلة؟ تواصل معنا من خلال أي من هذه القنوات.",
      address: "العنوان",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      followUs: "تابعنا",
      faq1Title: "ما هي الفئات العمرية التي تقومون بتدريسها؟",
      faq1Answer: "نقدم دورات للأطفال من سن 7 إلى 18 عامًا، بالإضافة إلى برامج متخصصة للبالغين من سن 19-40.",
      faq2Title: "كم هي مدة الدورات؟",
      faq2Answer: "تستمر دوراتنا عادة من شهر إلى 5 أشهر، اعتمادًا على المستوى والبرنامج الذي تختاره.",
      faq3Title: "هل أحتاج إلى خبرة برمجية مسبقة؟",
      faq3Answer: "لا، نحن نقدم دورات للمبتدئين تمامًا وكذلك للطلاب الأكثر تقدمًا.",
      faq4Title: "ما هي المعدات التي أحتاجها للدورات عبر الإنترنت؟",
      faq4Answer: "ستحتاج إلى جهاز كمبيوتر متصل بالإنترنت وكاميرا ويب. سيتم توفير متطلبات البرامج المحددة قبل بدء الدورة.",
      faq5Title: "هل هناك أي خصومات متاحة؟",
      faq5Answer: "نعم، نقدم خصومات للالتزامات متعددة الأشهر. كلما طال الالتزام، زاد الخصم.",
      project1Title: "الذكاء الاصطناعي وتحليل البيانات",
      project1Student: "جويس",
      project1Age: "15 سنة",
      project1Desc: "مشروع ذكاء اصطناعي يركز على تحليل البيانات وخوارزميات البيانات الضخمة ونماذج التعلم الآلي لحل مشكلات العالم الحقيقي.",
      project2Title: "التصميم الهندسي",
      project2Student: "مريم",
      project2Age: "10 سنوات",
      project2Desc: "تصميم السيارات والمحاكاة باستخدام النمذجة ثلاثية الأبعاد، وتحليل الديناميكا الهوائية، والمنافسة ضد المهندسين المحترفين.",
      project3Title: "الأردوينو المتقدم",
      project3Student: "يوستوس",
      project3Age: "11 سنة",
      project3Desc: "الإلكترونيات والمتحكمات الدقيقة، وأتمتة المنزل الذكي، وبناء عصا إلكترونية للمعاقين بصرياً."
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
    document.body.dir = language === "ar" ? "rtl" : "ltr";
    
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
  }, [activeAge, language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ar" : "en");
    
    const englishIcon = document.getElementById("english-icon");
    const arabicIcon = document.getElementById("arabic-icon");
    
    if (englishIcon && arabicIcon) {
      englishIcon.classList.toggle("active");
      arabicIcon.classList.toggle("active");
    }
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

  const toggleFAQ = (index: number) => {
    const faqs = document.querySelectorAll('.faq');
    faqs.forEach((faq, i) => {
      if (i === index) {
        faq.classList.toggle('active');
        const icon = faq.querySelector('.faq-icon') as HTMLElement;
        if (icon) {
          icon.textContent = faq.classList.contains('active') ? '▼' : '▶';
        }
      } else {
        faq.classList.remove('active');
        const icon = faq.querySelector('.faq-icon') as HTMLElement;
        if (icon) {
          icon.textContent = '▶';
        }
      }
    });
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
        <nav className="custom-nav bg-white shadow-md py-4 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-academy-blue">
              Academy
            </Link>
            
            <div className="flex items-center space-x-4">
              <ul className="nav-links hidden md:flex items-center space-x-6" id="nav-links">
                <li><a href="#home">{t.home}</a></li>
                <li><a href="#Ages">{t.ages}</a></li>
                <li><a href="#price">{t.price}</a></li>
                <li><a href="#courses">{t.courses}</a></li>
                <li><a href="#faq">{t.faq}</a></li>
                <li><a href="#contact">{t.contact}</a></li>
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
              <li><a href="#home">{t.home}</a></li>
              <li><a href="#Ages">{t.ages}</a></li>
              <li><a href="#price">{t.price}</a></li>
              <li><a href="#courses">{t.courses}</a></li>
              <li><a href="#faq">{t.faq}</a></li>
              <li><a href="#contact">{t.contact}</a></li>
            </ul>
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
            {/* Content dynamically generated by renderCourses */}
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
