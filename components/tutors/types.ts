import { Section } from "@/lib/tutors/sections/types";

export type Tutor = {
  profile: {
    name: string;
    title?: string;
    subtitle?: string;
    imageSrc?: string;
    price: number;
    rating: number;
    returnRate: number;
    showRating: boolean;
    showReturnRate: boolean;
    badgeText?: string;
    verified: boolean;
  };
  sections: Section[];
  reviews: {
    title: string;
    description: string;
    items: Review[];
  };
};

export type Review = { 
  name: string; 
  text: string; 
};