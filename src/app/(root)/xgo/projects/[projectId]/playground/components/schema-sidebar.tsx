"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SchemaField } from "./schema-field";
import { SchemaRelation } from "./schema-relation";
import { Edge, Node } from "reactflow";

interface SchemaSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedNode: Node | null;
  selectedField: any;
  setSelectedField: (field: any) => void;
  isEditingField: boolean;
  setIsEditingField: (editing: boolean) => void;
  nodes: Node[];
  edges: Edge[];
  onUpdateNode: (updates: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateField: (fieldId: string, updates: any) => void;
  onDeleteField: (fieldId: string) => void;
  onAddField: () => void;
  onUpdateRelation: (edgeId: string, updates: any) => void;
  onDeleteRelation: (edgeId: string) => void;
}

export function SchemaSidebar({
  isOpen,
  setIsOpen,
  selectedNode,
  selectedField,
  setSelectedField,
  isEditingField,
  setIsEditingField,
  nodes,
  edges,
  onUpdateNode,
  onDeleteNode,
  onUpdateField,
  onDeleteField,
  onAddField,
  onUpdateRelation,
  onDeleteRelation,
}: SchemaSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-[400px] p-0 z-[9999]">
        <div className="flex h-full flex-col">
          <div className="border-b p-4 flex items-center">
            <SheetTitle>
              {selectedNode ? selectedNode.data.label : "Şema Özellikleri"}
            </SheetTitle>

            {selectedNode && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDeleteNode(selectedNode.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedNode ? (
              <Tabs defaultValue="fields" className="h-full">
                <TabsList className="sticky top-0 z-10 w-full grid grid-cols-2">
                  <TabsTrigger value="fields">Alanlar</TabsTrigger>
                  <TabsTrigger value="relations">İlişkiler</TabsTrigger>
                </TabsList>
                <TabsContent value="fields" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Şema Adı</Label>
                    </div>
                    <Input
                      value={selectedNode.data.name}
                      onChange={(e) =>
                        onUpdateNode({
                          ...selectedNode.data,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Açıklama</Label>
                    <Textarea
                      value={selectedNode.data.description}
                      onChange={(e) =>
                        onUpdateNode({
                          ...selectedNode.data,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Alanlar</Label>
                      <Button variant="outline" size="sm" onClick={onAddField}>
                        Yeni Alan
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedNode.data.fields.map((field: any) => (
                        <SchemaField
                          key={field.id}
                          field={field}
                          isEditing={isEditingField}
                          nodes={nodes}
                          selectedNode={selectedNode}
                          onUpdate={onUpdateField}
                          onDelete={onDeleteField}
                          onEdit={(field) => {
                            setSelectedField(field);
                            setIsEditingField(true);
                          }}
                          onCancelEdit={() => {
                            setSelectedField(null);
                            setIsEditingField(false);
                          }}
                          selectedField={selectedField}
                          setSelectedField={setSelectedField}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="relations" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <div className="grid gap-2">
                      {edges
                        .filter(
                          (edge) =>
                            edge.source === selectedNode.id ||
                            edge.target === selectedNode.id
                        )
                        .map((edge) => (
                          <SchemaRelation
                            key={edge.id}
                            edge={edge}
                            nodes={nodes}
                            selectedNode={selectedNode}
                            onUpdateRelation={onUpdateRelation}
                            onDeleteRelation={onDeleteRelation}
                          />
                        ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center text-muted-foreground">
                Düzenlemek için bir şema seçin
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
