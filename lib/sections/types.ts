import { JSONContent } from "@tiptap/react";


export type RteModule = {
  type: "rte";
  content: {
    doc: JSONContent;
  };
};

export type TagListModule = {
  type: "tagList";
  content: {
    title: string;
    items: string[];
    variant?: "violet" | "neutral";
    countLabel?: string;
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

export type GridPlacement = {
  colStart: number;
  colSpan?: number;
  rowStart?: number;
  rowSpan?: number;
};

export type GridLayoutItem = {
  id: string;
  placement: GridPlacement;
  module: Module;
};

export type GridLayoutModule = {
  type: "grid";
  content: {
    columns: number;
    gap?: "sm" | "md" | "lg";
    align?: "start" | "stretch";
    equalRowHeight?: boolean;
    items: GridLayoutItem[];
  };
};

export type Module =
  | RteModule
  | TagListModule
  | ImageModule
  | DividerModule
  | CalloutModule
  | GridLayoutModule;

export type Section = {
  id: string;
  border?: "none";
  modules: Module[];
};