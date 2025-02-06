"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edge, Node } from "reactflow";

interface SchemaRelationProps {
  edge: Edge;
  nodes: Node[];
  selectedNode: Node;
  onUpdateRelation: (edgeId: string, updates: any) => void;
  onDeleteRelation: (edgeId: string) => void;
}

export function SchemaRelation({
  edge,
  nodes,
  selectedNode,
  onUpdateRelation,
  onDeleteRelation,
}: SchemaRelationProps) {
  const relatedNode = nodes.find(
    (n) =>
      (edge.source === selectedNode.id && n.id === edge.target) ||
      (edge.target === selectedNode.id && n.id === edge.source)
  );

  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">{relatedNode?.data.label}</CardTitle>
            <CardDescription className="text-xs">{edge.label}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={edge.data?.relationType}
              onValueChange={(value: "oneToOne" | "oneToMany" | "manyToMany") =>
                onUpdateRelation(edge.id, {
                  relationType: value,
                })
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oneToOne">1:1</SelectItem>
                <SelectItem value="oneToMany">1:N</SelectItem>
                <SelectItem value="manyToMany">N:N</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteRelation(edge.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
