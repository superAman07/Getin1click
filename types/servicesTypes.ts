export interface Service {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
  questions: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
  }[];
  category: {
    id: string;
    name: string;
  };
}