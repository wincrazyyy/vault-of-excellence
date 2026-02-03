import type { JSONContent } from "@tiptap/core";

export type ModuleBase = { id: string };

export type RteModule = ModuleBase & {
  type: "rte";
  content: {
    doc: JSONContent;
  };
};

type MiniCardBase = {
  title: string;
  variant?: "violet" | "neutral";
  align?: "left" | "center";
};

export type MiniCardModule = ModuleBase & {
  type: "miniCard";
  content:
    | (MiniCardBase & {
        kind: "tags";
        items: string[];
        countLabel?: string;
      })
    | (MiniCardBase & {
        kind: "rte";
        doc: JSONContent;
      })
    | (MiniCardBase & {
        kind: "value";
        value: string;
        helper?: string;
      });
};

export type ImageModule = ModuleBase & {
  type: "image";
  content: {
    src: string;
    alt?: string;
    caption?: string;
  };
};

export type DividerModule = ModuleBase & {
  type: "divider";
  content: {
    variant?: "line" | "space";
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

export type GridLayoutModule = ModuleBase & {
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
  | MiniCardModule
  | ImageModule
  | DividerModule
  | GridLayoutModule;

export type Section = {
  id: string;
  border?: "none";
  modules: Module[];
};
