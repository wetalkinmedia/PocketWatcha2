import { Course } from '../types/index';

export const allCourses: Course[] = [
  {
    id: 'interactive-demo-ai-tools',
    title: 'Interactive Learning Demo - AI Tools Mastery',
    description: 'Experience all interactive features: hotspots, drag-and-drop, quizzes, and video chapters in this comprehensive demo course.',
    instructor: {
      id: 'wetalkinomics-partner',
      name: 'Wetalkinomics Partner',
      bio: 'Leading AI education and workforce transformation expert',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      credentials: ['AI Education Specialist', 'Interactive Learning Expert', 'Workforce Transformation Leader']
    },
    duration: '2 hours',
    level: 'Beginner',
    price: 0, // FREE
    rating: 4.9,
    reviewCount: 1250,
    studentCount: '5,000+',
    skills: ['Interactive Learning', 'AI Tools', 'Digital Literacy', 'Hands-on Practice'],
    modules: [
      {
        id: 'demo-module-1',
        title: 'Interactive Features Showcase',
        description: 'Experience all interactive learning features in action',
        lessons: [
          {
            id: 'demo-lesson-1',
            title: 'Hotspot Learning Demo',
            description: 'Click on interactive hotspots to discover AI applications',
            duration: 15,
            contentBlocks: [
              {
                id: 'hotspot-demo-1',
                type: 'interactive-image',
                content: {
                  imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
                  title: 'AI-Enhanced Workspace',
                  description: 'Click on the numbered hotspots to discover how AI transforms modern workspaces',
                  hotspots: [
                    {
                      id: 'hotspot-1',
                      x: 25,
                      y: 30,
                      title: 'Smart Assistant',
                      content: 'AI-powered virtual assistants like ChatGPT help with writing, research, and problem-solving. They can draft emails, create presentations, and answer complex questions instantly.',
                      type: 'info'
                    },
                    {
                      id: 'hotspot-2',
                      x: 60,
                      y: 45,
                      title: 'Data Analytics',
                      content: 'AI tools like Tableau and Power BI automatically analyze data patterns, create visualizations, and generate insights that would take humans hours to discover.',
                      type: 'info'
                    },
                    {
                      id: 'hotspot-3',
                      x: 80,
                      y: 25,
                      title: 'Design Automation',
                      content: 'Tools like Canva AI and Adobe Firefly can generate professional designs, logos, and marketing materials in seconds based on simple text descriptions.',
                      type: 'info'
                    },
                    {
                      id: 'hotspot-4',
                      x: 40,
                      y: 70,
                      title: 'Meeting Intelligence',
                      content: 'AI meeting assistants like Otter.ai and Zoom AI automatically transcribe meetings, generate summaries, and extract action items.',
                      type: 'info'
                    }
                  ]
                },
                order: 0,
                settings: {
                  fullWidth: true,
                  backgroundColor: '#f8fafc',
                  padding: '24px',
                  margin: '16px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'demo-lesson-2',
            title: 'Drag & Drop Activity Demo',
            description: 'Interactive tool matching exercise',
            duration: 20,
            contentBlocks: [
              {
                id: 'dragdrop-demo-1',
                type: 'drag-drop',
                content: {
                  title: 'Match Traditional Tools with AI Alternatives',
                  instructions: 'Drag each traditional tool to its AI-enhanced counterpart',
                  items: [
                    {
                      id: 'traditional-1',
                      content: 'Manual Data Entry',
                      type: 'draggable',
                      correctMatches: ['ai-1']
                    },
                    {
                      id: 'traditional-2',
                      content: 'Paper Scheduling',
                      type: 'draggable',
                      correctMatches: ['ai-2']
                    },
                    {
                      id: 'traditional-3',
                      content: 'Manual Calculations',
                      type: 'draggable',
                      correctMatches: ['ai-3']
                    },
                    {
                      id: 'ai-1',
                      content: 'AI Data Processing',
                      type: 'dropzone'
                    },
                    {
                      id: 'ai-2',
                      content: 'Smart Calendar AI',
                      type: 'dropzone'
                    },
                    {
                      id: 'ai-3',
                      content: 'Automated Analytics',
                      type: 'dropzone'
                    }
                  ],
                  feedback: {
                    correct: 'Excellent! You correctly matched the tools. AI automation can save hours of manual work.',
                    incorrect: 'Not quite right. Think about which AI tool would best replace each manual process.'
                  }
                },
                order: 0,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'demo-lesson-3',
            title: 'Interactive Quiz Demo',
            description: 'Test your AI knowledge with instant feedback',
            duration: 25,
            contentBlocks: [
              {
                id: 'quiz-demo-1',
                type: 'quiz',
                content: {
                  title: 'AI Readiness Assessment',
                  description: 'Test your understanding of AI tools and their applications',
                  questions: [
                    {
                      id: 'q1',
                      type: 'multiple-choice',
                      question: 'Which AI tool is best for automating email responses?',
                      options: ['ChatGPT', 'Photoshop', 'Excel', 'PowerPoint'],
                      correctAnswer: 'ChatGPT',
                      explanation: 'ChatGPT and similar AI language models excel at generating human-like text responses, making them perfect for email automation.',
                      points: 1
                    },
                    {
                      id: 'q2',
                      type: 'true-false',
                      question: 'AI tools can only be used by technical professionals.',
                      correctAnswer: 'false',
                      explanation: 'Modern AI tools are designed to be user-friendly and accessible to professionals in all fields, not just technical roles.',
                      points: 1
                    },
                    {
                      id: 'q3',
                      type: 'multiple-choice',
                      question: 'What percentage of jobs are expected to be transformed by AI by 2030?',
                      options: ['25%', '50%', '75%', '90%'],
                      correctAnswer: '75%',
                      explanation: 'Studies suggest that up to 75% of jobs will be significantly transformed by AI integration by 2030, though most will be enhanced rather than replaced.',
                      points: 1
                    }
                  ],
                  timeLimit: null,
                  passingScore: 70,
                  allowRetakes: true,
                  showCorrectAnswers: true
                },
                order: 0,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'demo-lesson-4',
            title: 'Video with Chapters Demo',
            description: 'Experience interactive video learning with chapter navigation',
            duration: 30,
            contentBlocks: [
              {
                id: 'video-demo-1',
                type: 'video',
                content: {
                  title: 'AI Tools Overview - Interactive Demo',
                  description: 'A comprehensive overview of essential AI tools for modern professionals',
                  url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                  chapters: [
                    {
                      id: 'chapter-1',
                      title: 'Introduction to AI Tools',
                      startTime: 0,
                      endTime: 120,
                      description: 'Overview of the AI revolution and its impact on work'
                    },
                    {
                      id: 'chapter-2',
                      title: 'Communication AI Tools',
                      startTime: 120,
                      endTime: 240,
                      description: 'ChatGPT, Grammarly, and other writing assistants'
                    },
                    {
                      id: 'chapter-3',
                      title: 'Design and Creative AI',
                      startTime: 240,
                      endTime: 360,
                      description: 'Canva AI, DALL-E, and creative automation tools'
                    },
                    {
                      id: 'chapter-4',
                      title: 'Data and Analytics AI',
                      startTime: 360,
                      endTime: 480,
                      description: 'Excel Copilot, Tableau AI, and data insights'
                    },
                    {
                      id: 'chapter-5',
                      title: 'Getting Started Action Plan',
                      startTime: 480,
                      endTime: 600,
                      description: 'Your next steps to implement AI in your workflow'
                    }
                  ],
                  autoplay: false,
                  controls: true
                },
                order: 0,
                settings: {
                  fullWidth: true,
                  backgroundColor: '#000000',
                  padding: '0px',
                  margin: '24px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ],
        completed: false,
        locked: false,
        order: 0,
        estimatedDuration: 90,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    certificate: true,
    enrolled: false,
    progress: 0,
    emoji: '🎯',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Interactive Learning',
    tags: ['Demo', 'Interactive', 'AI Tools', 'Hands-on'],
    language: 'English',
    subtitles: ['English'],
    requirements: ['No prior experience needed', 'Computer with internet connection'],
    whatYouWillLearn: [
      'Experience interactive hotspot learning',
      'Practice drag-and-drop activities',
      'Take engaging quizzes with instant feedback',
      'Navigate video content with chapters',
      'Understand AI tool applications'
    ],
    targetAudience: ['Anyone curious about interactive learning', 'Professionals exploring AI tools', 'Students wanting hands-on experience'],
    published: true,
    publishedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'wetalkinomics-partner'
  },
  {
    id: 'ai-transition-white-blue-collar',
    title: 'Transitioning to AI: White Collar & Blue Collar Guide',
    description: 'Master the AI revolution with practical tools and strategies for both office and hands-on professionals. Learn 50+ AI tools, get certified, and boost your career.',
    instructor: {
      id: 'wetalkinomics-partner',
      name: 'Wetalkinomics Partner',
      bio: 'Leading AI education and workforce transformation expert with 15+ years of experience helping professionals adapt to technological change.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      credentials: ['AI Transformation Expert', 'Workforce Development Leader', 'Technology Integration Specialist']
    },
    duration: '8 weeks',
    level: 'Intermediate',
    price: 5.00,
    rating: 4.9,
    reviewCount: 2847,
    studentCount: '25,000+',
    skills: ['AI Tool Mastery', 'Career Transition', 'Digital Transformation', 'Productivity Enhancement', 'Future-Proofing'],
    modules: [
      {
        id: 'module-1-ai-revolution',
        title: 'Understanding the AI Revolution',
        description: 'Comprehensive overview of AI impact on white collar and blue collar work',
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'The AI Transformation Landscape',
            description: 'Understanding how AI is reshaping every industry',
            duration: 45,
            contentBlocks: [
              {
                id: 'text-1-1-1',
                type: 'text',
                content: {
                  html: `<h2>Welcome to the AI Revolution</h2>
                  <p>We're living through the most significant workplace transformation since the Industrial Revolution. Artificial Intelligence isn't just changing technology—it's fundamentally reshaping how we work, think, and solve problems.</p>
                  
                  <h3>What You'll Discover</h3>
                  <ul>
                    <li><strong>The Reality Check:</strong> 75% of jobs will be transformed by AI by 2030</li>
                    <li><strong>The Opportunity:</strong> AI-skilled workers earn 25-40% more</li>
                    <li><strong>The Timeline:</strong> Most changes are happening NOW, not in the distant future</li>
                  </ul>
                  
                  <blockquote>
                    <p>"The question isn't whether AI will change your job—it's whether you'll be the one using AI to excel, or watching others do it."</p>
                  </blockquote>
                  
                  <h3>Why This Course Matters</h3>
                  <p>This isn't theoretical learning. Every tool, strategy, and technique you'll learn is being used RIGHT NOW by professionals who are:</p>
                  <ul>
                    <li>Getting promoted faster</li>
                    <li>Earning higher salaries</li>
                    <li>Working more efficiently</li>
                    <li>Future-proofing their careers</li>
                  </ul>`
                },
                order: 0,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'lesson-1-2',
            title: 'AI Impact Assessment - Interactive Quiz',
            description: 'Discover how AI will specifically impact your role and industry',
            duration: 30,
            contentBlocks: [
              {
                id: 'quiz-1-2-1',
                type: 'quiz',
                content: {
                  title: 'Personal AI Readiness Assessment',
                  description: 'Discover your AI readiness level and get personalized recommendations',
                  questions: [
                    {
                      id: 'q1-2-1',
                      type: 'multiple-choice',
                      question: 'What best describes your current role?',
                      options: ['Office/Administrative Work', 'Creative/Design Work', 'Technical/Engineering', 'Sales/Marketing', 'Management/Leadership', 'Skilled Trades/Manual Work'],
                      correctAnswer: 'Office/Administrative Work',
                      explanation: 'Each role type has specific AI tools and strategies that can dramatically improve productivity and career prospects.',
                      points: 1
                    },
                    {
                      id: 'q1-2-2',
                      type: 'multiple-choice',
                      question: 'How often do you currently use AI tools in your work?',
                      options: ['Never', 'Rarely (once a month)', 'Sometimes (weekly)', 'Regularly (daily)', 'Extensively (multiple times daily)'],
                      correctAnswer: 'Never',
                      explanation: 'Your current usage level helps us customize your learning path and identify the biggest opportunities for improvement.',
                      points: 1
                    },
                    {
                      id: 'q1-2-3',
                      type: 'multiple-choice',
                      question: 'What\'s your biggest concern about AI in the workplace?',
                      options: ['Job replacement fears', 'Learning curve too steep', 'Cost of AI tools', 'Don\'t know where to start', 'Privacy and security concerns'],
                      correctAnswer: 'Don\'t know where to start',
                      explanation: 'Understanding your concerns helps us address them directly and build your confidence with AI adoption.',
                      points: 1
                    }
                  ],
                  timeLimit: null,
                  passingScore: 70,
                  allowRetakes: true,
                  showCorrectAnswers: true
                },
                order: 0,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#f8fafc',
                  padding: '24px',
                  margin: '16px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ],
        completed: false,
        locked: false,
        order: 0,
        estimatedDuration: 120,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'module-2-white-collar',
        title: 'White Collar AI Revolution',
        description: 'Master 25+ AI tools that transform office work, from writing to data analysis',
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'Communication AI Mastery',
            description: 'Transform your writing, emails, and presentations with AI',
            duration: 60,
            contentBlocks: [
              {
                id: 'text-2-1-1',
                type: 'text',
                content: {
                  html: `<h2>Master AI-Powered Communication</h2>
                  <p>Communication is the foundation of professional success. AI tools can transform how you write, present, and connect with others.</p>
                  
                  <h3>Essential Communication AI Tools</h3>
                  
                  <h4>1. ChatGPT & Claude (Writing Assistants)</h4>
                  <ul>
                    <li><strong>Email Automation:</strong> Draft professional emails in seconds</li>
                    <li><strong>Report Writing:</strong> Create comprehensive reports with data analysis</li>
                    <li><strong>Presentation Content:</strong> Generate compelling slide content and speaker notes</li>
                    <li><strong>Meeting Summaries:</strong> Transform meeting notes into actionable summaries</li>
                  </ul>
                  
                  <h4>2. Grammarly Business (Advanced Writing)</h4>
                  <ul>
                    <li><strong>Tone Detection:</strong> Ensure your writing matches your intended tone</li>
                    <li><strong>Clarity Enhancement:</strong> Make complex ideas simple and clear</li>
                    <li><strong>Professional Polish:</strong> Eliminate errors and improve readability</li>
                  </ul>
                  
                  <h4>3. Otter.ai (Meeting Intelligence)</h4>
                  <ul>
                    <li><strong>Real-time Transcription:</strong> Never miss important details</li>
                    <li><strong>Action Item Extraction:</strong> Automatically identify next steps</li>
                    <li><strong>Meeting Summaries:</strong> Share key points with stakeholders</li>
                  </ul>`
                },
                order: 0,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ],
        completed: false,
        locked: false,
        order: 1,
        estimatedDuration: 180,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'module-3-blue-collar',
        title: 'Blue Collar AI Integration',
        description: 'Discover how AI enhances skilled trades, manufacturing, and hands-on work',
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'Smart Tools for Skilled Trades',
            description: 'AI applications in construction, automotive, and manufacturing',
            duration: 50,
            contentBlocks: [
              {
                id: 'interactive-3-1-1',
                type: 'interactive-image',
                content: {
                  imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
                  title: 'AI-Enhanced Construction Site',
                  description: 'Click on each area to discover how AI is transforming construction and skilled trades',
                  hotspots: [
                    {
                      id: 'construction-1',
                      x: 20,
                      y: 30,
                      title: 'Smart Safety Monitoring',
                      content: 'AI-powered cameras and sensors monitor job sites 24/7, detecting safety violations, unauthorized access, and potential hazards before accidents occur.',
                      type: 'info'
                    },
                    {
                      id: 'construction-2',
                      x: 60,
                      y: 25,
                      title: 'Predictive Maintenance',
                      content: 'IoT sensors and AI algorithms predict when equipment needs maintenance, preventing costly breakdowns and extending machinery life by 20-30%.',
                      type: 'info'
                    },
                    {
                      id: 'construction-3',
                      x: 80,
                      y: 50,
                      title: 'Quality Control AI',
                      content: 'Computer vision systems automatically inspect work quality, identifying defects and ensuring compliance with specifications faster than human inspection.',
                      type: 'info'
                    },
                    {
                      id: 'construction-4',
                      x: 40,
                      y: 70,
                      title: 'Resource Optimization',
                      content: 'AI algorithms optimize material usage, scheduling, and logistics, reducing waste by up to 15% and improving project timelines.',
                      type: 'info'
                    }
                  ]
                },
                order: 0,
                settings: {
                  fullWidth: true,
                  backgroundColor: '#f8fafc',
                  padding: '24px',
                  margin: '16px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ],
        completed: false,
        locked: false,
        order: 2,
        estimatedDuration: 150,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'module-4-career-transition',
        title: 'Career Transition Strategies',
        description: 'Build your AI-enhanced career with resume optimization, interview prep, and salary negotiation',
        lessons: [
          {
            id: 'lesson-4-1',
            title: 'AI-Enhanced Resume Building',
            description: 'Create compelling resumes that highlight your AI skills',
            duration: 40,
            contentBlocks: [
              {
                id: 'text-4-1-1',
                type: 'text',
                content: {
                  html: `<h2>Build an AI-Enhanced Resume That Gets Results</h2>
                  <p>Your resume is your first impression. Here's how to showcase your AI skills and stand out in today's competitive job market.</p>
                  
                  <h3>AI Skills to Highlight</h3>
                  
                  <h4>Technical AI Proficiencies</h4>
                  <ul>
                    <li><strong>AI Writing Tools:</strong> ChatGPT, Claude, Jasper for content creation</li>
                    <li><strong>Data Analysis AI:</strong> Excel Copilot, Tableau AI, Power BI intelligence</li>
                    <li><strong>Design AI:</strong> Canva AI, Adobe Firefly, Midjourney for visual content</li>
                    <li><strong>Productivity AI:</strong> Notion AI, Monday.com AI, Zapier automation</li>
                  </ul>
                  
                  <h4>AI-Enhanced Achievements</h4>
                  <ul>
                    <li>"Increased productivity 40% using AI writing assistants for report generation"</li>
                    <li>"Reduced data analysis time by 60% implementing AI-powered Excel tools"</li>
                    <li>"Improved customer response time 50% with AI chatbot integration"</li>
                    <li>"Enhanced design output 3x using AI-assisted creative tools"</li>
                  </ul>
                  
                  <h3>Resume Template Structure</h3>`
                },
                order: 0,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              },
              {
                id: 'code-4-1-1',
                type: 'code',
                content: {
                  title: 'AI-Enhanced Resume Template',
                  description: 'Copy and customize this template to highlight your AI skills',
                  code: `[Name]
AI-Powered [Job Title] | Digital Transformation Leader

PROFESSIONAL SUMMARY
Results-driven professional with expertise in AI tool integration and digital workflow optimization. Proven track record of increasing productivity 40%+ through strategic AI implementation. Experienced in ChatGPT, Excel Copilot, and automation tools.

CORE AI COMPETENCIES
• AI Writing & Communication: ChatGPT, Claude, Grammarly Business
• Data Analysis & Visualization: Excel Copilot, Tableau AI, Power BI
• Design & Creative AI: Canva AI, Adobe Firefly, Midjourney
• Productivity & Automation: Zapier, Notion AI, Monday.com AI
• Meeting Intelligence: Otter.ai, Zoom AI, Microsoft Copilot

PROFESSIONAL EXPERIENCE

[Job Title] | [Company] | [Dates]
• Increased team productivity 45% by implementing AI writing tools for report generation
• Reduced data processing time 60% using Excel Copilot for financial analysis
• Enhanced customer communication quality 35% with AI-assisted email drafting
• Led AI adoption training for 25+ team members, improving overall efficiency

ACHIEVEMENTS & CERTIFICATIONS
• AI Fundamentals Certificate - Google (2024)
• Advanced Prompt Engineering - OpenAI (2024)
• Productivity AI Mastery - Microsoft (2024)
• Increased department efficiency 50% through AI tool integration

TECHNICAL SKILLS
AI Tools: ChatGPT, Claude, Excel Copilot, Canva AI, Otter.ai
Traditional: Microsoft Office, Google Workspace, Project Management
Soft Skills: Change Management, Training & Development, Process Optimization`,
                  language: 'text',
                  showLineNumbers: false
                },
                order: 1,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#f8fafc',
                  padding: '24px',
                  margin: '16px 0'
                }
              }
            ],
            completed: false,
            locked: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ],
        completed: false,
        locked: false,
        order: 3,
        estimatedDuration: 120,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ],
    certificate: true,
    enrolled: false,
    progress: 0,
    emoji: '🤖',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'AI & Machine Learning',
    tags: ['AI Tools', 'Career Development', 'Digital Transformation', 'Productivity'],
    language: 'English',
    subtitles: ['English', 'Spanish'],
    requirements: [
      'Basic computer skills',
      'Internet connection',
      'Willingness to learn new technologies',
      'No prior AI experience required'
    ],
    whatYouWillLearn: [
      'Master 50+ essential AI tools for work enhancement',
      'Increase productivity by 40-60% using AI automation',
      'Build AI skills that command 25-40% higher salaries',
      'Create an AI-enhanced resume and LinkedIn profile',
      'Develop strategies for career transition and advancement',
      'Understand AI applications in both white and blue collar work',
      'Implement AI tools in your current role immediately',
      'Future-proof your career against technological change'
    ],
    targetAudience: [
      'Office workers wanting to enhance productivity',
      'Skilled trades professionals exploring AI applications',
      'Career changers looking to upskill',
      'Managers implementing AI in their teams',
      'Anyone concerned about job security due to AI',
      'Professionals seeking salary increases through AI skills'
    ],
    published: true,
    publishedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'wetalkinomics-partner'
  }
];