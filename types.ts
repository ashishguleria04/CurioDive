
export interface CuriosityItem {
  id: string;
  title: string;
  blurb: string;
  source: string;
  category: string;
}

export interface DeepDiveItem {
  title: string;
  summary: string;
  relatedTopics: string[];
  sources: Array<{ title: string; url: string }>;
}