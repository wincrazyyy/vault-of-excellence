import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  content: string;
  className?: string;
};

export function Markdown({ content, className = "" }: MarkdownProps) {
  return (
    <article
      className={[
        "prose",
        // "prose prose-neutral max-w-none",
        // "prose-p:my-2!",
        // "prose-ul:my-2!",
        // "prose-ol:my-2!",
        // "prose-li:my-1!",
        // "prose-h1:my-3!", "prose-h2:my-3!", "prose-h3:my-3!", "prose-h4:my-3!",
        className,
      ].join(" ")}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
