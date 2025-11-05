import { AgeGroup, LivingSituation } from '../types';
import { getCityData } from './cityData';
import { getCurrencySymbol } from './currencyData';

export interface CareerSuggestion {
  field: string;
  averageSalary: number;
  growthRate: string;
  description: string;
  requirements: string;
  timeToTransition: string;
  emoji: string;
}

const baseCareers: CareerSuggestion[] = [
  {
    field: "Software Engineering",
    averageSalary: 120000,
    growthRate: "22%",
    description: "Build apps, websites, and software systems",
    requirements: "Coding bootcamp or CS degree",
    timeToTransition: "6-18 months",
    emoji: "💻"
  },
  {
    field: "Data Science",
    averageSalary: 115000,
    growthRate: "35%",
    description: "Analyze data to drive business decisions",
    requirements: "Statistics/Math background + Python/R",
    timeToTransition: "8-12 months",
    emoji: "📊"
  },
  {
    field: "Cloud Architecture",
    averageSalary: 140000,
    growthRate: "28%",
    description: "Design and manage cloud infrastructure",
    requirements: "AWS/Azure certifications",
    timeToTransition: "6-12 months",
    emoji: "☁️"
  },
  {
    field: "Cybersecurity",
    averageSalary: 110000,
    growthRate: "31%",
    description: "Protect organizations from digital threats",
    requirements: "Security certifications (CISSP, CEH)",
    timeToTransition: "6-18 months",
    emoji: "🔒"
  },
  {
    field: "Product Management",
    averageSalary: 125000,
    growthRate: "19%",
    description: "Guide product strategy and development",
    requirements: "Business experience + tech knowledge",
    timeToTransition: "3-12 months",
    emoji: "🚀"
  },
  {
    field: "Digital Marketing",
    averageSalary: 85000,
    growthRate: "25%",
    description: "Drive online growth and customer acquisition",
    requirements: "Google/Facebook certifications",
    timeToTransition: "3-6 months",
    emoji: "📱"
  },
  {
    field: "UX/UI Design",
    averageSalary: 95000,
    growthRate: "24%",
    description: "Design user-friendly digital experiences",
    requirements: "Design portfolio + tools (Figma, Adobe)",
    timeToTransition: "6-12 months",
    emoji: "🎨"
  },
  {
    field: "Financial Planning",
    averageSalary: 90000,
    growthRate: "15%",
    description: "Help clients manage wealth and investments",
    requirements: "CFP certification + licenses",
    timeToTransition: "12-24 months",
    emoji: "💰"
  },
  {
    field: "Healthcare Technology",
    averageSalary: 105000,
    growthRate: "32%",
    description: "Improve healthcare through technology",
    requirements: "Healthcare + tech background",
    timeToTransition: "12-18 months",
    emoji: "🏥"
  },
  {
    field: "Renewable Energy",
    averageSalary: 95000,
    growthRate: "52%",
    description: "Build sustainable energy solutions",
    requirements: "Engineering or environmental science",
    timeToTransition: "12-24 months",
    emoji: "🌱"
  },
  {
    field: "AI/Machine Learning Engineer",
    averageSalary: 150000,
    growthRate: "40%",
    description: "Build intelligent systems and AI applications",
    requirements: "Python, ML frameworks, statistics background",
    timeToTransition: "8-18 months",
    emoji: "🤖"
  },
  {
    field: "AI Product Manager",
    averageSalary: 135000,
    growthRate: "35%",
    description: "Guide AI product strategy and development",
    requirements: "Business experience + AI/ML knowledge",
    timeToTransition: "6-12 months",
    emoji: "🧠"
  }
];

