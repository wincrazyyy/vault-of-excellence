import type { JSONContent } from "@tiptap/core";

export type Tutor2 = {
  verified: boolean;
  imageSrc?: string;
  name: string;
  title: string;
  subtitle: string;
  rating: string;
  hours: string;
  returnRate: number;

  about: {
    title: string;
    description: string;
    subjects: string[];
    syllabuses: string[];
  };

  academic: {
    title: string;
    education: {
      school: string;
      degree: string;
      graduation: string;
    }[];
  };

  teaching: {
    title: string;
    teachingStyle: string;
    lessonFormat: string;
    teachingLanguage: string;
  };

  stats: {
    title: string;
    description: string;
    data: { k: string; v: string }[];
  };

  reviews: {
    title: string;
    description: string;
  };

  booking: {
    price: number;
    availability: string[];
  };
};

export type Tutor = {
  verified: boolean;
  imageSrc?: string;
  name: string;
  title: string;
  subtitle: string;
  rating: string;
  hours: string;
  returnRate: number;

  about: {
    content: JSONContent;
    subjects: string[];
    syllabuses: string[];
  };

  academic: {
    title: string;
    education: {
      school: string;
      degree: string;
      graduation: string;
    }[];
  };

  teaching: {
    title: string;
    teachingStyle: string;
    lessonFormat: string;
    teachingLanguage: string;
  };

  stats: {
    title: string;
    description: string;
    data: { k: string; v: string }[];
  };

  reviews: {
    title: string;
    description: string;
  };

  booking: {
    price: number;
    availability: string[];
  };
};

export type Review = { name: string; text: string };
