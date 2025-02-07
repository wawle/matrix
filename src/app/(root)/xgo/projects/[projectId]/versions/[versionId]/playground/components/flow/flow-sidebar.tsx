import React from "react";
import { Node } from "reactflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IAgent } from "@/lib/models/agent";

interface FlowSidebarProps {
  selectedNode: Node | null;
  isEditingAgent: boolean;
  setIsEditingAgent: (value: boolean) => void;
  onUpdateAgent: (updates: Partial<IAgent>) => void;
  onDeleteAgent: (agentId: string) => void;
}

export const FlowSidebar = ({
  selectedNode,
  isEditingAgent,
  setIsEditingAgent,
  onUpdateAgent,
  onDeleteAgent,
}: FlowSidebarProps) => {
  if (!selectedNode) return null;

  const agent = selectedNode.data as IAgent;

  return (
    <Sheet open={isEditingAgent} onOpenChange={setIsEditingAgent}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Edit Agent</SheetTitle>
          <SheetDescription>
            Make changes to the agent configuration.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={agent.name}
              onChange={(e) => onUpdateAgent({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={agent.title}
              onChange={(e) => onUpdateAgent({ title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea
              value={agent.instructions}
              onChange={(e) => onUpdateAgent({ instructions: e.target.value })}
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label>Model Provider</Label>
            <Input
              value={agent.model_provider}
              onChange={(e) =>
                onUpdateAgent({ model_provider: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Model Name</Label>
            <Input
              value={agent.model_name}
              onChange={(e) => onUpdateAgent({ model_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Temperature</Label>
            <Input
              type="number"
              value={agent.temperature}
              onChange={(e) =>
                onUpdateAgent({ temperature: parseFloat(e.target.value) })
              }
              min={0}
              max={1}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={agent.max_tokens}
              onChange={(e) =>
                onUpdateAgent({ max_tokens: parseInt(e.target.value) })
              }
              min={1}
            />
          </div>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              onDeleteAgent(selectedNode.id);
              setIsEditingAgent(false);
            }}
          >
            Delete Agent
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