const skilledTradesCareers: CareerSuggestion[] = [
  {
    field: "Electrician",
    averageSalary: 85000,
    growthRate: "8%",
    description: "Install, maintain, and repair electrical systems in homes and businesses",
    requirements: "Trade school or apprenticeship program",
    timeToTransition: "6-24 months",
    emoji: "⚡"
  },
  {
    field: "Plumber",
    averageSalary: 78000,
    growthRate: "15%",
    description: "Install and repair water, gas, and drainage systems",
    requirements: "Trade school or apprenticeship program",
    timeToTransition: "6-24 months",
    emoji: "🔧"
  },
  {
    field: "HVAC Technician",
    averageSalary: 72000,
    growthRate: "13%",
    description: "Install and maintain heating, ventilation, and air conditioning systems",
    requirements: "HVAC certification program",
    timeToTransition: "6-18 months",
    emoji: "🌡️"
  },
  {
    field: "Home Inspector",
    averageSalary: 68000,
    growthRate: "5%",
    description: "Examine properties for safety, structural, and system issues",
    requirements: "Home inspection certification",
    timeToTransition: "3-6 months",
    emoji: "🏠"
  },
  {
    field: "Carpenter",
    averageSalary: 65000,
    growthRate: "8%",
    description: "Build, install, and repair structures and fixtures made of wood",
    requirements: "Trade school or apprenticeship",
    timeToTransition: "6-18 months",
    emoji: "🔨"
  },
  {
    field: "Welder",
    averageSalary: 70000,
    growthRate: "8%",
    description: "Join metal parts using specialized welding equipment",
    requirements: "Welding certification program",
    timeToTransition: "3-12 months",
    emoji: "🔥"
  },
  {
    field: "Automotive Technician",
    averageSalary: 58000,
    growthRate: "4%",
    description: "Diagnose and repair vehicle mechanical and electrical systems",
    requirements: "Automotive technology program",
    timeToTransition: "6-18 months",
    emoji: "🚗"
  },
  {
    field: "Solar Panel Installer",
    averageSalary: 75000,
    growthRate: "63%",
    description: "Install and maintain solar energy systems on rooftops and ground mounts",
    requirements: "Solar installation certification",
    timeToTransition: "3-9 months",
    emoji: "☀️"
  },
  {
    field: "Elevator Technician",
    averageSalary: 95000,
    growthRate: "7%",
    description: "Install, maintain, and repair elevators, escalators, and moving walkways",
    requirements: "Elevator technician apprenticeship",
    timeToTransition: "12-48 months",
    emoji: "🏢"
  },
  {
    field: "Dental Hygienist",
    averageSalary: 82000,
    growthRate: "11%",
    description: "Clean teeth, examine patients for oral diseases, and provide preventive care",
    requirements: "Associate degree in dental hygiene",
    timeToTransition: "24-36 months",
    emoji: "🦷"
  }
];

