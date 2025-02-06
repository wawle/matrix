import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IAgent } from "@/lib/models/agent";

interface FlowDialogsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  newAgent: Partial<IAgent>;
  setNewAgent: (value: Partial<IAgent>) => void;
  onAddNewAgent: () => void;
  isConnectionDialogOpen: boolean;
  setIsConnectionDialogOpen: (value: boolean) => void;
  connectionType: "sequential" | "parallel" | "conditional";
  setConnectionType: (value: "sequential" | "parallel" | "conditional") => void;
  connectionCondition: string;
  setConnectionCondition: (value: string) => void;
  onCompleteConnection: (
    type: "sequential" | "parallel" | "conditional",
    condition?: string
  ) => void;
}

export const FlowDialogs = ({
  isDialogOpen,
  setIsDialogOpen,
  newAgent,
  setNewAgent,
  onAddNewAgent,
  isConnectionDialogOpen,
  setIsConnectionDialogOpen,
  connectionType,
  setConnectionType,
  connectionCondition,
  setConnectionCondition,
  onCompleteConnection,
}: FlowDialogsProps) => {
  return (
    <>
      {/* New Agent Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              Create a new agent for your flow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newAgent.name}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newAgent.title}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea
                value={newAgent.instructions}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, instructions: e.target.value })
                }
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Model Provider</Label>
              <Select
                value={newAgent.model_provider}
                onValueChange={(value) =>
                  setNewAgent({ ...newAgent, model_provider: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Model Name</Label>
              <Select
                value={newAgent.model_name}
                onValueChange={(value) =>
                  setNewAgent({ ...newAgent, model_name: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">
                    Claude 3 Sonnet
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onAddNewAgent}>Add Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connection Dialog */}
      <Dialog
        open={isConnectionDialogOpen}
        onOpenChange={setIsConnectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Agents</DialogTitle>
            <DialogDescription>
              Configure how these agents will interact.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Connection Type</Label>
              <Select
                value={connectionType}
                onValueChange={(value: any) => setConnectionType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select connection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential (→)</SelectItem>
                  <SelectItem value="parallel">Parallel (⇉)</SelectItem>
                  <SelectItem value="conditional">Conditional (?)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {connectionType === "conditional" && (
              <div className="space-y-2">
                <Label>Condition</Label>
                <Textarea
                  value={connectionCondition}
                  onChange={(e) => setConnectionCondition(e.target.value)}
                  placeholder="Enter a condition for this connection..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Example: "if response.sentiment === 'positive'"
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() =>
                onCompleteConnection(connectionType, connectionCondition)
              }
            >
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
