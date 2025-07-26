// Shared types for the Website Idea Generator application

export interface SectionData {
  name: string;
  html: string;
  _id: string;
}

export interface WebsiteIdea {
  _id: string;
  idea: string;
  sections: SectionData[];
  createdAt: string;
  updatedAt: string;
}