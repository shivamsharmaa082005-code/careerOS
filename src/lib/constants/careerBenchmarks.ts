import { CareerGoal } from '@/types';

export const CAREER_BENCHMARKS: CareerGoal[] = [
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'Artificial Intelligence',
    description: 'Designs, builds, and deploys scalable machine learning algorithms and neural network pipelines in production.',
    avgSalary: '$135,000 - $185,000 / ₹16 - ₹32 LPA',
    marketDemand: 'very_high',
    requiredSkills: [
      { name: 'Python', requiredLevel: 85, importance: 'critical', category: 'technical' },
      { name: 'Machine Learning & Scikit-Learn', requiredLevel: 80, importance: 'critical', category: 'framework' },
      { name: 'Deep Learning (PyTorch/TensorFlow)', requiredLevel: 75, importance: 'high', category: 'framework' },
      { name: 'Data Structures & Algorithms (DSA)', requiredLevel: 80, importance: 'critical', category: 'dsa' },
      { name: 'SQL & Data Wrangling', requiredLevel: 70, importance: 'high', category: 'technical' },
      { name: 'Model Deployment (Docker/FastAPI/Cloud)', requiredLevel: 70, importance: 'critical', category: 'tools' },
      { name: 'Mathematics & Statistics', requiredLevel: 75, importance: 'high', category: 'technical' },
      { name: 'Technical Communication & System Design', requiredLevel: 75, importance: 'high', category: 'soft' }
    ]
  },
  {
    id: 'software-developer',
    title: 'Software Developer (Full Stack)',
    category: 'Software Engineering',
    description: 'Builds end-to-end web architectures, microservices, robust APIs, and interactive frontend interfaces.',
    avgSalary: '$115,000 - $160,000 / ₹12 - ₹25 LPA',
    marketDemand: 'very_high',
    requiredSkills: [
      { name: 'JavaScript / TypeScript', requiredLevel: 85, importance: 'critical', category: 'technical' },
      { name: 'React / Next.js', requiredLevel: 80, importance: 'critical', category: 'framework' },
      { name: 'Node.js / Backend APIs', requiredLevel: 75, importance: 'high', category: 'framework' },
      { name: 'Data Structures & Algorithms (DSA)', requiredLevel: 80, importance: 'critical', category: 'dsa' },
      { name: 'SQL & Database Architecture', requiredLevel: 75, importance: 'high', category: 'technical' },
      { name: 'Git & Version Control', requiredLevel: 80, importance: 'high', category: 'tools' },
      { name: 'System Design & REST/GraphQL', requiredLevel: 70, importance: 'medium', category: 'technical' },
      { name: 'Team Collaboration & Agile Communication', requiredLevel: 75, importance: 'high', category: 'soft' }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    description: 'Extracts actionable business intelligence, builds predictive statistical models, and delivers data stories.',
    avgSalary: '$120,000 - $170,000 / ₹14 - ₹28 LPA',
    marketDemand: 'high',
    requiredSkills: [
      { name: 'Python & Pandas', requiredLevel: 85, importance: 'critical', category: 'technical' },
      { name: 'SQL & Data Warehousing', requiredLevel: 85, importance: 'critical', category: 'technical' },
      { name: 'Statistical Inference & Hypothesis Testing', requiredLevel: 80, importance: 'critical', category: 'technical' },
      { name: 'Machine Learning', requiredLevel: 75, importance: 'high', category: 'framework' },
      { name: 'Data Visualization (Tableau/PowerBI/Seaborn)', requiredLevel: 75, importance: 'high', category: 'tools' },
      { name: 'DSA & Algorithmic Thinking', requiredLevel: 65, importance: 'medium', category: 'dsa' },
      { name: 'Executive Storytelling & Presentation', requiredLevel: 80, importance: 'critical', category: 'soft' }
    ]
  },
  {
    id: 'ai-engineer',
    title: 'Generative AI & LLM Engineer',
    category: 'Artificial Intelligence',
    description: 'Specializes in LLM orchestration, RAG architectures, prompt pipelines, fine-tuning, and AI agents.',
    avgSalary: '$140,000 - $195,000 / ₹18 - ₹36 LPA',
    marketDemand: 'very_high',
    requiredSkills: [
      { name: 'Python', requiredLevel: 85, importance: 'critical', category: 'technical' },
      { name: 'LLM Orchestration (LangChain/LlamaIndex)', requiredLevel: 85, importance: 'critical', category: 'framework' },
      { name: 'Vector Databases & RAG', requiredLevel: 80, importance: 'critical', category: 'tools' },
      { name: 'API Engineering & FastAPI', requiredLevel: 75, importance: 'high', category: 'framework' },
      { name: 'Data Structures & Algorithms (DSA)', requiredLevel: 75, importance: 'high', category: 'dsa' },
      { name: 'Cloud & GPU Inference Optimization', requiredLevel: 70, importance: 'medium', category: 'tools' },
      { name: 'Prompt Engineering & AI Evaluation', requiredLevel: 85, importance: 'critical', category: 'technical' }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Information Security',
    description: 'Protects computer networks, audits vulnerabilities, conducts threat hunting, and enforces compliance.',
    avgSalary: '$105,000 - $155,000 / ₹10 - ₹22 LPA',
    marketDemand: 'high',
    requiredSkills: [
      { name: 'Network Security & Protocols (TCP/IP)', requiredLevel: 85, importance: 'critical', category: 'technical' },
      { name: 'Linux & Bash Scripting', requiredLevel: 80, importance: 'critical', category: 'technical' },
      { name: 'Python for Security & Automation', requiredLevel: 70, importance: 'high', category: 'technical' },
      { name: 'Vulnerability Assessment (Wireshark/Nmap)', requiredLevel: 80, importance: 'critical', category: 'tools' },
      { name: 'SIEM & Incident Response', requiredLevel: 75, importance: 'high', category: 'tools' },
      { name: 'Security Compliance & Reporting', requiredLevel: 75, importance: 'high', category: 'soft' }
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Engineer',
    category: 'Infrastructure & Cloud',
    description: 'Automates CI/CD pipelines, provisions cloud infrastructure as code (IaC), and ensures 99.99% uptime.',
    avgSalary: '$125,000 - $175,000 / ₹14 - ₹30 LPA',
    marketDemand: 'very_high',
    requiredSkills: [
      { name: 'Linux System Administration', requiredLevel: 85, importance: 'critical', category: 'technical' },
      { name: 'Docker & Kubernetes', requiredLevel: 85, importance: 'critical', category: 'tools' },
      { name: 'AWS / GCP / Azure Cloud', requiredLevel: 80, importance: 'critical', category: 'tools' },
      { name: 'CI/CD Pipelines (GitHub Actions/Jenkins)', requiredLevel: 80, importance: 'high', category: 'tools' },
      { name: 'Terraform & Infrastructure as Code', requiredLevel: 75, importance: 'high', category: 'tools' },
      { name: 'Python / Go / Bash Scripting', requiredLevel: 75, importance: 'high', category: 'technical' },
      { name: 'Observability & Monitoring', requiredLevel: 70, importance: 'medium', category: 'tools' }
    ]
  }
];

export function getCareerBenchmark(careerTitleOrId: string): CareerGoal {
  const match = CAREER_BENCHMARKS.find(
    c => c.id.toLowerCase() === careerTitleOrId.toLowerCase() ||
         c.title.toLowerCase() === careerTitleOrId.toLowerCase() ||
         c.title.toLowerCase().includes(careerTitleOrId.toLowerCase())
  );

  if (match) return match;

  // Fallback dynamic benchmark for custom career
  return {
    id: 'custom-career',
    title: careerTitleOrId,
    category: 'Specialized Domain',
    description: `Target benchmark requirements customized for ${careerTitleOrId}.`,
    avgSalary: 'Competitive Market Rate',
    marketDemand: 'high',
    requiredSkills: [
      { name: 'Core Domain Knowledge', requiredLevel: 80, importance: 'critical', category: 'technical' },
      { name: 'Problem Solving & DSA', requiredLevel: 75, importance: 'high', category: 'dsa' },
      { name: 'Industry Tools & Frameworks', requiredLevel: 75, importance: 'high', category: 'tools' },
      { name: 'Projects & Practical Portfolio', requiredLevel: 80, importance: 'critical', category: 'framework' },
      { name: 'Communication & Teamwork', requiredLevel: 75, importance: 'high', category: 'soft' }
    ]
  };
}
