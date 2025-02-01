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
import {
  Save,
  Share2,
  Trash2,
  Wand2,
  Database,
  FileJson,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IVersion } from "@/lib/models/version";
import { templates } from "@/lib/constants/templates";

interface SchemaHeaderProps {
  selectedPreset: string;
  versions: IVersion[];
  isAutoSaveEnabled: boolean;
  onPresetChange: (value: string) => void;
  onAutoSaveChange: (checked: boolean) => void;
  onSave: () => void;
  onExport: () => void;
  onDelete: (versionId: string) => void;
  onGenerateMongoSchema: () => void;
  onGenerateTypeScript: () => void;
  onNewSchema: () => void;
  onAIPrompt: () => void;
  selectedNode: any | null;
}

export function SchemaHeader({
  selectedPreset,
  versions,
  isAutoSaveEnabled,
  onPresetChange,
  onAutoSaveChange,
  onSave,
  onExport,
  onDelete,
  onGenerateMongoSchema,
  onGenerateTypeScript,
  onNewSchema,
  onAIPrompt,
  selectedNode,
}: SchemaHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-2">
        <Select value={selectedPreset} onValueChange={onPresetChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Şablon seç..." />
          </SelectTrigger>
          <SelectContent>
            {/* Versions */}
            {versions.length > 0 && (
              <SelectGroup>
                <SelectLabel>Versiyonlar</SelectLabel>
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            {/* Varsayılan template'ler */}
            <SelectGroup>
              <SelectLabel>Varsayılan Şablonlar</SelectLabel>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
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
            className="h-7 w-7"
          >
            <Save className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-7" />

          <Button
            variant="ghost"
            size="icon"
            title="Dışa Aktar"
            onClick={onExport}
            className="h-7 w-7"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          {selectedPreset && (
            <>
              <Separator orientation="vertical" className="h-7" />
              <Button
                variant="ghost"
                size="icon"
                title="Şablonu Sil"
                className="h-7 w-7"
                onClick={() => onDelete(selectedPreset)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}

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
                    isAutoSaveEnabled ? "bg-xgo" : "bg-muted"
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
              <Button variant="outline" size="sm" onClick={onAIPrompt}>
                <Wand2 className="mr-2 h-4 w-4" />
                AI
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>AI ile Şema Oluştur</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateMongoSchema}
                disabled={!selectedNode}
              >
                <Database className="mr-2 h-4 w-4" />
                MongoDB
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>MongoDB Şeması Oluştur</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateTypeScript}
                disabled={!selectedNode}
              >
                <FileJson className="mr-2 h-4 w-4" />
                TypeScript
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>TypeScript Tiplerini Oluştur</p>
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
