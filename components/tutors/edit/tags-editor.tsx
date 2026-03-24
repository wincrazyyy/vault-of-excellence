"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, X, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagsEditorProps {
  tags: string[];
  updateTags: (tags: string[]) => void;
}

export function TagsEditor({ tags, updateTags }: TagsEditorProps) {
  const [inputValue, setInputValue] = useState("");
  const maxTags = 10;
  const isAtLimit = tags.length >= maxTags;

  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState("");

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  const handleRemoveTag = (indexToRemove: number) => {
    updateTags(tags.filter((_, i) => i !== indexToRemove));
  };

  const handleSaveEditTag = () => {
    if (editingTagIndex !== null) {
      const trimmed = editingTagValue.trim();
      const newTags = [...tags];
      
      if (trimmed) {
        const isDuplicate = newTags.some((t, i) => i !== editingTagIndex && t.toLowerCase() === trimmed.toLowerCase());
        
        if (!isDuplicate) {
          newTags[editingTagIndex] = trimmed;
        }
      } else {
        newTags.splice(editingTagIndex, 1);
      }
      
      updateTags(newTags);
      setEditingTagIndex(null);
      setEditingTagValue("");
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      const newTags = [...tags];
      const [movedTag] = newTags.splice(draggedIndex, 1);
      newTags.splice(targetIndex, 0, movedTag);
      updateTags(newTags);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
          <div className="mt-5 flex flex-wrap gap-2 min-h-8">
            {tags.map((tag, index) => (
              <div
                key={index}
                draggable={editingTagIndex !== index}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className="transition-all"
              >
                {editingTagIndex === index ? (
                  <Input
                    autoFocus
                    value={editingTagValue}
                    onChange={(e) => setEditingTagValue(e.target.value)}
                    onBlur={handleSaveEditTag}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEditTag();
                      if (e.key === "Escape") {
                        setEditingTagIndex(null);
                        setEditingTagValue("");
                      }
                    }}
                    className="h-8 w-32 px-2 py-0 text-sm rounded border-violet-500 ring-1 ring-violet-500"
                  />
                ) : (
                  <Badge 
                    onClick={() => {
                      setEditingTagIndex(index);
                      setEditingTagValue(tag);
                    }}
                    variant="outline" 
                    title="Click to edit, drag to reorder"
                    className={cn(
                      "group pl-2 pr-1.5 py-1.5 gap-1 bg-violet-50/50 dark:bg-violet-500/10 text-sm font-medium border-violet-200 dark:border-violet-500/30 cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors",
                      draggedIndex === index && "opacity-30 border-dashed",
                      dragOverIndex === index && draggedIndex !== index && "ring-2 ring-violet-500 scale-105"
                    )}
                  >
                    <GripHorizontal className="h-3 w-3 text-muted-foreground opacity-50 cursor-grab active:cursor-grabbing group-hover:opacity-100 transition-opacity" />
                    <span>{tag}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(index);
                      }}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-violet-200 dark:hover:bg-violet-500/30 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
