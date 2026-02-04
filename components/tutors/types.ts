import { Section } from "@/lib/sections/types";
import type { JSONContent } from "@tiptap/core";

export type Tutor = {
  profile: {
    verified: boolean;
    imageSrc?: string;
    name: string;
    title: string;
    subtitle: string;
    rating: string;
    hours: string;
    price: number;
    returnRate: number;
  };
  sections: Section[];
  reviews: {
    title: string;
    description: string;
    items: Review[];
  };
};

export type Review = { name: string; text: string };
