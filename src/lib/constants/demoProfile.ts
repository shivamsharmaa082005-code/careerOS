import { 
  StudentProfile, 
  StudentSkill, 
  ProjectEvidence, 
  ResumeData, 
  AssessmentAttempt, 
  DailyMission, 
  CareerRoadmap,
  InterviewSession
} from '@/types';

export const DEMO_PROFILE: StudentProfile = {
  id: 'demo-rahul-verma',
  userId: 'demo-user-123',
  name: 'Rahul Verma',
  email: 'rahul.verma@example.edu',
  age: 21,
  location: 'Bangalore, India',
  college: 'National Institute of Technology',
  degree: 'Bachelor of Technology (B.Tech)',
  branch: 'Computer Science and Engineering',
  year: 'Final Year (4th Year)',
  cgpa: 8.4,
  bio: 'Aspiring Machine Learning Engineer passionate about deep neural networks, computer vision, and building production-ready AI services.',
  targetCareerId: 'ml-engineer',
  targetCareerTitle: 'Machine Learning Engineer',
  isDemo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const DEMO_SKILLS: StudentSkill[] = [
  {
    id: 'skill-1',
    studentId: 'demo-rahul-verma',
    skillName: 'Python',
    category: 'technical',
    currentLevel: 82,
    verifiedByAssessment: true,
    lastAssessedAt: '2026-09-20T10:00:00Z',
    assessmentScore: 84,
    subSkills: [
      { name: 'OOP & Core Syntax', level: 88 },
      { name: 'NumPy & Pandas', level: 85 },
      { name: 'Async & Concurrency', level: 68 }
    ]
  },
  {
    id: 'skill-2',
    studentId: 'demo-rahul-verma',
    skillName: 'Machine Learning & Scikit-Learn',
    category: 'framework',
    currentLevel: 68,
    verifiedByAssessment: true,
    lastAssessedAt: '2026-09-22T14:30:00Z',
    assessmentScore: 70,
    subSkills: [
      { name: 'Regression & Classification', level: 75 },
      { name: 'Cross-Validation & Hyperparameters', level: 65 },
      { name: 'Ensemble Models (XGBoost)', level: 62 }
    ]
  },
  {
    id: 'skill-3',
    studentId: 'demo-rahul-verma',
    skillName: 'Data Structures & Algorithms (DSA)',
    category: 'dsa',
    currentLevel: 52,
    verifiedByAssessment: true,
    lastAssessedAt: '2026-09-25T11:00:00Z',
    assessmentScore: 50,
    subSkills: [
      { name: 'Arrays & Hash Maps', level: 80 },
      { name: 'Binary Trees & BSTs', level: 45 },
      { name: 'Dynamic Programming & Graphs', level: 25 }
    ]
  },
  {
    id: 'skill-4',
    studentId: 'demo-rahul-verma',
    skillName: 'Deep Learning (PyTorch/TensorFlow)',
    category: 'framework',
    currentLevel: 55,
    verifiedByAssessment: false,
    subSkills: [
      { name: 'CNNs & Vision Models', level: 60 },
      { name: 'Transformers & Attention', level: 48 },
      { name: 'Model Fine-tuning', level: 52 }
    ]
  },
  {
    id: 'skill-5',
    studentId: 'demo-rahul-verma',
    skillName: 'SQL & Data Wrangling',
    category: 'technical',
    currentLevel: 72,
    verifiedByAssessment: true,
    lastAssessedAt: '2026-09-18T09:15:00Z',
    assessmentScore: 74,
    subSkills: [
      { name: 'Joins & Subqueries', level: 85 },
      { name: 'Window Functions', level: 65 },
      { name: 'Indexing & Performance', level: 58 }
    ]
  },
  {
    id: 'skill-6',
    studentId: 'demo-rahul-verma',
    skillName: 'Model Deployment (Docker/FastAPI/Cloud)',
    category: 'tools',
    currentLevel: 38,
    verifiedByAssessment: false,
    subSkills: [
      { name: 'FastAPI REST Endpoints', level: 55 },
      { name: 'Docker Containerization', level: 40 },
      { name: 'AWS/GCP Inference & CI/CD', level: 18 }
    ]
  },
  {
    id: 'skill-7',
    studentId: 'demo-rahul-verma',
    skillName: 'Technical Communication & System Design',
    category: 'soft',
    currentLevel: 64,
    verifiedByAssessment: false,
    subSkills: [
      { name: 'Technical Articulation', level: 70 },
      { name: 'System Design Fundamentals', level: 55 }
    ]
  }
];

export const DEMO_PROJECTS: ProjectEvidence[] = [
  {
    id: 'proj-1',
    studentId: 'demo-rahul-verma',
    title: 'LogiSafe — Intelligent Route & Risk Predictor',
    tagline: 'Logistics delivery delay & weather risk forecasting engine',
    description: 'Developed a predictive machine learning pipeline that ingests historical freight delivery records and real-time weather APIs to forecast shipment delay risks with 87.4% precision. Built with Python, Scikit-Learn, FastAPI, and React.',
    githubUrl: 'https://github.com/rahulverma-demo/logisafe-ml',
    liveUrl: 'https://logisafe-demo.vercel.app',
    techStack: ['Python', 'Scikit-Learn', 'FastAPI', 'Pandas', 'React', 'TailwindCSS'],
    highlights: [
      'Engineered feature pipelines handling over 250k shipping records',
      'Trained Random Forest and Gradient Boosted trees achieving 87.4% ROC-AUC',
      'Exposed sub-50ms REST API inference endpoints with FastAPI'
    ],
    aiEvaluation: {
      technicalDepth: 78,
      projectComplexity: 74,
      practicalValue: 86,
      documentation: 70,
      aiMlImplementation: 75,
      codeQualityEstimate: 78,
      resumeValue: 82,
      overallScore: 78,
      strengths: [
        'Real-world business use case with measurable metrics (87.4% ROC-AUC)',
        'Full-stack integration from ML model to interactive frontend dashboard'
      ],
      improvements: [
        'Add automated ML model drift monitoring and retraining pipelines',
        'Containerize the API with Docker and deploy to cloud (AWS/GCP)'
      ],
      resumeBulletSuggestions: [
        'Architected LogiSafe risk predictor processing 250k+ shipment records, achieving 87.4% ROC-AUC delay forecasting',
        'Deployed FastAPI prediction microservice with sub-50ms response latency serving interactive dashboard'
      ],
      summary: 'Strong practical ML portfolio project with clear business value. Upgrading with Docker containerization will elevate it to top-tier status.'
    },
    createdAt: '2026-08-15T12:00:00Z'
  },
  {
    id: 'proj-2',
    studentId: 'demo-rahul-verma',
    title: 'ChestX-Ray Pneumonia Classifier',
    tagline: 'Deep Convolutional Neural Network for medical radiography screening',
    description: 'Fine-tuned ResNet-50 on 5,800+ pediatric chest X-ray images using PyTorch with custom data augmentations to distinguish viral vs bacterial pneumonia.',
    githubUrl: 'https://github.com/rahulverma-demo/pneumonia-cnn-pytorch',
    techStack: ['PyTorch', 'Torchvision', 'OpenCV', 'Streamlit', 'Python'],
    highlights: [
      'Implemented transfer learning with Grad-CAM visual heatmaps',
      'Achieved 92.1% validation accuracy with 0.94 sensitivity',
      'Created interactive doctor diagnostic preview tool in Streamlit'
    ],
    aiEvaluation: {
      technicalDepth: 82,
      projectComplexity: 80,
      practicalValue: 80,
      documentation: 75,
      aiMlImplementation: 84,
      codeQualityEstimate: 80,
      resumeValue: 84,
      overallScore: 81,
      strengths: [
        'Effective use of Grad-CAM explainability for medical AI verification',
        'High validation accuracy and sensitivity on imbalanced dataset'
      ],
      improvements: [
        'Include detailed confusion matrix error analysis in documentation',
        'Export model to ONNX runtime for edge optimization'
      ],
      resumeBulletSuggestions: [
        'Built deep convolutional ResNet-50 model with Grad-CAM explainability, achieving 92.1% accuracy on 5,800+ chest radiographs',
        'Integrated PyTorch inference pipeline into interactive Streamlit visualization suite for medical team evaluation'
      ],
      summary: 'Demonstrates deep learning competency and explainable AI techniques.'
    },
    createdAt: '2026-07-10T15:00:00Z'
  }
];

export const DEMO_RESUME: ResumeData = {
  id: 'resume-rahul-demo',
  studentId: 'demo-rahul-verma',
  template: 'modern',
  personalInfo: {
    fullName: 'Rahul Verma',
    email: 'rahul.verma@example.edu',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/rahulverma-demo',
    github: 'github.com/rahulverma-demo',
    portfolio: 'rahulverma.dev'
  },
  professionalSummary: 'Final-year Computer Science undergraduate specializing in Machine Learning and Python engineering. Demonstrated experience building end-to-end predictive systems, computer vision models, and scalable FastAPI backend services.',
  education: [
    {
      institution: 'National Institute of Technology',
      degree: 'Bachelor of Technology (B.Tech)',
      branch: 'Computer Science & Engineering',
      startYear: '2023',
      endYear: '2027',
      cgpa: '8.4 / 10.0',
      achievements: ['Dean’s Honor List (Semesters 3 & 5)', 'Secretary, AI & Robotics Club']
    }
  ],
  technicalSkills: [
    {
      category: 'Languages & Core',
      skills: ['Python', 'C++', 'SQL', 'JavaScript']
    },
    {
      category: 'Machine Learning & AI',
      skills: ['PyTorch', 'Scikit-Learn', 'NumPy', 'Pandas', 'OpenCV', 'TensorFlow']
    },
    {
      category: 'Frameworks & Tools',
      skills: ['FastAPI', 'Git/GitHub', 'Docker (Basics)', 'Streamlit', 'Linux']
    }
  ],
  projects: [
    {
      title: 'LogiSafe — Intelligent Route & Risk Predictor',
      role: 'Lead ML Developer',
      techStack: ['Python', 'Scikit-Learn', 'FastAPI', 'Pandas', 'React'],
      link: 'github.com/rahulverma-demo/logisafe-ml',
      bulletPoints: [
        'Engineered predictive risk pipeline on 250k+ logistics records achieving 87.4% ROC-AUC precision',
        'Deployed sub-50ms REST API inference service utilizing FastAPI and Scikit-Learn pipelines',
        'Integrated real-time weather telematics to alert logistics fleet managers to hazardous route conditions'
      ]
    },
    {
      title: 'ChestX-Ray Pneumonia Classifier (PyTorch)',
      role: 'Computer Vision Developer',
      techStack: ['PyTorch', 'Torchvision', 'Streamlit', 'OpenCV'],
      link: 'github.com/rahulverma-demo/pneumonia-cnn-pytorch',
      bulletPoints: [
        'Trained ResNet-50 vision architecture with transfer learning achieving 92.1% accuracy across 5,800+ pediatric X-rays',
        'Implemented Grad-CAM saliency heatmaps to provide visual explainability for medical professionals',
        'Built interactive web diagnostic interface using Streamlit and OpenCV image pre-processing'
      ]
    }
  ],
  experience: [],
  certifications: [
    {
      title: 'Deep Learning Specialization (DeepLearning.AI)',
      issuer: 'Coursera / Andrew Ng',
      year: '2026',
      link: 'coursera.org/verify/dl-specialization'
    }
  ],
  achievements: [
    'Finalist (Top 10 of 200+ teams) at HackAI National Hackathon 2026',
    'Solved 180+ problems on LeetCode across Arrays, HashMaps, and Binary Trees'
  ],
  hackathons: [
    {
      name: 'HackAI National Hackathon',
      position: 'Top 10 Finalist',
      year: '2026',
      description: 'Built an emergency response prioritization bot using NLP and geospatial routing.'
    }
  ],
  scoreAudit: {
    overallAtsScore: 78,
    atsStructure: 85,
    skillsMatch: 80,
    projectImpact: 78,
    clarityAndTone: 82,
    formatting: 88,
    strengths: [
      'Strong action verbs and quantifiable metrics in project bullet points',
      'Clean ATS-parsable chronological hierarchy without unreadable tables'
    ],
    criticalFixes: [
      'Add Docker and cloud deployment experience keywords',
      'Strengthen DSA/algorithmic credentials to match high-volume hiring filters'
    ],
    actionableSuggestions: [
      'Include 1 system design bullet point in LogiSafe description',
      'Complete cloud deployment to add AWS/GCP to skills section'
    ]
  },
  createdAt: '2026-09-01T10:00:00Z',
  updatedAt: '2026-09-28T16:00:00Z'
};

export const DEMO_ASSESSMENTS: AssessmentAttempt[] = [
  {
    id: 'attempt-1',
    studentId: 'demo-rahul-verma',
    skillName: 'Data Structures & Algorithms (DSA)',
    totalQuestions: 10,
    correctCount: 5,
    scorePercentage: 50,
    timeSpentSeconds: 620,
    topicBreakdown: [
      { topic: 'Arrays & Two Pointers', score: 2, total: 2, percentage: 100 },
      { topic: 'Hash Maps & Sets', score: 2, total: 2, percentage: 100 },
      { topic: 'Binary Trees', score: 1, total: 3, percentage: 33 },
      { topic: 'Dynamic Programming & Graphs', score: 0, total: 3, percentage: 0 }
    ],
    strengths: ['Linear data structures', 'Time complexity analysis for array algorithms'],
    weaknesses: ['Tree traversals (DFS/BFS)', 'Dynamic programming memoization tables', 'Graph cycle detection'],
    recommendedTopics: ['Binary Tree Inversion & LCA', 'Graph BFS/DFS & Dijkstra', '0/1 Knapsack & DP Patterns'],
    aiSummary: 'Solid foundation in linear data structures, but advanced graph algorithms and dynamic programming are holding back your readiness for Tier-1 ML coding rounds.',
    completedAt: '2026-09-25T11:30:00Z'
  },
  {
    id: 'attempt-2',
    studentId: 'demo-rahul-verma',
    skillName: 'Python Core & Data Science',
    totalQuestions: 10,
    correctCount: 8,
    scorePercentage: 80,
    timeSpentSeconds: 480,
    topicBreakdown: [
      { topic: 'OOP & Decorators', score: 3, total: 3, percentage: 100 },
      { topic: 'NumPy Vectorization', score: 3, total: 3, percentage: 100 },
      { topic: 'Memory & Generators', score: 2, total: 4, percentage: 50 }
    ],
    strengths: ['Object-oriented design', 'NumPy broadcasting and matrix manipulation'],
    weaknesses: ['Generator memory profiling', 'Multiprocessing vs Multithreading in CPython GIL'],
    recommendedTopics: ['Python GIL & Concurrency', 'Custom context managers and metaclasses'],
    aiSummary: 'Very strong Python fundamentals. Ready for ML production code development.',
    completedAt: '2026-09-20T10:30:00Z'
  }
];

export const DEMO_ROADMAP: CareerRoadmap = {
  id: 'roadmap-rahul-demo',
  studentId: 'demo-rahul-verma',
  targetCareer: 'Machine Learning Engineer',
  durationWeeks: 12,
  overallProgress: 35,
  keyMilestones: [
    'Milestone 1: Close DSA Trees & DP Gap (Weeks 1-4)',
    'Milestone 2: Master PyTorch Architecture & Transformers (Weeks 5-7)',
    'Milestone 3: Build & Deploy End-to-End ML Pipeline with Docker (Weeks 8-10)',
    'Milestone 4: ATS Resume Optimization & Live Mock Interviews (Weeks 11-12)'
  ],
  weeks: [
    {
      weekNumber: 1,
      title: 'Trees & Tree Traversals Deep Dive',
      focusArea: 'Data Structures & Algorithms',
      objective: 'Master Binary Trees, BST properties, LCA, and Tree DFS/BFS recursion patterns.',
      estimatedHours: 12,
      isCompleted: true,
      tasks: [
        {
          id: 'task-w1-1',
          title: 'Complete 10 Medium Tree problems on LeetCode (Invert, Level-Order, Diameter)',
          description: 'Focus on recursion base cases and BFS queue implementations.',
          resourceName: 'NeetCode 150 Trees Guide',
          resourceUrl: 'https://neetcode.io',
          type: 'learn',
          isCompleted: true
        },
        {
          id: 'task-w1-2',
          title: 'Take CareerOS Tree Competency Assessment',
          description: 'Verify score above 75% to update student skill profile.',
          resourceName: 'CareerOS DSA Assessment Module',
          type: 'assess',
          isCompleted: true
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Graphs & Graph Search Algorithms',
      focusArea: 'Data Structures & Algorithms',
      objective: 'Understand Adjacency Lists, BFS/DFS, Cycle Detection, and Topological Sort.',
      estimatedHours: 14,
      isCompleted: true,
      tasks: [
        {
          id: 'task-w2-1',
          title: 'Implement Dijkstra and Kahn Topological Sort from scratch in Python',
          description: 'Write clean OOP classes with unit tests.',
          resourceName: 'MIT 6.006 Graph Algorithms',
          resourceUrl: 'https://ocw.mit.edu',
          type: 'build',
          isCompleted: true
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Dynamic Programming Patterns',
      focusArea: 'Data Structures & Algorithms',
      objective: 'Master 1D DP, Grid DP, and 0/1 Knapsack memoization vs tabulation.',
      estimatedHours: 15,
      isCompleted: false,
      tasks: [
        {
          id: 'task-w3-1',
          title: 'Solve House Robber, Coin Change, and Longest Increasing Subsequence',
          description: 'Draw recurrence relations and state transition tables before coding.',
          resourceName: 'Dynamic Programming Patterns Course',
          type: 'learn',
          isCompleted: false
        },
        {
          id: 'task-w3-2',
          title: 'Verify DP Progress via CareerOS Assessment',
          description: 'Aim for at least 70% in DP category.',
          resourceName: 'CareerOS Assessment',
          type: 'assess',
          isCompleted: false
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'ML System Design & Feature Stores',
      focusArea: 'Machine Learning Engineering',
      objective: 'Understand real-time inference architectures, latency vs throughput trade-offs.',
      estimatedHours: 12,
      isCompleted: false,
      tasks: [
        {
          id: 'task-w4-1',
          title: 'Study Designing Machine Learning Systems (Chip Huyen)',
          description: 'Review chapters 6 to 9 on model serving and feature stores.',
          resourceName: 'Designing ML Systems Book',
          type: 'learn',
          isCompleted: false
        }
      ]
    },
    {
      weekNumber: 5,
      title: 'Model Containerization with Docker & FastAPI',
      focusArea: 'MLOps & Deployment',
      objective: 'Package PyTorch and Scikit-learn models into lightweight Docker containers.',
      estimatedHours: 14,
      isCompleted: false,
      tasks: [
        {
          id: 'task-w5-1',
          title: 'Dockerize LogiSafe ML API and deploy to AWS ECS / Render',
          description: 'Create multi-stage Dockerfile minimizing image size below 500MB.',
          resourceName: 'Docker for Data Science Guide',
          type: 'build',
          isCompleted: false
        }
      ]
    },
    {
      weekNumber: 6,
      title: 'ML Mock Interviews & Live Coding Practice',
      focusArea: 'Interview Preparation',
      objective: 'Simulate full-loop ML Engineering interviews covering coding, ML theory, and system design.',
      estimatedHours: 10,
      isCompleted: false,
      tasks: [
        {
          id: 'task-w6-1',
          title: 'Complete 3 Voice/Text AI Mock Interviews on CareerOS',
          description: 'Achieve >75% technical accuracy and communication scores.',
          resourceName: 'CareerOS Mock Interview Suite',
          type: 'interview',
          isCompleted: false
        }
      ]
    }
  ],
  generatedAt: '2026-09-20T10:00:00Z'
};

export const DEMO_MISSIONS: DailyMission[] = [
  {
    id: 'mission-1',
    studentId: 'demo-rahul-verma',
    title: 'Solve 2 Tree Traversal problems to fix your DSA Trees gap (currently 45%)',
    category: 'dsa',
    estimatedMinutes: 30,
    isCompleted: true,
    targetSkillGap: 'Data Structures & Algorithms (DSA)',
    actionUrl: '/dashboard/assessments',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'mission-2',
    studentId: 'demo-rahul-verma',
    title: 'Take the Model Deployment & Docker Quick Assessment',
    category: 'assessment',
    estimatedMinutes: 15,
    isCompleted: false,
    targetSkillGap: 'Model Deployment (Docker/FastAPI/Cloud)',
    actionUrl: '/dashboard/assessments',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'mission-3',
    studentId: 'demo-rahul-verma',
    title: 'Analyze your LogiSafe project to generate ATS resume bullet points',
    category: 'project',
    estimatedMinutes: 10,
    isCompleted: true,
    targetSkillGap: 'Project Practical Evidence',
    actionUrl: '/dashboard/projects',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'mission-4',
    studentId: 'demo-rahul-verma',
    title: 'Practice 1 AI Mock Interview on Machine Learning Intern Role',
    category: 'interview',
    estimatedMinutes: 20,
    isCompleted: false,
    targetSkillGap: 'Technical Communication & System Design',
    actionUrl: '/dashboard/interview',
    date: new Date().toISOString().split('T')[0]
  }
];

export const DEMO_INTERVIEW: InterviewSession = {
  id: 'int-session-demo',
  studentId: 'demo-rahul-verma',
  targetRole: 'Machine Learning Intern',
  difficulty: 'intermediate',
  mode: 'text',
  totalQuestions: 3,
  completedQuestions: 3,
  isFinished: true,
  messages: [
    {
      id: 'msg-1',
      sender: 'ai_interviewer',
      content: 'Welcome Rahul! Let’s start with a foundational question: Can you explain the difference between L1 (Lasso) and L2 (Ridge) regularization, and in what scenarios would you choose L1 over L2?',
      timestamp: '2026-09-26T14:00:00Z'
    },
    {
      id: 'msg-2',
      sender: 'student',
      content: 'L1 adds the absolute value of coefficients as penalty, while L2 adds squared values. L1 drives irrelevant weights all the way to zero, making it great for feature selection when we have high dimensional sparse features. L2 shrinks weights uniformly without zeroing them, handling multicollinearity better.',
      timestamp: '2026-09-26T14:02:00Z',
      evaluation: {
        technicalAccuracy: 88,
        completeness: 85,
        clarity: 90,
        communication: 86,
        keyStrengths: ['Accurate explanation of geometric sparsity in L1', 'Clear practical distinction on feature selection vs multicollinearity'],
        improvementTips: ['Mention the mathematical loss formulation with lambda parameter'],
        sampleBetterAnswer: 'L1 (Lasso) adds lambda * sum(|w_i|) to the loss, driving non-essential coefficients to zero due to diamond-shaped constraint boundaries. Choose L1 for sparse feature selection. L2 (Ridge) adds lambda * sum(w_i^2), preventing exploding weights without zeroing them out.'
      }
    }
  ],
  overallEvaluation: {
    technicalScore: 78,
    communicationScore: 75,
    completenessScore: 74,
    clarityScore: 82,
    overallScore: 77,
    strengths: [
      'Strong conceptual grasp of ML regularization and model selection principles',
      'Concise and structured communication without rambling'
    ],
    topWeaknesses: [
      'Could incorporate specific mathematical formulations and loss functions when prompted',
      'Needs more practice explaining live system design scale trade-offs'
    ],
    concreteActionItems: [
      'Review loss equations for Cross-Entropy, MSE, and regularization hyperparameters',
      'Practice explaining model latency bottlenecks in production REST pipelines'
    ],
    summary: 'Solid performance showing genuine ML knowledge. Strengthening mathematical rigor will secure top-percentile internship offers.'
  },
  startedAt: '2026-09-26T14:00:00Z',
  finishedAt: '2026-09-26T14:15:00Z'
};
