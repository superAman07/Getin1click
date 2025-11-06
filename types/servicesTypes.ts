export interface Service {
  id: string;
  name: string;
  description: string | null;
  creditCost: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt?: string;
  categoryId: string;
  questions: {
    id: string;
    text: string;
    type: 'CUSTOMER' | 'PROFESSIONAL' | 'PROFILE_FAQ';
    inputType: 'TEXT' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
    options: { id: string; text: string }[];
  }[];
  category: {
    id: string;
    name: string;
  };
}