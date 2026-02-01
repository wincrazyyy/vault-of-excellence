import type { JSONContent } from "@tiptap/core";

export type RteModule = {
  type: "rte";
  content: {
    doc: JSONContent;
  };
};

export type ImageModule = {
  type: "image";
  content: {
    src: string;
    alt?: string;
    caption?: string;
  };
};

export type DividerModule = {
  type: "divider";
  content: {
    variant?: "line" | "space";
  };
};

export type CalloutModule = {
  type: "callout";
  content: {
    tone: "info" | "success" | "warning" | "danger";
    title?: string;
    doc?: JSONContent;
  };
};

export type Module = RteModule | ImageModule | DividerModule | CalloutModule;

export type Section = {
  id: string;
  title?: string;
  modules: Module[];
};

export type Tutor2 = {
  profile: {
    verified: boolean;
    imageSrc?: string;
    name: string;
    title: string;
    subtitle: string;
    rating: string;
    hours: string;
    returnRate: number;
  };

  sections: Section[];
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
