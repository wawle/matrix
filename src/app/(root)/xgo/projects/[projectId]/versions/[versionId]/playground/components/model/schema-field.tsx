"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Edit, Trash2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IField {
  id: string;
  name: string;
  label?: string;
  type:
    | "string"
    | "number"
    | "date"
    | "boolean"
    | "object"
    | "array"
    | "reference";
  required: boolean;
  default: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customValidation?: string;
  };
}

// Field type'ları için renk ve etiket tanımlamaları
const fieldTypeBadgeVariants: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  string: { label: "String", variant: "default" },
  number: { label: "Number", variant: "secondary" },
  date: { label: "Date", variant: "outline" },
  boolean: { label: "Boolean", variant: "secondary" },
  object: { label: "Object", variant: "outline" },
  array: { label: "Array", variant: "outline" },
  reference: { label: "Reference", variant: "destructive" },
};

interface SchemaFieldProps {
  field: IField;
  isEditing: boolean;
  nodes: any[];
  selectedNode: any;
  onUpdate: (fieldId: string, updates: any) => void;
  onDelete: (fieldId: string) => void;
  onEdit: (field: IField) => void;
  onCancelEdit: () => void;
  selectedField: IField | null;
  setSelectedField: (field: IField | null) => void;
}

export function SchemaField({
  field,
  isEditing,
  nodes,
  selectedNode,
  onUpdate,
  onDelete,
  onEdit,
  onCancelEdit,
  selectedField,
  setSelectedField,
}: SchemaFieldProps) {
  if (isEditing && selectedField?.id === field.id) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Alan adı"
            value={selectedField.name}
            onChange={(e) =>
              setSelectedField({
                ...selectedField,
                name: e.target.value,
              })
            }
          />
          <Select
            value={selectedField.type}
            onValueChange={(value: any) =>
              setSelectedField({
                ...selectedField,
                type: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tip seç" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="object">Object</SelectItem>
              <SelectItem value="array">Array</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedField.type === "reference" && (
          <div className="space-y-2">
            <Label>Referans Şema</Label>
            <Select
              value={selectedField.label}
              onValueChange={(value) =>
                setSelectedField({
                  ...selectedField,
                  label: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Şema seç" />
              </SelectTrigger>
              <SelectContent>
                {nodes
                  .filter((node) => node.id !== selectedNode?.id)
                  .map((node) => (
                    <SelectItem key={node.id} value={node.data.label}>
                      {node.data.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(selectedField.type === "string" ||
          selectedField.type === "number") && (
          <div className="space-y-2">
            <Label>Validasyon Kuralları</Label>
            {selectedField.type === "string" && (
              <Input
                placeholder="Regex pattern (örn: ^[A-Za-z]+$)"
                value={selectedField.validation?.pattern || ""}
                onChange={(e) =>
                  setSelectedField({
                    ...selectedField,
                    validation: {
                      ...selectedField.validation,
                      pattern: e.target.value,
                    },
                  })
                }
              />
            )}
            {selectedField.type === "number" && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min değer"
                  value={selectedField.validation?.min || ""}
                  onChange={(e) =>
                    setSelectedField({
                      ...selectedField,
                      validation: {
                        ...selectedField.validation,
                        min: Number(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max değer"
                  value={selectedField.validation?.max || ""}
                  onChange={(e) =>
                    setSelectedField({
                      ...selectedField,
                      validation: {
                        ...selectedField.validation,
                        max: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>Varsayılan Değer</Label>
          <Input
            placeholder="Varsayılan değer"
            value={selectedField.default || ""}
            onChange={(e) =>
              setSelectedField({
                ...selectedField,
                default: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={selectedField.required}
              onCheckedChange={(checked: boolean) =>
                setSelectedField({
                  ...selectedField,
                  required: checked,
                })
              }
            />
            <Label>Zorunlu</Label>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate(field.id, selectedField)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2 w-full">
            {/* İlk satır - Alan adı */}
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{field.name}</CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(field)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(field.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* İkinci satır - Diğer bilgiler */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={
                  fieldTypeBadgeVariants[field.type]?.variant || "default"
                }
              >
                {fieldTypeBadgeVariants[field.type]?.label || field.type}
              </Badge>

              {field.required ? (
                <Badge variant="destructive" className="h-5">
                  Zorunlu
                </Badge>
              ) : (
                <Badge variant="secondary" className="h-5">
                  Opsiyonel
                </Badge>
              )}

              {field.type === "reference" && field.label && (
                <Badge variant="outline" className="h-5">
                  {field.label}
                </Badge>
              )}

              {field.default && (
                <Badge variant="outline" className="h-5">
                  Varsayılan: {field.default}
                </Badge>
              )}

              {field.validation && (
                <>
                  {field.validation.pattern && (
                    <Badge variant="outline" className="h-5">
                      Pattern: {field.validation.pattern}
                    </Badge>
                  )}
                  {field.validation.min !== undefined && (
                    <Badge variant="outline" className="h-5">
                      Min: {field.validation.min}
                    </Badge>
                  )}
                  {field.validation.max !== undefined && (
                    <Badge variant="outline" className="h-5">
                      Max: {field.validation.max}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
