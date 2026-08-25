export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery?: string[];
  tags: string[];
  link: string;
  githubLink?: string;
  technicalSpecifics: string[];
  challenges: string;
  solutions: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface NavItem {
  label: string;
  href: string;
}