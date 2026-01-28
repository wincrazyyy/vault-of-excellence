// app/_lib/markdown.ts

/** Removes common indentation so template strings don't become code blocks */
export function stripIndent(input: string) {
  const lines = input.replace(/\t/g, "  ").split("\n");
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return input.trim();

  const minIndent = Math.min(
    ...nonEmpty.map((l) => (l.match(/^ */)?.[0].length ?? 0))
  );

  return lines.map((l) => l.slice(minIndent)).join("\n").trim();
}
