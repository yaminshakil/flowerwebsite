export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readingTime: string;
  category: "Floriography" | "Garden Craft" | "Wild Botanicals" | "Floral Artistry";
  tags: string[];
  author: Author;
  likes: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  authorName: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
}

export interface BouquetFlower {
  name: string;
  meaning: string;
  color: string;
  symbolism: string;
  visualDescription: string;
}

export interface FloriographyBouquet {
  introduction: string;
  flowers: BouquetFlower[];
  poetry: string;
  careInstructions: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
}
