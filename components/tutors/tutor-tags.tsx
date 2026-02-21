import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface TutorTagsProps {
  tags: string[];
}

export function TutorTags({ tags }: TutorTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Tag className="h-4 w-4 text-muted-foreground/70 mr-1" />
      {tags.map((tag) => (
        <Badge 
          key={tag} 
          variant="secondary" 
          className="bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50 px-3 py-1 text-xs transition-colors cursor-default"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
