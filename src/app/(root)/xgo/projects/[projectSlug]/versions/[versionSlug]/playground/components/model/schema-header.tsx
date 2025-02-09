"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Wand2, Plus, Cpu, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { templates } from "@/lib/constants/templates";
import { useParams } from "next/navigation";

interface SchemaHeaderProps {
  isAutoSaveEnabled: boolean;
  isGeneratingApp: boolean;
  isSaving: boolean;
  onPresetChange: (value: string) => void;
  onAutoSaveChange: (checked: boolean) => void;
  onSave: () => void;
  onNewSchema: () => void;
  onAIPrompt: () => void;
  onGenerateApp: () => void;
}

export function SchemaHeader({
  isAutoSaveEnabled,
  isGeneratingApp,
  isSaving,
  onPresetChange,
  onAutoSaveChange,
  onSave,
  onNewSchema,
  onAIPrompt,
  onGenerateApp,
}: SchemaHeaderProps) {
  const { projectSlug, versionSlug } = useParams();
  const defaultValue = `${projectSlug}-${versionSlug}`;
  return (
    <div className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-2">
        <Select value={defaultValue} onValueChange={onPresetChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Şablon seç..." />
          </SelectTrigger>
          <SelectContent>
            {/* Varsayılan template'ler */}
            <SelectItem value={defaultValue}>{defaultValue}</SelectItem>
            <SelectGroup>
              <SelectLabel>Varsayılan Şablonlar</SelectLabel>
              {templates.models.map((template) => (
                <SelectItem
                  key={template.id}
                  value={template.id}
                  className="text-xs"
                >
                  {template.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center bg-background/10 rounded-md border p-0.5 gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            title="Kaydet"
            onClick={onSave}
            disabled={isSaving}
            className="h-7 w-7"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>

          <Separator orientation="vertical" className="h-7" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  checked={isAutoSaveEnabled}
                  onCheckedChange={onAutoSaveChange}
                  id="auto-save"
                  className={cn(
                    "mx-0.5 h-5 w-9 [&>span]:h-4 [&>span]:w-4",
                    isAutoSaveEnabled ? "bg-green-400" : "bg-muted"
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Otomatik Kayıt (3 dk)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onGenerateApp}>
                {isGeneratingApp ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Cpu className="mr-2 h-4 w-4" />
                )}
                App Builder
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>App oluştur</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onAIPrompt}>
                <Wand2 className="mr-2 h-4 w-4" />
                AI Helper
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>AI ile Şema Oluştur</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="default" size="sm" onClick={onNewSchema}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Şema
          </Button>
        </TooltipProvider>
      </div>
    </div>
  );
}
