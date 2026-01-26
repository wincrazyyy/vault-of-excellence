import { Markdown } from "@/components/markdown";
import { stripIndent } from "@/lib/markdown";

type InfoCardProps = {
  title: string;
  description?: string;
  value?: string;
  className?: string;
  markdown?: boolean;
  variant?: "default" | "stat";
};

export function InfoCard({
  title,
  description = "",
  value,
  className = "",
  markdown = false,
  variant = "default",
}: InfoCardProps) {
  return (
    <div
      className={[
        "group rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6",
        "shadow-[0_1px_0_rgba(0,0,0,0.02)]",
        "transition-all duration-200 hover:-translate-y-px hover:bg-white",
        "hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:ring-1 hover:ring-neutral-200",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
          {title}
        </div>
      </div>

      {variant === "stat" ? (
        <>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-[#050B1E]">
            {value}
          </div>
          <div className="mt-3 h-1 w-14 rounded-full bg-violet-200" />
        </>
      ) : markdown ? (
        <Markdown
          content={stripIndent(description)}
          className={[
            "mt-4 text-sm text-neutral-700",
            "prose-p:leading-relaxed prose-li:leading-relaxed",
            "prose-ul:pl-5 prose-ol:pl-5",
          ].join(" ")}
        />
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-neutral-800">
          {description}
        </p>
      )}
    </div>
  );
}
