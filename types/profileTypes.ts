export interface ProfilePhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProfessionalProfileData {
  companyName?: string;
  companyLogoUrl?: string;
  profilePictureUrl?: string;
  companyEmail?: string;
  companyPhoneNumber?: string;
  websiteUrl?: string;
  companySize?: string;
  yearFounded?: number;
  bio?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  services: Service[];
  photos: ProfilePhoto[];
  locations: { id: string; postcode: string; locationName: string; isPrimary: boolean }[];
  qas: { id: string; text: string }[];
  user: {
    name?: string;
    email: string;
    professionalAnswers: {
      questionId: string;
      answerText: string;
    }[];
  };
}