"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Maximize2, Minimize2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlertModal from "@/components/modals/alert-modal";

interface SchemaDialogsProps {
  // Yeni Şema Dialog'u
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  newModule: {
    name: string;
    description: string;
    isActive: boolean;
  };
  setNewModule: (module: any) => void;
  onAddNewModule: () => void;

  // İlişki Dialog'u
  isConnectionDialogOpen: boolean;
  setIsConnectionDialogOpen: (open: boolean) => void;
  newConnectionType: "oneToOne" | "oneToMany" | "manyToMany";
  setNewConnectionType: (type: "oneToOne" | "oneToMany" | "manyToMany") => void;
  onCreateConnection: () => void;

  // AI Prompt Dialog'u
  isAIPromptDialogOpen: boolean;
  setIsAIPromptDialogOpen: (open: boolean) => void;
  isPromptExpanded: boolean;
  setIsPromptExpanded: (expanded: boolean) => void;
  promptText: string;
  setPromptText: (text: string) => void;
  isGenerating: boolean;
  isOptimizing: boolean;
  onOptimizePrompt: () => void;
  onGenerateSchema: () => void;

  // Silme Dialog'u
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  isDeleting: boolean;
  onConfirmDelete: () => void;

  // Güncelleme Dialog'u
  isUpdatingExisting: boolean;
  setIsUpdatingExisting: (isUpdating: boolean) => void;
}

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

export function SchemaDialogs({
  // Yeni Şema Dialog'u
  isDialogOpen,
  setIsDialogOpen,
  newModule,
  setNewModule,
  onAddNewModule,

  // İlişki Dialog'u
  isConnectionDialogOpen,
  setIsConnectionDialogOpen,
  newConnectionType,
  setNewConnectionType,
  onCreateConnection,

  // AI Prompt Dialog'u
  isAIPromptDialogOpen,
  setIsAIPromptDialogOpen,
  isPromptExpanded,
  setIsPromptExpanded,
  promptText,
  setPromptText,
  isGenerating,
  isOptimizing,
  onOptimizePrompt,
  onGenerateSchema,

  // Silme Dialog'u
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  isDeleting,
  onConfirmDelete,

  // Güncelleme Dialog'u
  isUpdatingExisting,
  setIsUpdatingExisting,
}: SchemaDialogsProps) {
  return (
    <>
      {/* Yeni Şema Dialog'u */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Şema Oluştur</DialogTitle>
            <DialogDescription>
              Yeni bir şema oluşturmak için aşağıdaki bilgileri doldurun.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Şema Adı</Label>
              <Input
                id="name"
                placeholder="Şema adını girin..."
                value={newModule.name}
                onChange={(e) =>
                  setNewModule((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                placeholder="Şema açıklamasını girin..."
                value={newModule.description}
                onChange={(e) =>
                  setNewModule((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={onAddNewModule}
              disabled={!newModule.name}
            >
              Oluştur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* İlişki Dialog'u */}
      <Dialog
        open={isConnectionDialogOpen}
        onOpenChange={setIsConnectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İlişki Tipi Seçin</DialogTitle>
            <DialogDescription>
              Oluşturmak istediğiniz ilişki tipini seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>İlişki Tipi</Label>
              <Select
                value={newConnectionType}
                onValueChange={(
                  value: "oneToOne" | "oneToMany" | "manyToMany"
                ) => setNewConnectionType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oneToOne">Bire Bir (1:1)</SelectItem>
                  <SelectItem value="oneToMany">Bire Çok (1:N)</SelectItem>
                  <SelectItem value="manyToMany">Çoka Çok (N:N)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConnectionDialogOpen(false);
              }}
            >
              İptal
            </Button>
            <Button onClick={onCreateConnection}>Oluştur</Button>
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

      {/* Silme Dialog'u */}
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
        loading={isDeleting}
      />
    </>
  );
}
