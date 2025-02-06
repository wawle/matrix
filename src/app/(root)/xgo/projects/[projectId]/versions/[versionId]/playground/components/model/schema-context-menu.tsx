"use client";

import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Edit, Trash2 } from "lucide-react";

interface SchemaContextMenuProps {
  children: React.ReactNode;
  onDeleteModule: () => void;
  onEditModule: () => void;
}

export function SchemaContextMenu({
  children,
  onDeleteModule,
  onEditModule,
}: SchemaContextMenuProps) {
  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={onEditModule}
          >
            <Edit className="h-4 w-4" />
            Düzenle
          </ContextMenuItem>
          <ContextMenuItem
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={onDeleteModule}
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
