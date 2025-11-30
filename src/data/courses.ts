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
                id: 'text-intro-1',
                type: 'text',
                content: {
                  html: `<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e;"><strong>⚠️ Note:</strong> The video on the right is a placeholder demo. All learning content is provided in the written text below. Read through each chapter for the complete lesson material.</p>
                  </div>

                  <h2>Welcome to Interactive Video Learning</h2>
                  <p>In this lesson, you'll experience video learning with interactive chapter navigation. The video appears on the right side of your screen, while you can read along and take notes here on the left.</p>

                  <h3>How to Use This Lesson:</h3>
                  <ul>
                    <li><strong>Read the content</strong> here on the left - this is your primary learning material</li>
                    <li><strong>Video placeholder</strong> on the right demonstrates the chapter navigation feature</li>
                    <li><strong>Click chapter buttons</strong> below the video to see how they jump to timestamps</li>
                    <li><strong>Scroll through</strong> all written chapters below for complete lesson content</li>
                  </ul>

                  <h3>What You'll Learn:</h3>
                  <p>This lesson covers essential AI tools that are transforming how professionals work across industries. You'll discover practical applications, real examples, and detailed step-by-step guidance to get started with each tool.</p>`
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
                id: 'video-demo-1',
                type: 'video',
                content: {
                  title: 'AI Tools Overview - Interactive Demo',
                  description: 'A comprehensive overview of essential AI tools for modern professionals',
                  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
                order: 1,
                settings: {
                  fullWidth: true,
                  backgroundColor: '#000000',
                  padding: '0px',
                  margin: '24px 0'
                }
              },
              {
                id: 'text-chapter-1',
                type: 'text',
                content: {
                  html: `<h2>Chapter 1: Introduction to AI Tools</h2>
                  <p><em>Watch from 0:00 - 2:00 in the video →</em></p>

                  <p>Artificial Intelligence is no longer just science fiction—it's a practical set of tools that professionals across all industries are using every single day. In this introduction, we'll explore:</p>

                  <h3>Key Concepts:</h3>
                  <ul>
                    <li><strong>What is AI?</strong> - Machine learning systems that can perform tasks that typically require human intelligence</li>
                    <li><strong>Why Now?</strong> - Recent breakthroughs have made AI accessible to everyone, not just tech companies</li>
                    <li><strong>Real Impact</strong> - Companies using AI report 30-40% time savings on routine tasks</li>
                  </ul>

                  <h3>The AI Revolution:</h3>
                  <p>We're living through a fundamental shift in how work gets done. AI tools are:</p>
                  <ul>
                    <li>Automating repetitive tasks so you can focus on creative work</li>
                    <li>Analyzing data faster than any human could</li>
                    <li>Generating content, designs, and code in seconds</li>
                    <li>Available 24/7 as virtual assistants</li>
                  </ul>

                  <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; color: #1e40af; background: #eff6ff; padding: 16px; margin: 16px 0;">
                    💡 <strong>Did You Know?</strong> 80% of professionals who use AI tools say they've significantly increased their productivity within the first month of adoption.
                  </blockquote>`
                },
                order: 2,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              },
              {
                id: 'text-chapter-2',
                type: 'text',
                content: {
                  html: `<h2>Chapter 2: Communication AI Tools</h2>
                  <p><em>Watch from 2:00 - 4:00 in the video →</em></p>

                  <p>Communication tools powered by AI are transforming how we write, edit, and communicate. These tools don't replace your voice—they enhance it.</p>

                  <h3>Featured Tools:</h3>

                  <h4>1. ChatGPT (Conversational AI)</h4>
                  <ul>
                    <li><strong>What it does:</strong> Answers questions, writes content, brainstorms ideas, and helps solve problems</li>
                    <li><strong>Use cases:</strong> Draft emails, create presentations, research topics, write code</li>
                    <li><strong>Best for:</strong> Anyone who writes or problem-solves as part of their job</li>
                    <li><strong>Pro tip:</strong> The more specific your prompt, the better the output. Instead of "write an email," try "write a professional follow-up email to a client about project delays, maintaining a positive tone"</li>
                  </ul>

                  <h4>2. Grammarly (Writing Assistant)</h4>
                  <ul>
                    <li><strong>What it does:</strong> Real-time grammar, spelling, and tone suggestions</li>
                    <li><strong>Use cases:</strong> Polish emails, reports, and documents; ensure professional tone</li>
                    <li><strong>Best for:</strong> Anyone who writes professionally</li>
                    <li><strong>Pro tip:</strong> Use the tone detector to match your writing style to your audience</li>
                  </ul>

                  <h4>3. Jasper AI (Content Creation)</h4>
                  <ul>
                    <li><strong>What it does:</strong> Generates marketing copy, blog posts, and social media content</li>
                    <li><strong>Use cases:</strong> Marketing campaigns, product descriptions, ad copy</li>
                    <li><strong>Best for:</strong> Marketers, content creators, and business owners</li>
                  </ul>

                  <blockquote style="border-left: 4px solid #10b981; padding-left: 16px; color: #065f46; background: #d1fae5; padding: 16px; margin: 16px 0;">
                    ✅ <strong>Quick Win:</strong> Start using ChatGPT today for free at chat.openai.com. Try asking it to help you draft your next email or summarize a long document.
                  </blockquote>`
                },
                order: 3,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              },
              {
                id: 'text-chapter-3',
                type: 'text',
                content: {
                  html: `<h2>Chapter 3: Design and Creative AI</h2>
                  <p><em>Watch from 4:00 - 6:00 in the video →</em></p>

                  <p>You don't need to be a designer anymore to create professional visual content. AI design tools democratize creativity, allowing anyone to produce stunning visuals.</p>

                  <h3>Featured Tools:</h3>

                  <h4>1. Canva AI (Graphic Design)</h4>
                  <ul>
                    <li><strong>What it does:</strong> Text-to-image generation, background removal, design suggestions</li>
                    <li><strong>Use cases:</strong> Social media graphics, presentations, logos, marketing materials</li>
                    <li><strong>Best for:</strong> Small business owners, marketers, non-designers</li>
                    <li><strong>Pro tip:</strong> Use the "Magic Design" feature—just describe what you need, and it generates multiple design options</li>
                  </ul>

                  <h4>2. DALL-E / Midjourney (AI Image Generation)</h4>
                  <ul>
                    <li><strong>What it does:</strong> Creates unique images from text descriptions</li>
                    <li><strong>Use cases:</strong> Custom illustrations, concept art, unique visuals for content</li>
                    <li><strong>Best for:</strong> Content creators who need original imagery</li>
                    <li><strong>Example prompt:</strong> "A professional business team collaborating around a table, modern office, bright natural lighting, photorealistic style"</li>
                  </ul>

                  <h4>3. Adobe Firefly (Creative Suite AI)</h4>
                  <ul>
                    <li><strong>What it does:</strong> AI-powered editing in Photoshop and Illustrator</li>
                    <li><strong>Use cases:</strong> Photo editing, object removal, style transfer</li>
                    <li><strong>Best for:</strong> Professional designers and photographers</li>
                  </ul>

                  <h3>Real-World Example:</h3>
                  <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <strong>Case Study:</strong> A small bakery owner with no design experience used Canva AI to create:
                    <ul>
                      <li>A complete social media presence in 2 hours</li>
                      <li>Professional menu designs</li>
                      <li>Promotional flyers and posters</li>
                    </ul>
                    <strong>Result:</strong> Saved $2,000 in designer fees and launched marketing in a single weekend.
                  </div>`
                },
                order: 4,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              },
              {
                id: 'text-chapter-4',
                type: 'text',
                content: {
                  html: `<h2>Chapter 4: Data and Analytics AI</h2>
                  <p><em>Watch from 6:00 - 8:00 in the video →</em></p>

                  <p>Data analysis used to require advanced technical skills. Now, AI tools can analyze patterns, create visualizations, and generate insights automatically.</p>

                  <h3>Featured Tools:</h3>

                  <h4>1. Microsoft Copilot in Excel</h4>
                  <ul>
                    <li><strong>What it does:</strong> Natural language data analysis—just ask questions about your data</li>
                    <li><strong>Use cases:</strong> Sales analysis, budget tracking, trend identification</li>
                    <li><strong>Example:</strong> Type "Show me which products had the highest sales last quarter" and get instant visualizations</li>
                    <li><strong>Best for:</strong> Business professionals who work with data regularly</li>
                  </ul>

                  <h4>2. Tableau AI</h4>
                  <ul>
                    <li><strong>What it does:</strong> Automatic dashboard creation and insight generation</li>
                    <li><strong>Use cases:</strong> Business intelligence, reporting, data visualization</li>
                    <li><strong>Best for:</strong> Analysts and managers who need to present data</li>
                  </ul>

                  <h4>3. Power BI AI Features</h4>
                  <ul>
                    <li><strong>What it does:</strong> AI-powered insights and anomaly detection</li>
                    <li><strong>Use cases:</strong> Identifying trends, forecasting, automated reporting</li>
                    <li><strong>Best for:</strong> Organizations using Microsoft ecosystem</li>
                  </ul>

                  <h3>Why This Matters:</h3>
                  <p>Before AI:</p>
                  <ul>
                    <li>Hours spent manually creating charts and reports</li>
                    <li>Easy to miss important patterns in data</li>
                    <li>Required specialized training to use analytics tools</li>
                  </ul>

                  <p>With AI:</p>
                  <ul>
                    <li>Ask questions in plain English, get instant answers</li>
                    <li>AI automatically highlights anomalies and trends</li>
                    <li>Anyone can become data-literate</li>
                  </ul>

                  <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; color: #5b21b6; background: #f5f3ff; padding: 16px; margin: 16px 0;">
                    📊 <strong>Pro Insight:</strong> Companies that use AI analytics tools make data-driven decisions 3x faster than those using traditional methods.
                  </blockquote>`
                },
                order: 5,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              },
              {
                id: 'text-chapter-5',
                type: 'text',
                content: {
                  html: `<h2>Chapter 5: Your Action Plan</h2>
                  <p><em>Watch from 8:00 - 10:00 in the video →</em></p>

                  <p>Now that you understand the landscape of AI tools, here's your step-by-step plan to start using them effectively.</p>

                  <h3>Week 1: Communication Tools</h3>
                  <ol>
                    <li><strong>Day 1-2:</strong> Create a free ChatGPT account and use it for 3 tasks each day</li>
                    <li><strong>Day 3-4:</strong> Install Grammarly browser extension and use it for all email</li>
                    <li><strong>Day 5:</strong> Compare your work with and without AI assistance</li>
                  </ol>

                  <h3>Week 2: Creative Tools</h3>
                  <ol>
                    <li><strong>Day 1-2:</strong> Sign up for Canva and create 3 social media posts using AI</li>
                    <li><strong>Day 3-4:</strong> Design a presentation using AI-generated graphics</li>
                    <li><strong>Day 5:</strong> Create a complete visual brand identity for a project</li>
                  </ol>

                  <h3>Week 3: Data Tools</h3>
                  <ol>
                    <li><strong>Day 1-2:</strong> Enable Copilot in Microsoft 365 (if available)</li>
                    <li><strong>Day 3-4:</strong> Use natural language queries to analyze your data</li>
                    <li><strong>Day 5:</strong> Create an automated dashboard for regular reporting</li>
                  </ol>

                  <h3>Essential Tips for Success:</h3>
                  <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
                    <h4 style="color: #1e40af; margin-top: 0;">🚀 Remember These Key Points:</h4>
                    <ul style="margin-bottom: 0;">
                      <li><strong>Start small:</strong> Pick one tool and master it before adding more</li>
                      <li><strong>Be specific:</strong> The better your prompts, the better the AI output</li>
                      <li><strong>Iterate:</strong> If the first result isn't perfect, refine and try again</li>
                      <li><strong>Stay curious:</strong> New AI tools launch every week—explore regularly</li>
                      <li><strong>Practice daily:</strong> Make AI tools part of your daily workflow</li>
                    </ul>
                  </div>

                  <h3>Measuring Your Progress:</h3>
                  <p>After 30 days of using AI tools, evaluate:</p>
                  <ul>
                    <li>How much time are you saving weekly?</li>
                    <li>What tasks have become easier or more enjoyable?</li>
                    <li>Which tools have become indispensable?</li>
                    <li>What new capabilities have you gained?</li>
                  </ul>

                  <div style="background: #dcfce7; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <h4 style="color: #065f46; margin-top: 0;">🎯 Your Next Steps:</h4>
                    <ol style="margin-bottom: 0;">
                      <li>Mark this lesson as complete</li>
                      <li>Choose ONE AI tool to start with this week</li>
                      <li>Set a reminder to practice with it daily for 7 days</li>
                      <li>Come back to reference this guide as you explore more tools</li>
                    </ol>
                  </div>

                  <p style="font-size: 1.1em; color: #1f2937; margin-top: 24px;"><strong>Congratulations!</strong> You now have a comprehensive understanding of essential AI tools and a concrete plan to integrate them into your workflow. The future of work is here—and you're ready to embrace it.</p>`
                },
                order: 6,
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
                  description: 'This interactive assessment will help you understand your current AI readiness level and provide personalized recommendations for your career growth. Answer 3 questions about your role, current AI usage, and concerns. Your results will guide your learning path through the rest of this course.',
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
          },
          {
            id: 'lesson-2-2',
            title: 'Professional Coding & AI Development',
            description: 'Learn professional coding practices with AI-assisted development tools',
            duration: 90,
            contentBlocks: [
              {
                id: 'video-2-2-1',
                type: 'video',
                content: {
                  title: 'Modern Coding Fundamentals with AI Tools',
                  description: 'A comprehensive professional coding tutorial featuring VS Code, syntax highlighting, animated diagrams, and real-world programming concepts',
                  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  chapters: [
                    {
                      id: 'coding-chapter-1',
                      title: 'Introduction to Modern Development',
                      startTime: 0,
                      endTime: 180,
                      description: 'Professional workspace setup with VS Code, dark themes, and developer tools. Overview of AI-assisted coding with GitHub Copilot and ChatGPT integration.'
                    },
                    {
                      id: 'coding-chapter-2',
                      title: 'Variables & Data Types',
                      startTime: 180,
                      endTime: 360,
                      description: 'Line-by-line code demonstration with syntax highlighting. Animated diagrams showing variable storage in memory, type systems, and data flow with arrows and labels.'
                    },
                    {
                      id: 'coding-chapter-3',
                      title: 'Functions & Control Flow',
                      startTime: 360,
                      endTime: 540,
                      description: 'Over-the-shoulder coding sessions showing function creation, loops, and conditional statements. Visual diagrams with arrows showing program execution flow.'
                    },
                    {
                      id: 'coding-chapter-4',
                      title: 'Working with APIs',
                      startTime: 540,
                      endTime: 720,
                      description: 'Real-world API integration examples with highlighted code blocks. Animated infographics showing request/response cycles, authentication, and data transformation.'
                    },
                    {
                      id: 'coding-chapter-5',
                      title: 'Code Optimization with AI',
                      startTime: 720,
                      endTime: 900,
                      description: 'AI-assisted refactoring, debugging techniques, and code quality improvements. Side-by-side comparisons with smooth transitions showing before/after optimizations.'
                    },
                    {
                      id: 'coding-chapter-6',
                      title: 'Best Practices & Next Steps',
                      startTime: 900,
                      endTime: 1080,
                      description: 'Professional coding standards, documentation, version control with Git. Simple step-by-step visual guides and your personalized learning roadmap.'
                    }
                  ],
                  autoplay: false,
                  controls: true
                },
                order: 0,
                settings: {
                  fullWidth: true,
                  backgroundColor: '#1e1e1e',
                  padding: '0px',
                  margin: '24px 0'
                }
              },
              {
                id: 'text-2-2-1',
                type: 'text',
                content: {
                  html: `<h2>Professional Coding Course Features</h2>
                  <p>This comprehensive video tutorial includes everything you need to start coding professionally with AI assistance.</p>

                  <h3>What You'll Experience</h3>

                  <h4>🎨 Professional Visual Design</h4>
                  <ul>
                    <li><strong>Dark-Themed VS Code:</strong> Industry-standard development environment with syntax highlighting</li>
                    <li><strong>Line-by-Line Animations:</strong> Smooth code appearance showing proper formatting and structure</li>
                    <li><strong>Highlighted Syntax:</strong> Color-coded code for variables, functions, and commands</li>
                    <li><strong>Zoom-In Details:</strong> Close-ups on important functions and code patterns</li>
                  </ul>

                  <h4>🎯 Instructional Approach</h4>
                  <ul>
                    <li><strong>Over-the-Shoulder Shots:</strong> Watch a professional developer work in real-time</li>
                    <li><strong>Animated Diagrams:</strong> Visual explanations of variables, loops, data flow, and APIs</li>
                    <li><strong>Infographics & Arrows:</strong> Clear labels and guides for complex concepts</li>
                    <li><strong>Slow-Paced Steps:</strong> Easy-to-follow progression perfect for beginners</li>
                  </ul>

                  <h4>💡 Core Programming Concepts Covered</h4>
                  <ul>
                    <li><strong>Variables:</strong> How to store and manipulate data</li>
                    <li><strong>Loops:</strong> Automating repetitive tasks efficiently</li>
                    <li><strong>Functions:</strong> Creating reusable code blocks</li>
                    <li><strong>APIs:</strong> Connecting to external services and data</li>
                    <li><strong>Data Flow:</strong> Understanding how information moves through programs</li>
                  </ul>

                  <h4>🎬 Production Quality</h4>
                  <ul>
                    <li><strong>Coursera/Udemy Style:</strong> Professional course production standards</li>
                    <li><strong>Polished Transitions:</strong> Smooth scene changes and visual effects</li>
                    <li><strong>Background Music:</strong> Light, non-distracting audio ambiance</li>
                    <li><strong>Clear Narration:</strong> Educational tone with step-by-step explanations</li>
                  </ul>

                  <h3>AI-Assisted Development Tools Featured</h3>
                  <p>Learn how to leverage these cutting-edge AI coding assistants:</p>
                  <ul>
                    <li><strong>GitHub Copilot:</strong> AI pair programmer that suggests code as you type</li>
                    <li><strong>ChatGPT Code Interpreter:</strong> Explain code, debug errors, and generate solutions</li>
                    <li><strong>Tabnine:</strong> AI code completion across multiple languages</li>
                    <li><strong>Replit AI:</strong> Cloud-based coding with AI assistance</li>
                  </ul>

                  <blockquote>
                    <p>"This coding course combines professional development practices with modern AI tools, giving you the skills employers are actively seeking. Whether you're transitioning careers or upskilling, you'll learn to code like a professional."</p>
                  </blockquote>

                  <h3>Perfect For</h3>
                  <ul>
                    <li>Complete beginners with no coding experience</li>
                    <li>White collar workers adding technical skills</li>
                    <li>Career changers entering tech fields</li>
                    <li>Professionals wanting to automate their work</li>
                    <li>Anyone curious about AI-assisted development</li>
                  </ul>`
                },
                order: 1,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  margin: '16px 0'
                }
              },
              {
                id: 'code-2-2-1',
                type: 'code',
                content: {
                  title: 'Sample Code: Your First AI-Assisted Function',
                  description: 'Practice code from the video - a simple function that demonstrates variables, loops, and APIs',
                  code: `// Function to fetch and process AI tool recommendations
async function getAIToolRecommendations(userRole, experienceLevel) {
  // Define variables for API endpoint and configuration
  const apiEndpoint = 'https://api.example.com/ai-tools';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  };

  // Create request payload with user parameters
  const requestData = {
    role: userRole,
    experience: experienceLevel,
    category: 'productivity'
  };

  try {
    // Make API call to get recommendations
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    });

    // Parse the JSON response
    const data = await response.json();

    // Process and filter recommendations
    const recommendations = [];

    // Loop through results and format them
    for (let i = 0; i < data.tools.length; i++) {
      const tool = data.tools[i];

      recommendations.push({
        name: tool.name,
        description: tool.description,
        difficulty: tool.learningCurve,
        impact: tool.productivityGain
      });
    }

    // Return formatted recommendations
    return recommendations;

  } catch (error) {
    // Handle any errors gracefully
    console.error('Error fetching AI tools:', error);
    return [];
  }
}

// Example usage
const myRecommendations = await getAIToolRecommendations('office-worker', 'beginner');
console.log('Recommended AI Tools:', myRecommendations);`,
                  language: 'javascript',
                  showLineNumbers: true
                },
                order: 2,
                settings: {
                  fullWidth: false,
                  backgroundColor: '#1e1e1e',
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