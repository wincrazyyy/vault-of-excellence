"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, X } from "lucide-react";

interface TagsEditorProps {
  tags: string[];
  updateTags: (tags: string[]) => void;
}

export function TagsEditor({ tags, updateTags }: TagsEditorProps) {
  const [inputValue, setInputValue] = useState("");
  const maxTags = 10;
  const isAtLimit = tags.length >= maxTags;

  const handleAddTag = () => {
    const newTag = inputValue.trim();
    if (!newTag) return;
    const isDuplicate = tags.some(t => t.toLowerCase() === newTag.toLowerCase());
    
    if (!isDuplicate && !isAtLimit) {
      updateTags([...tags, newTag]);
      setInputValue("");
    } else if (isDuplicate) {
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <Card className="border-violet-200 dark:border-violet-500/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <Tag className="h-4 w-4 text-violet-500" />
          Search Tags & Specialties
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add up to 10 tags (e.g., Math, IELTS, ADHD Support) to help students find you in search. 
          ({tags.length}/{maxTags})
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 max-w-md">
          <Input 
            placeholder={isAtLimit ? "Maximum tags reached" : "Type a tag and press Enter"} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAtLimit}
          />
          <Button 
            onClick={handleAddTag} 
            disabled={isAtLimit || !inputValue.trim()}
            variant="secondary"
          >
            Add
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="pl-3 pr-1.5 py-1.5 gap-1.5 bg-violet-50/50 dark:bg-violet-500/10 text-sm font-medium border-violet-200 dark:border-violet-500/30"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="rounded-full p-0.5 hover:bg-violet-200 dark:hover:bg-violet-500/30 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
