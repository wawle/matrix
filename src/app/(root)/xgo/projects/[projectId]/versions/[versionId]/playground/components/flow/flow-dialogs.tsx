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
import { Maximize2, Minimize2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FlowDialogsProps {
  isDialogOpen: boolean;
  isAIPromptDialogOpen: boolean;
  newAgent: Partial<IAgent>;
  isConnectionDialogOpen: boolean;
  connectionType: "sequential" | "parallel" | "conditional";
  connectionCondition: string;
  isPromptExpanded: boolean;
  promptText: string;
  isGenerating: boolean;
  isOptimizing: boolean;
  isUpdatingExisting: boolean;

  setPromptText: (value: string) => void;
  setIsDialogOpen: (value: boolean) => void;
  setIsAIPromptDialogOpen: (value: boolean) => void;
  setNewAgent: (value: Partial<IAgent>) => void;
  onAddNewAgent: () => void;
  setIsConnectionDialogOpen: (value: boolean) => void;
  setConnectionType: (value: "sequential" | "parallel" | "conditional") => void;
  setConnectionCondition: (value: string) => void;
  onOptimizePrompt: () => void;
  onGenerateSchema: () => void;
  setIsUpdatingExisting: (value: boolean) => void;
  setIsPromptExpanded: (value: boolean) => void;
  onCompleteConnection: (
    type: "sequential" | "parallel" | "conditional",
    condition?: string
  ) => void;
}

export const FlowDialogs = ({
  isDialogOpen,
  isAIPromptDialogOpen,
  newAgent,
  isConnectionDialogOpen,
  connectionType,
  connectionCondition,
  isPromptExpanded,
  promptText,
  isGenerating,
  isOptimizing,
  isUpdatingExisting,
  setPromptText,
  setIsDialogOpen,
  setIsAIPromptDialogOpen,
  setIsPromptExpanded,
  setNewAgent,
  onAddNewAgent,
  setIsConnectionDialogOpen,
  setConnectionType,
  setConnectionCondition,
  onCompleteConnection,
  onOptimizePrompt,
  onGenerateSchema,
  setIsUpdatingExisting,
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

      {/* AI Prompt Dialog'u */}
      <AIPromptDialog
        isOpen={isAIPromptDialogOpen}
        onOpenChange={setIsAIPromptDialogOpen}
        isPromptExpanded={isPromptExpanded}
        setIsPromptExpanded={setIsPromptExpanded}
        promptText={promptText}
        setPromptText={setPromptText}
        isGenerating={isGenerating}
        isOptimizing={isOptimizing}
        onOptimizePrompt={onOptimizePrompt}
        onGenerateSchema={onGenerateSchema}
        isUpdatingExisting={isUpdatingExisting}
        setIsUpdatingExisting={setIsUpdatingExisting}
      />
    </>
  );
};

// AI Prompt Dialog komponenti
function AIPromptDialog({
  isOpen,
  onOpenChange,
  isPromptExpanded,
  setIsPromptExpanded,
  promptText,
  setPromptText,
  isGenerating,
  isOptimizing,
  onOptimizePrompt,
  onGenerateSchema,
  isUpdatingExisting,
  setIsUpdatingExisting,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isPromptExpanded: boolean;
  setIsPromptExpanded: (expanded: boolean) => void;
  promptText: string;
  setPromptText: (text: string) => void;
  isGenerating: boolean;
  isOptimizing: boolean;
  onOptimizePrompt: () => void;
  onGenerateSchema: () => void;
  isUpdatingExisting: boolean;
  setIsUpdatingExisting: (isUpdating: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={isPromptExpanded ? "w-full max-w-[800px] h-[80vh]" : ""}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>AI ile Şema Oluştur</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPromptExpanded(!isPromptExpanded)}
            >
              {isPromptExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </DialogTitle>
          <DialogDescription>
            Oluşturmak istediğiniz projenin senaryosunu ve gereksinimlerini
            detaylı bir şekilde açıklayın.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="create"
              onClick={() => setIsUpdatingExisting(false)}
            >
              Yeni Oluştur
            </TabsTrigger>
            <TabsTrigger
              value="update"
              onClick={() => setIsUpdatingExisting(true)}
            >
              Mevcut Şemayı Güncelle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-4">
            <div className="space-y-2">
              <Label>Proje Açıklaması</Label>
              <Textarea
                placeholder="Örnek: Bir e-ticaret sistemi istiyorum. Kullanıcılar ürünleri listeleyebilmeli, sepete ekleyebilmeli ve sipariş verebilmeli..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className={
                  isPromptExpanded
                    ? "h-[calc(60vh-200px)] resize-none"
                    : "h-[200px] resize-none"
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="update" className="mt-4">
            <div className="space-y-2">
              <Label>Güncelleme Açıklaması</Label>
              <Textarea
                placeholder="Örnek: Mevcut e-ticaret sistemine yorum ve değerlendirme özelliği eklemek istiyorum..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className={
                  isPromptExpanded
                    ? "h-[calc(60vh-200px)] resize-none"
                    : "h-[200px] resize-none"
                }
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onOptimizePrompt}
            disabled={!promptText.trim() || isOptimizing}
          >
            {isOptimizing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-foreground" />
                Prompt Optimize Ediliyor...
              </>
            ) : (
              "Promptu Optimize Et"
            )}
          </Button>
          <Button
            onClick={onGenerateSchema}
            disabled={!promptText.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-foreground" />
                {isUpdatingExisting ? "Güncelleniyor..." : "Oluşturuluyor..."}
              </>
            ) : isUpdatingExisting ? (
              "Güncelle"
            ) : (
              "Oluştur"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
