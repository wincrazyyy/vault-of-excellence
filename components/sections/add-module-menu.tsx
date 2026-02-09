"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  CreditCard, 
  Minus, 
  Grid3X3 
} from "lucide-react";
import type { Module } from "@/lib/sections/types";

interface AddModuleMenuProps {
  onAdd: (type: Module["type"]) => void;
  includeGrid?: boolean;
  buttonText?: string;
  align?: "center" | "end" | "start";
}

export function AddModuleMenu({ 
  onAdd, 
  includeGrid = false, 
  buttonText = "Add Module",
  align = "center"
}: AddModuleMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        <DropdownMenuItem onClick={() => onAdd("rte")}>
          <Type className="mr-2 h-4 w-4" /> Rich Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("image")}>
          <ImageIcon className="mr-2 h-4 w-4" /> Image
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("miniCard")}>
          <CreditCard className="mr-2 h-4 w-4" /> Mini Card
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("divider")}>
          <Minus className="mr-2 h-4 w-4" /> Divider
        </DropdownMenuItem>
        {includeGrid && (
          <DropdownMenuItem onClick={() => onAdd("grid")}>
            <Grid3X3 className="mr-2 h-4 w-4" /> Grid Layout
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}