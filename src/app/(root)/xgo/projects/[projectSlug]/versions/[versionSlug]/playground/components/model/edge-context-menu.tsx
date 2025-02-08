"use client";

import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Trash2 } from "lucide-react";

interface EdgeContextMenuProps {
  contextMenu: {
    id: string;
    x: number;
    y: number;
  } | null;
  onDeleteEdge: (id: string) => void;
  onEditEdge: (id: string) => void;
}

export function EdgeContextMenu({
  contextMenu,
  onDeleteEdge,
  onEditEdge,
}: EdgeContextMenuProps) {
  if (!contextMenu) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: contextMenu.x,
        top: contextMenu.y,
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div style={{ width: 1, height: 1 }} />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onEditEdge(contextMenu.id)}
          >
            <Edit className="h-4 w-4" />
            İlişkiyi Düzenle
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={() => onDeleteEdge(contextMenu.id)}
          >
            <Trash2 className="h-4 w-4" />
            İlişkiyi Sil
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
