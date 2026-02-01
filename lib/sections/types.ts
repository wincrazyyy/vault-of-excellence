import { JSONContent } from "@tiptap/react";


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
  border?: "none";
  modules: Module[];
};