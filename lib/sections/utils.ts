import type { Module } from "@/lib/sections/types";

export function createModule(type: Module["type"]): Module {
  const id = `module-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;

  switch (type) {
    case "rte":
      return {
        id,
        type: "rte",
        content: { doc: { type: "doc", content: [] } },
      };
    case "image":
      return {
        id,
        type: "image",
        content: { src: "", alt: "" },
      };
    case "miniCard":
      return {
        id,
        type: "miniCard",
        content: { kind: "value", title: "New Card", value: "" },
      };
    case "divider":
      return {
        id,
        type: "divider",
        content: { variant: "line" },
      };
    case "grid":
      return {
        id,
        type: "grid",
        content: { columns: 2, rows: 1, items: [] },
      };
    default:
      throw new Error(`Unknown module type: ${type}`);
  }
}