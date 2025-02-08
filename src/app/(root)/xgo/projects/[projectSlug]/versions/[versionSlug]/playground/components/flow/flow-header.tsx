import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IVersion, VersionType } from "@/lib/models/version";
import { templates } from "@/lib/constants/templates";
import { Plus, Save, Wand2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IAgentData } from "@/lib/types/xgo/agents";
import { Node } from "reactflow";

interface FlowHeaderProps {
  selectedPreset: string;
  isAutoSaveEnabled: boolean;

  onPresetChange: (value: string) => void;
  onAutoSaveChange: (value: boolean) => void;
  onSave: () => void;
  onNewNode: () => void;
  onAIPrompt: () => void;
}

export const FlowHeader = ({
  selectedPreset,
  isAutoSaveEnabled,
  onPresetChange,
  onAutoSaveChange,
  onSave,
  onNewNode,
  onAIPrompt,
}: FlowHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Select value={selectedPreset} onValueChange={onPresetChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Şablon seç..." />
          </SelectTrigger>
          <SelectContent>
            {/* Varsayılan template'ler */}
            <SelectGroup>
              <SelectLabel>Varsayılan Şablonlar</SelectLabel>
              {templates.flows.map((template) => (
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
            className="h-7 w-7"
          >
            <Save className="h-4 w-4" />
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
              <Button variant="outline" size="sm" onClick={onAIPrompt}>
                <Wand2 className="mr-2 h-4 w-4" />
                AI Helper
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>AI ile Şema Oluştur</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="default" size="sm" onClick={onNewNode}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Agent
          </Button>
        </TooltipProvider>
      </div>
    </div>
  );
};