export function getCareerSuggestions(
  currentSalary: number,
  age: AgeGroup,
  demographic: LivingSituation,
  city?: string,
  currency: string = 'USD'
): CareerSuggestion[] {
  const cityData = getCityData(city || '');
  const cityMultiplier = cityData?.multiplier || 1.0;
  const currencySymbol = getCurrencySymbol(currency);

  // Adjust salaries based on location
  const adjustedCareers = baseCareers.map(career => ({
    ...career,
    averageSalary: Math.round(career.averageSalary * cityMultiplier)
  }));

  // Filter careers that offer significant salary improvement (at least 20% increase)
  const improvementThreshold = currentSalary * 1.2;
  let relevantCareers = adjustedCareers.filter(career =>
    career.averageSalary > improvementThreshold
  );

  // If no careers meet the threshold, show top 3 highest paying
  if (relevantCareers.length === 0) {
    relevantCareers = adjustedCareers
      .sort((a, b) => b.averageSalary - a.averageSalary)
      .slice(0, 3);
  }

  // Age-based filtering and prioritization
  switch (age) {
    case "18-25":
      // Young adults - prioritize high growth, tech fields
      relevantCareers = relevantCareers
        .sort((a, b) => parseFloat(b.growthRate) - parseFloat(a.growthRate))
        .slice(0, 4);
      break;
    case "26-35":
      // Early career - balance growth and stability
      relevantCareers = relevantCareers
        .sort((a, b) => b.averageSalary - a.averageSalary)
        .slice(0, 4);
      break;
    case "36-45":
      // Mid career - focus on leadership and specialization
      const midCareerFiltered = relevantCareers
        .filter(career =>
          career.field.includes('Management') ||
          career.field.includes('Architecture') ||
          career.averageSalary > 100000
        );
      relevantCareers = midCareerFiltered.length > 0
        ? midCareerFiltered.slice(0, 3)
        : relevantCareers.sort((a, b) => b.averageSalary - a.averageSalary).slice(0, 3);
      break;
    case "46-55":
      // Pre-retirement - consulting and expertise roles
      const preRetirementFiltered = relevantCareers
        .filter(career =>
          career.field.includes('Financial') ||
          career.field.includes('Consulting') ||
          career.timeToTransition.includes('3-6') ||
          career.timeToTransition.includes('6-12')
        );
      relevantCareers = preRetirementFiltered.length > 0
        ? preRetirementFiltered.slice(0, 3)
        : relevantCareers.sort((a, b) => b.averageSalary - a.averageSalary).slice(0, 3);
      break;
    case "56+":
      // Near retirement - part-time, consulting, passion projects
      const retirementFiltered = relevantCareers
        .filter(career =>
          career.timeToTransition.includes('3-6') ||
          career.field.includes('Financial') ||
          career.field.includes('Digital Marketing')
        );
      relevantCareers = retirementFiltered.length > 0
        ? retirementFiltered.slice(0, 2)
        : relevantCareers.sort((a, b) => b.averageSalary - a.averageSalary).slice(0, 2);
      break;
  }

  // Demographic adjustments
  if (demographic === 'family') {
    // Families need stable, well-paying careers
    const familyFiltered = relevantCareers.filter(career => career.averageSalary > 90000);
    relevantCareers = familyFiltered.length > 0
      ? familyFiltered.slice(0, 3)
      : relevantCareers.slice(0, 3);
  } else if (demographic === 'student') {
    // Students can take more time to transition
    relevantCareers = relevantCareers
      .sort((a, b) => parseFloat(b.growthRate) - parseFloat(a.growthRate))
      .slice(0, 4);
  }

  // Ensure we always return at least 2 suggestions
  const finalSuggestions = relevantCareers.slice(0, 4);
  if (finalSuggestions.length === 0) {
    return adjustedCareers
      .sort((a, b) => b.averageSalary - a.averageSalary)
      .slice(0, 3);
  }

  return finalSuggestions;
}

export function getCareerAdvice(
  currentAnnualSalary: number,
  age: AgeGroup,
  city?: string
): string {
  const cityData = getCityData(city || '');
  const isExpensiveCity = (cityData?.multiplier || 1.0) > 1.2;
  
  const advice = [
    `💡 Your current income could be boosted by transitioning to high-growth fields!`,
    `🚀 The job market is hot for tech and specialized skills right now.`,
    `📈 Consider online certifications - they're often faster than traditional degrees.`,
    `💰 Remote work opens up higher-paying opportunities regardless of location.`
  ];

  if (isExpensiveCity) {
    advice.push(`🏙️ Living in ${cityData?.name} means higher salaries are available locally!`);
  }

  switch (age) {
    case "18-25":
      advice.push(`⚡ Your age is perfect for career pivots - employers love young talent in tech!`);
      break;
    case "26-35":
      advice.push(`🎯 This is prime time for career advancement - your experience + new skills = 💰`);
      break;
    case "36-45":
      advice.push(`👑 Your experience is valuable - consider leadership roles in growing fields!`);
      break;
    case "46-55":
      advice.push(`🧠 Your expertise can command premium rates in consulting and specialized roles!`);
      break;
    case "56+":
      advice.push(`💎 Consider part-time or consulting work in your area of expertise!`);
      break;
  }

  return advice[Math.floor(Math.random() * advice.length)];
}

export interface Course {
  title: string;
  provider: string;
  price: number;
  duration: string;
  rating: number;
  students: string;
  description: string;
  skills: string[];
  certificationType: string;
  url: string;
  emoji: string;
  discount?: {
    originalPrice: number;
    discountPercent: number;
  };
}

