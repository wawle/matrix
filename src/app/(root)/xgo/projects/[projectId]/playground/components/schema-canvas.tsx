"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeTypes,
  Panel,
} from "reactflow";
import { useHotkeys } from "react-hotkeys-hook";
import { SchemaContextMenu } from "./schema-context-menu";
import { EdgeContextMenu } from "./edge-context-menu";
import { SchemaActionButtons } from "./schema-action-buttons";

interface SchemaCanvasProps {
  nodes: Node[];
  edges: Edge[];
  isFullscreen: boolean;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onSelectionChange: (params: { nodes: Node[] }) => void;
  onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  toggleFullscreen: () => void;
  nodeTypes: NodeTypes;
  contextMenu: {
    id: string;
    x: number;
    y: number;
  } | null;
  onDeleteModule: (id: string) => void;
  onEditModule: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onEditEdge: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isConnectionDialogOpen: boolean;
  setIsConnectionDialogOpen: (open: boolean) => void;
}

export function SchemaCanvas({
  nodes,
  edges,
  isFullscreen,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelectionChange,
  onNodeContextMenu,
  onPaneClick,
  onEdgeClick,
  toggleFullscreen,
  nodeTypes,
  contextMenu,
  onDeleteModule,
  onEditModule,
  onDeleteEdge,
  onEditEdge,
  isOpen,
  setIsOpen,
  isConnectionDialogOpen,
  setIsConnectionDialogOpen,
}: SchemaCanvasProps) {
  const [edgeContextMenu, setEdgeContextMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  // Kısayol tuşları için useHotkeys hook'u
  useHotkeys("alt+1", () => setIsOpen(!isOpen), [isOpen]);
  useHotkeys(
    "alt+2",
    () => setIsConnectionDialogOpen(!isConnectionDialogOpen),
    [isConnectionDialogOpen]
  );
  useHotkeys("alt+f", () => toggleFullscreen(), []);

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setEdgeContextMenu({
        id: edge.id,
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );

  const handlePaneClick = () => {
    setEdgeContextMenu(null);
    onPaneClick();
  };

  return (
    <div className="react-flow-wrapper relative h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={handlePaneClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <SchemaActionButtons
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />
        </Panel>
      </ReactFlow>

      <EdgeContextMenu
        contextMenu={edgeContextMenu}
        onDeleteEdge={onDeleteEdge}
        onEditEdge={onEditEdge}
      />
    </div>
  );
}
