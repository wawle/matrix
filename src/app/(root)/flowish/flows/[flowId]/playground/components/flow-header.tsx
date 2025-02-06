import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IAgent } from "@/lib/models/agent";

interface FlowHeaderProps {
  selectedAgent: string;
  agents: IAgent[];
  isAutoSaveEnabled: boolean;
  onAgentChange: (value: string) => void;
  onAutoSaveChange: (value: boolean) => void;
  onNewAgent: () => void;
}

export const FlowHeader = ({
  selectedAgent,
  agents,
  isAutoSaveEnabled,
  onAgentChange,
  onAutoSaveChange,
  onNewAgent,
}: FlowHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Select value={selectedAgent} onValueChange={onAgentChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onNewAgent}>Add Agent</Button>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm">Auto Save</span>
        <Switch
          checked={isAutoSaveEnabled}
          onCheckedChange={onAutoSaveChange}
        />
      </div>
    </div>
  );
};