const courseCatalog: Record<string, Course[]> = {
  "Software Engineering": [
    {
      title: "Complete Web Development Bootcamp",
      provider: "Udemy",
      price: 89.99,
      duration: "65 hours",
      rating: 4.7,
      students: "850K+",
      description: "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB",
      skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
      emoji: "💻",
      discount: { originalPrice: 199.99, discountPercent: 55 }
    },
    {
      title: "CS50's Introduction to Computer Science",
      provider: "Harvard (edX)",
      price: 0,
      duration: "12 weeks",
      rating: 4.8,
      students: "4M+",
      description: "Harvard's legendary computer science course, completely free",
      skills: ["C", "Python", "SQL", "JavaScript", "CSS", "HTML"],
      certificationType: "Verified Certificate ($199 optional)",
      url: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
      emoji: "🎓"
    },
    {
      title: "Full Stack JavaScript Developer",
      provider: "Codecademy Pro",
      price: 39.99,
      duration: "6 months",
      rating: 4.6,
      students: "500K+",
      description: "Build full-stack applications with JavaScript, React, and Express",
      skills: ["JavaScript", "React", "Express", "SQL", "Git"],
      certificationType: "Professional Certificate",
      url: "https://www.codecademy.com/learn/paths/full-stack-engineer-career-path",
      emoji: "⚡"
    }
  ],
  "Data Science": [
    {
      title: "Python for Data Science and Machine Learning",
      provider: "Udemy",
      price: 94.99,
      duration: "25 hours",
      rating: 4.6,
      students: "500K+",
      description: "Master Python, Pandas, NumPy, Matplotlib, Seaborn, and Scikit-Learn",
      skills: ["Python", "Pandas", "NumPy", "Machine Learning", "Data Visualization"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/",
      emoji: "📊",
      discount: { originalPrice: 199.99, discountPercent: 53 }
    },
    {
      title: "Google Data Analytics Certificate",
      provider: "Google (Coursera)",
      price: 49,
      duration: "6 months",
      rating: 4.5,
      students: "1M+",
      description: "Job-ready skills in data analytics with Google's professional certificate",
      skills: ["SQL", "Tableau", "R", "Data Cleaning", "Data Visualization"],
      certificationType: "Google Career Certificate",
      url: "https://www.coursera.org/professional-certificates/google-data-analytics",
      emoji: "📈"
    },
    {
      title: "IBM Data Science Professional Certificate",
      provider: "IBM (Coursera)",
      price: 49,
      duration: "11 months",
      rating: 4.6,
      students: "400K+",
      description: "Complete data science program from IBM with hands-on projects",
      skills: ["Python", "SQL", "Machine Learning", "Data Visualization", "Statistics"],
      certificationType: "IBM Professional Certificate",
      url: "https://www.coursera.org/professional-certificates/ibm-data-science",
      emoji: "🔬"
    }
  ],
  "AI/Machine Learning Engineer": [
    {
      title: "Machine Learning Specialization",
      provider: "Stanford University (Coursera)",
      price: 49,
      duration: "3 months",
      rating: 4.9,
      students: "4.8M+",
      description: "Andrew Ng's legendary ML course - the gold standard for AI education",
      skills: ["Python", "TensorFlow", "Neural Networks", "Deep Learning", "Computer Vision"],
      certificationType: "Stanford University Certificate",
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
      emoji: "🤖"
    },
    {
      title: "Deep Learning Specialization",
      provider: "DeepLearning.AI (Coursera)",
      price: 49,
      duration: "5 months",
      rating: 4.8,
      students: "1M+",
      description: "Master deep learning with hands-on projects in computer vision and NLP",
      skills: ["Deep Learning", "CNN", "RNN", "TensorFlow", "PyTorch"],
      certificationType: "DeepLearning.AI Certificate",
      url: "https://www.coursera.org/specializations/deep-learning",
      emoji: "🧠"
    },
    {
      title: "Complete AI & Machine Learning Bootcamp",
      provider: "Udemy",
      price: 94.99,
      duration: "44 hours",
      rating: 4.6,
      students: "300K+",
      description: "Comprehensive AI course covering ML, deep learning, and real-world projects",
      skills: ["Python", "Scikit-Learn", "TensorFlow", "Keras", "OpenCV"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/complete-machine-learning-and-data-science-bootcamp-to-mastery/",
      emoji: "🚀",
      discount: { originalPrice: 199.99, discountPercent: 53 }
    },
    {
      title: "AI for Everyone",
      provider: "DeepLearning.AI (Coursera)",
      price: 0,
      duration: "4 weeks",
      rating: 4.8,
      students: "500K+",
      description: "Free introduction to AI concepts - perfect for beginners and managers",
      skills: ["AI Strategy", "Machine Learning Basics", "AI Applications", "Ethics"],
      certificationType: "Free Certificate",
      url: "https://www.coursera.org/learn/ai-for-everyone",
      emoji: "🎓"
    }
  ],
  "AI Product Manager": [
    {
      title: "AI Product Management Specialization",
      provider: "Duke University (Coursera)",
      price: 49,
      duration: "4 months",
      rating: 4.7,
      students: "50K+",
      description: "Learn to manage AI products from strategy to deployment",
      skills: ["AI Strategy", "Product Management", "Data Science", "Ethics", "Business"],
      certificationType: "Duke University Certificate",
      url: "https://www.coursera.org/specializations/ai-product-management-duke",
      emoji: "🧠"
    },
    {
      title: "AI for Product Managers",
      provider: "Udemy",
      price: 79.99,
      duration: "8 hours",
      rating: 4.5,
      students: "25K+",
      description: "Practical AI knowledge for product managers and business leaders",
      skills: ["AI Applications", "Product Strategy", "Team Management", "ROI Analysis"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/ai-for-product-managers/",
      emoji: "📊",
      discount: { originalPrice: 149.99, discountPercent: 47 }
    },
    {
      title: "Introduction to Generative AI",
      provider: "Google Cloud (Coursera)",
      price: 0,
      duration: "1 hour",
      rating: 4.6,
      students: "200K+",
      description: "Free introduction to generative AI and large language models",
      skills: ["Generative AI", "LLMs", "ChatGPT", "AI Applications", "Prompt Engineering"],
      certificationType: "Google Cloud Certificate",
      url: "https://www.coursera.org/learn/introduction-generative-ai",
      emoji: "✨"
    }
  ],
  "Cloud Architecture": [
    {
      title: "AWS Certified Solutions Architect",
      provider: "A Cloud Guru",
      price: 39,
      duration: "40 hours",
      rating: 4.7,
      students: "300K+",
      description: "Master AWS cloud architecture and pass the certification exam",
      skills: ["AWS", "Cloud Architecture", "EC2", "S3", "VPC", "IAM"],
      certificationType: "AWS Certification Prep",
      url: "https://acloudguru.com/course/aws-certified-solutions-architect-associate-saa-c03",
      emoji: "☁️"
    },
    {
      title: "Microsoft Azure Fundamentals",
      provider: "Microsoft Learn",
      price: 0,
      duration: "12 hours",
      rating: 4.5,
      students: "2M+",
      description: "Free comprehensive Azure training from Microsoft",
      skills: ["Azure", "Cloud Computing", "Virtual Machines", "Storage", "Networking"],
      certificationType: "Microsoft Certification",
      url: "https://docs.microsoft.com/en-us/learn/paths/azure-fundamentals/",
      emoji: "🌐"
    }
  ],
  "Cybersecurity": [
    {
      title: "Complete Ethical Hacking Course",
      provider: "Udemy",
      price: 89.99,
      duration: "15 hours",
      rating: 4.5,
      students: "200K+",
      description: "Learn penetration testing and ethical hacking techniques",
      skills: ["Penetration Testing", "Network Security", "Linux", "Python", "Kali Linux"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/",
      emoji: "🔒",
      discount: { originalPrice: 199.99, discountPercent: 55 }
    },
    {
      title: "Google Cybersecurity Certificate",
      provider: "Google (Coursera)",
      price: 49,
      duration: "6 months",
      rating: 4.7,
      students: "500K+",
      description: "Job-ready cybersecurity skills with Google's professional program",
      skills: ["Network Security", "Incident Response", "Python", "Linux", "SIEM"],
      certificationType: "Google Career Certificate",
      url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
      emoji: "🛡️"
    }
  ],
  "Product Management": [
    {
      title: "Product Management Fundamentals",
      provider: "Udemy",
      price: 79.99,
      duration: "12 hours",
      rating: 4.4,
      students: "100K+",
      description: "Learn product strategy, roadmapping, and stakeholder management",
      skills: ["Product Strategy", "Roadmapping", "User Research", "Analytics", "Agile"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/",
      emoji: "🚀",
      discount: { originalPrice: 149.99, discountPercent: 47 }
    },
    {
      title: "Google Project Management Certificate",
      provider: "Google (Coursera)",
      price: 49,
      duration: "6 months",
      rating: 4.6,
      students: "800K+",
      description: "Master project management with Google's professional certificate",
      skills: ["Project Planning", "Risk Management", "Agile", "Scrum", "Leadership"],
      certificationType: "Google Career Certificate",
      url: "https://www.coursera.org/professional-certificates/google-project-management",
      emoji: "📋"
    }
  ],
  "Digital Marketing": [
    {
      title: "Digital Marketing Specialization",
      provider: "University of Illinois (Coursera)",
      price: 49,
      duration: "8 months",
      rating: 4.6,
      students: "200K+",
      description: "Complete digital marketing program from a top university",
      skills: ["SEO", "SEM", "Social Media", "Analytics", "Content Marketing"],
      certificationType: "University Certificate",
      url: "https://www.coursera.org/specializations/digital-marketing",
      emoji: "📱"
    },
    {
      title: "Google Digital Marketing & E-commerce",
      provider: "Google (Coursera)",
      price: 49,
      duration: "6 months",
      rating: 4.5,
      students: "600K+",
      description: "Job-ready digital marketing skills with Google certification",
      skills: ["Google Ads", "Facebook Ads", "Email Marketing", "Analytics", "E-commerce"],
      certificationType: "Google Career Certificate",
      url: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce",
      emoji: "🎯"
    }
  ],
  "UX/UI Design": [
    {
      title: "Google UX Design Certificate",
      provider: "Google (Coursera)",
      price: 49,
      duration: "6 months",
      rating: 4.7,
      students: "700K+",
      description: "Complete UX design program from Google with portfolio projects",
      skills: ["User Research", "Wireframing", "Prototyping", "Figma", "Usability Testing"],
      certificationType: "Google Career Certificate",
      url: "https://www.coursera.org/professional-certificates/google-ux-design",
      emoji: "🎨"
    },
    {
      title: "UI/UX Design Specialization",
      provider: "CalArts (Coursera)",
      price: 49,
      duration: "6 months",
      rating: 4.5,
      students: "150K+",
      description: "Learn visual design and user experience from California Institute of the Arts",
      skills: ["Visual Design", "User Interface", "Adobe Creative Suite", "Design Thinking"],
      certificationType: "University Certificate",
      url: "https://www.coursera.org/specializations/ui-ux-design",
      emoji: "✨"
    }
  ],
  "Electrician": [
    {
      title: "Electrical Fundamentals and Safety",
      provider: "Penn Foster Career School",
      price: 1299,
      duration: "4 months",
      rating: 4.5,
      students: "25K+",
      description: "Complete electrical training program with hands-on labs",
      skills: ["Electrical Theory", "Wiring", "Safety Codes", "Circuit Analysis", "Motor Controls"],
      certificationType: "Career Diploma",
      url: "https://www.pennfoster.edu/programs/trades/electrician-training",
      emoji: "⚡"
    },
    {
      title: "Electrical Code and Safety Training",
      provider: "Mike Holt Enterprises",
      price: 299,
      duration: "40 hours",
      rating: 4.7,
      students: "100K+",
      description: "National Electrical Code training for certification prep",
      skills: ["NEC Code", "Electrical Safety", "Grounding", "Branch Circuits", "Motors"],
      certificationType: "Certificate of Completion",
      url: "https://www.mikeholt.com/",
      emoji: "📋"
    }
  ],
  "Plumber": [
    {
      title: "Plumbing Fundamentals Course",
      provider: "Penn Foster Career School",
      price: 1199,
      duration: "4 months",
      rating: 4.4,
      students: "20K+",
      description: "Comprehensive plumbing training with practical applications",
      skills: ["Pipe Installation", "Water Systems", "Drainage", "Fixtures", "Codes"],
      certificationType: "Career Diploma",
      url: "https://www.pennfoster.edu/programs/trades/plumbing",
      emoji: "🔧"
    },
    {
      title: "Plumbing Basics and Repair",
      provider: "Udemy",
      price: 79.99,
      duration: "8 hours",
      rating: 4.3,
      students: "15K+",
      description: "Learn basic plumbing repairs and installations",
      skills: ["Pipe Repair", "Fixture Installation", "Leak Detection", "Tools", "Safety"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/plumbing-course/",
      emoji: "🛠️",
      discount: { originalPrice: 149.99, discountPercent: 47 }
    }
  ],
  "HVAC Technician": [
    {
      title: "HVAC Training Program",
      provider: "Penn Foster Career School",
      price: 1399,
      duration: "5 months",
      rating: 4.6,
      students: "30K+",
      description: "Complete HVAC training with EPA certification prep",
      skills: ["Heating Systems", "Air Conditioning", "Refrigeration", "EPA Certification", "Electrical"],
      certificationType: "Career Diploma + EPA Prep",
      url: "https://www.pennfoster.edu/programs/trades/hvac-technician",
      emoji: "🌡️"
    },
    {
      title: "HVAC Fundamentals",
      provider: "Udemy",
      price: 89.99,
      duration: "12 hours",
      rating: 4.4,
      students: "25K+",
      description: "Learn HVAC basics, troubleshooting, and maintenance",
      skills: ["System Basics", "Troubleshooting", "Maintenance", "Tools", "Safety"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/hvac-fundamentals/",
      emoji: "❄️",
      discount: { originalPrice: 179.99, discountPercent: 50 }
    }
  ],
  "Home Inspector": [
    {
      title: "Certified Home Inspector Course",
      provider: "InterNACHI",
      price: 299,
      duration: "40 hours",
      rating: 4.8,
      students: "50K+",
      description: "Complete home inspection training with certification",
      skills: ["Structural Inspection", "Electrical Systems", "Plumbing", "HVAC", "Report Writing"],
      certificationType: "InterNACHI Certification",
      url: "https://www.nachi.org/education.htm",
      emoji: "🏠"
    },
    {
      title: "Home Inspection Business Course",
      provider: "AHIT (American Home Inspectors Training)",
      price: 695,
      duration: "80 hours",
      rating: 4.7,
      students: "40K+",
      description: "Complete training plus business setup guidance",
      skills: ["Home Inspection", "Business Setup", "Marketing", "Legal Requirements", "Software"],
      certificationType: "AHIT Certificate",
      url: "https://www.ahit.com/",
      emoji: "🏡"
    }
  ],
  "Welder": [
    {
      title: "Welding Fundamentals Course",
      provider: "Penn Foster Career School",
      price: 999,
      duration: "4 months",
      rating: 4.5,
      students: "35K+",
      description: "Complete welding training with multiple welding processes",
      skills: ["MIG Welding", "TIG Welding", "Stick Welding", "Blueprint Reading", "Safety"],
      certificationType: "Career Diploma",
      url: "https://www.pennfoster.edu/programs/trades/welding",
      emoji: "🔥"
    },
    {
      title: "AWS Welding Certification Prep",
      provider: "Udemy",
      price: 94.99,
      duration: "10 hours",
      rating: 4.6,
      students: "20K+",
      description: "Prepare for AWS welding certification exams",
      skills: ["Welding Theory", "AWS Standards", "Testing Prep", "Quality Control", "Codes"],
      certificationType: "AWS Certification Prep",
      url: "https://www.udemy.com/course/aws-welding-certification/",
      emoji: "🏆",
      discount: { originalPrice: 189.99, discountPercent: 50 }
    }
  ],
  "Solar Panel Installer": [
    {
      title: "Solar Installation Professional Course",
      provider: "Solar Energy International (SEI)",
      price: 1995,
      duration: "5 days",
      rating: 4.9,
      students: "15K+",
      description: "Hands-on solar installation training with NABCEP prep",
      skills: ["Solar Design", "Installation", "Electrical", "Safety", "NABCEP Prep"],
      certificationType: "SEI Certificate + NABCEP Prep",
      url: "https://www.solarenergy.org/",
      emoji: "☀️"
    },
    {
      title: "Solar Energy Basics",
      provider: "Udemy",
      price: 69.99,
      duration: "6 hours",
      rating: 4.4,
      students: "12K+",
      description: "Introduction to solar energy systems and installation",
      skills: ["Solar Basics", "System Components", "Installation Overview", "Maintenance", "Business"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/solar-energy-course/",
      emoji: "🌞",
      discount: { originalPrice: 129.99, discountPercent: 46 }
    }
  ],
  "Carpenter": [
    {
      title: "Carpentry Fundamentals",
      provider: "Penn Foster Career School",
      price: 1099,
      duration: "4 months",
      rating: 4.4,
      students: "18K+",
      description: "Complete carpentry training from basics to advanced techniques",
      skills: ["Framing", "Finishing", "Blueprint Reading", "Tools", "Safety"],
      certificationType: "Career Diploma",
      url: "https://www.pennfoster.edu/programs/trades/carpentry",
      emoji: "🔨"
    },
    {
      title: "Woodworking and Carpentry Masterclass",
      provider: "Udemy",
      price: 84.99,
      duration: "15 hours",
      rating: 4.5,
      students: "30K+",
      description: "Learn carpentry skills from beginner to advanced",
      skills: ["Wood Selection", "Joinery", "Finishing", "Project Planning", "Tool Usage"],
      certificationType: "Certificate of Completion",
      url: "https://www.udemy.com/course/woodworking-carpentry/",
      emoji: "🪵",
      discount: { originalPrice: 159.99, discountPercent: 47 }
    }
  ],
  "Dental Hygienist": [
    {
      title: "Dental Hygiene Prep Course",
      provider: "Kaplan Test Prep",
      price: 399,
      duration: "3 months",
      rating: 4.3,
      students: "8K+",
      description: "Prepare for dental hygiene school and certification",
      skills: ["Anatomy", "Dental Procedures", "Patient Care", "Radiology", "Pharmacology"],
      certificationType: "Test Prep Certificate",
      url: "https://www.kaptest.com/dental-hygiene",
      emoji: "🦷"
    },
    {
      title: "Dental Assistant to Hygienist Bridge",
      provider: "Penn Foster Career School",
      price: 1599,
      duration: "8 months",
      rating: 4.2,
      students: "5K+",
      description: "Bridge program for dental assistants becoming hygienists",
      skills: ["Advanced Procedures", "Periodontics", "Local Anesthesia", "Nitrous Oxide", "Restorative"],
      certificationType: "Bridge Program Certificate",
      url: "https://www.pennfoster.edu/programs/healthcare/dental-hygienist",
      emoji: "🏥"
    }
  ],
  "Financial Planning": [
    {
      title: "Financial Planning Certificate",
      provider: "University of Georgia (Coursera)",
      price: 49,
      duration: "4 months",
      rating: 4.4,
      students: "50K+",
      description: "Comprehensive financial planning education from a top university",
      skills: ["Investment Planning", "Retirement Planning", "Tax Planning", "Estate Planning"],
      certificationType: "University Certificate",
      url: "https://www.coursera.org/specializations/financial-planning",
      emoji: "💰"
    },
    {
      title: "CFA Institute Investment Foundations",
      provider: "CFA Institute (edX)",
      price: 0,
      duration: "100 hours",
      rating: 4.6,
      students: "100K+",
      description: "Free investment fundamentals course from the CFA Institute",
      skills: ["Investment Analysis", "Portfolio Management", "Ethics", "Economics"],
      certificationType: "CFA Institute Certificate",
      url: "https://www.edx.org/course/introduction-to-investments",
      emoji: "📊"
    }
  ]
};

export function getRelevantCourses(careerFields: string[]): Course[] {
  const allCourses: Course[] = [];
  
  careerFields.forEach(field => {
    const courses = courseCatalog[field] || [];
    allCourses.push(...courses);
  });
  
  // Remove duplicates and limit to 6 courses
  const uniqueCourses = allCourses.filter((course, index, self) => 
    index === self.findIndex(c => c.title === course.title)
  );
  
  // Sort by rating and price (free courses first, then by rating)
  return uniqueCourses
    .sort((a, b) => {
      if (a.price === 0 && b.price !== 0) return -1;
      if (a.price !== 0 && b.price === 0) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 6);
}