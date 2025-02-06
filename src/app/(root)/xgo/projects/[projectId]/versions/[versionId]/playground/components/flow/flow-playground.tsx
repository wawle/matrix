"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  useEdgesState,
  useNodesState,
  Connection,
  Node,
  Edge,
  MarkerType,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

// Alt bileşen importları
import { FlowNode } from "./flow-node";
import { FlowHeader } from "./flow-header";
import { FlowCanvas } from "./flow-canvas";
import { FlowSidebar } from "./flow-sidebar";
import { FlowDialogs } from "./flow-dialogs";
import { IAgent } from "@/lib/models/agent";
import { IVersion } from "@/lib/models/version";
import { IProject } from "@/lib/models/project";
import { templates } from "@/lib/constants/templates";
import {
  generatePromptForVersion,
  generateVersionAction,
  generateVersionFromTemplate,
  setAutoSaveState,
  updateAppFromVersion,
} from "@/lib/actions/version";
import { toast } from "sonner";
import { INode } from "@/lib/models/node";
import { IEdge } from "@/lib/models/edge";

interface Props {
  versions: IVersion[];
  defaultVersion: IVersion;
  project: IProject;
  defaultAutoSave: boolean;
}

type ConnectionType = "sequential" | "parallel" | "conditional";

interface CustomEdgeData {
  type: ConnectionType;
  condition?: string;
}

export default function FlowPlayground({
  versions,
  defaultVersion,
  project,
  defaultAutoSave,
}: Props) {
  // Genel durum yönetimi
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(
    defaultVersion.id as string
  );

  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(defaultAutoSave);

  // Dialog durumları
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [isAIPromptDialogOpen, setIsAIPromptDialogOpen] = useState(false);

  // AI ile ilgili durumlar
  const [promptText, setPromptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isUpdatingExisting, setIsUpdatingExisting] = useState(false);

  // Agent durumları
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<IAgent>>({
    name: "",
    title: "",
    instructions: "",
    is_public: false,
    model_provider: "openai",
    model_name: "gpt-3.5-turbo",
  });

  // Bağlantı durumları
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null
  );
  const [connectionType, setConnectionType] =
    useState<ConnectionType>("sequential");
  const [connectionCondition, setConnectionCondition] = useState<string>("");

  // ReactFlow durumları
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    defaultVersion.nodes.map((node: any) => {
      const flowNode = {
        ...node,
        type: "agent",
        data: {
          ...node.data,
          onWidthChange: (width: number) =>
            updateNodeDimensions(node.id, width),
          onHeightChange: (height: number) =>
            updateNodeDimensions(node.id, undefined, height),
        },
      };

      flowNode.data.onEdit = () => {
        setSelectedNode(flowNode);
        setIsEditingAgent(true);
      };

      return flowNode;
    })
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    defaultVersion.edges.map((edge: any) => ({
      ...edge,
      style: {
        stroke: "hsl(var(--primary))",
      },
    }))
  );

  // Node boyutlarını güncelleme
  const updateNodeDimensions = useCallback(
    (nodeId: string, width?: number, height?: number) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...(width !== undefined && { width }),
                ...(height !== undefined && { height }),
              },
            };
          }
          return node;
        })
      );
    },
    []
  );

  // Node tipleri tanımı
  const nodeTypes = useMemo(
    () => ({
      agent: FlowNode,
    }),
    []
  );

  // Bağlantı oluşturma
  const onConnect = useCallback((connection: Connection) => {
    setPendingConnection(connection);
    setIsConnectionDialogOpen(true);
  }, []);

  // Bağlantı tamamlama
  const completeConnection = useCallback(
    (type: ConnectionType, condition?: string) => {
      if (!pendingConnection?.source || !pendingConnection?.target) return;

      const newEdge: Edge<CustomEdgeData> = {
        id: `${pendingConnection.source}-${pendingConnection.target}`,
        source: pendingConnection.source,
        target: pendingConnection.target,
        type: "custom",
        animated: true,
        data: {
          type,
          condition,
        },
        style: {
          stroke:
            type === "sequential"
              ? "hsl(var(--primary))"
              : type === "parallel"
              ? "hsl(var(--success))"
              : "hsl(var(--warning))",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        label: type === "sequential" ? "→" : type === "parallel" ? "⇉" : "?",
      };

      setEdges((eds) => [...eds, newEdge]);
      setPendingConnection(null);
      setConnectionType("sequential");
      setConnectionCondition("");
      setIsConnectionDialogOpen(false);
    },
    [pendingConnection]
  );

  // Edge silme
  const onEdgeDelete = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, []);

  // Edge güncelleme
  const updateEdge = useCallback(
    (edgeId: string, updates: Partial<CustomEdgeData>) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            const currentData = (edge as Edge<CustomEdgeData>).data || {
              type: "sequential" as ConnectionType,
            };
            const updatedEdge: Edge<CustomEdgeData> = {
              ...edge,
              data: {
                ...currentData,
                type: updates.type || currentData.type,
                condition: updates.condition,
              },
              style: {
                ...edge.style,
                stroke:
                  updates.type === "sequential"
                    ? "hsl(var(--primary))"
                    : updates.type === "parallel"
                    ? "hsl(var(--success))"
                    : "hsl(var(--warning))",
              },
              label:
                updates.type === "sequential"
                  ? "→"
                  : updates.type === "parallel"
                  ? "⇉"
                  : "?",
            };
            return updatedEdge;
          }
          return edge;
        })
      );
    },
    []
  );

  // Node seçimi
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const selected = selectedNodes[0];
      if (selected) {
        const currentNode = nodes.find((n) => n.id === selected.id);
        setSelectedNode(currentNode || null);
      } else {
        setSelectedNode(null);
      }
    },
    [nodes]
  );

  // Yeni agent ekleme
  const addNewAgent = useCallback(() => {
    if (!newAgent.name) return;

    const newNode: Node = {
      id: Date.now().toString(),
      type: "agent",
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: newAgent,
    };

    setNodes((nds) => [...nds, newNode]);
    setNewAgent({
      name: "",
      title: "",
      instructions: "",
      is_public: false,
      model_provider: "openai",
      model_name: "gpt-3.5-turbo",
    });
    setIsDialogOpen(false);
  }, [newAgent]);

  // Agent güncelleme
  const updateAgent = useCallback(
    (updates: Partial<IAgent>) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updates,
                onEdit: () => {
                  setSelectedNode(node);
                  setIsEditingAgent((prev) => !prev);
                },
              },
            };
          }
          return node;
        })
      );
    },
    [selectedNode]
  );

  // Agent silme
  const deleteAgent = useCallback((agentId: string) => {
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== agentId && edge.target !== agentId)
    );

    setNodes((nds) => nds.filter((node) => node.id !== agentId));

    if (selectedNode?.id === agentId) {
      setSelectedNode(null);
    }
  }, []);

  /**
   * @function onPresetChange
   * @description Seçili şablonu değiştirir ve yeni şablonu yükler
   * @param {string} value - Seçilen şablon ID'si
   */
  const onPresetChange = useCallback(
    (value: string) => {
      const defaultTemplate = templates.flows.find((t) => t.id === value);
      if (defaultTemplate) {
        const clonedNodes = JSON.parse(JSON.stringify(defaultTemplate.nodes));
        const nodesWithHandlers = clonedNodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            onWidthChange: (width: number) =>
              updateNodeDimensions(node.id, width),
            onHeightChange: (height: number) =>
              updateNodeDimensions(node.id, undefined, height),
          },
        }));
        setNodes(nodesWithHandlers);
        setEdges(JSON.parse(JSON.stringify(defaultTemplate.edges)));
        setSelectedPreset(value);
      }

      const selectedVersion = versions.find((t) => t.id === value);
      if (selectedVersion) {
        setNodes(selectedVersion.nodes);
        setEdges(selectedVersion.edges);
        setSelectedPreset(value);
      }
    },
    [templates, selectedPreset, updateNodeDimensions]
  );

  const handleAutoSaveChange = useCallback(async (state: boolean) => {
    setIsAutoSaveEnabled(state);
    await setAutoSaveState(state);
  }, []);

  /**
   * @function updateProject
   * @description Projeyi güncelleyerek değişiklikleri kaydeder
   */
  const updateProject = useCallback(async () => {
    const selectedVersion = versions.find((t) => t.id === selectedPreset);

    // If selected version is not found, generate a new version from template
    if (!selectedVersion) {
      // Find the selected template
      const selectedTemplate = templates.flows.find(
        (t) => t.id === selectedPreset
      );

      // If selected template is not found, show an error message
      if (!selectedTemplate) {
        toast.error("Seçili şablon bulunamadı.");
        return;
      }

      // Generate a new version from the selected template
      const result = await generateVersionFromTemplate(
        selectedTemplate,
        project.id
      );
      if (result.success && result.version) {
        setSelectedPreset(result.version.id);

        toast.success("Yeni şema oluşturuldu.");
      } else {
        toast.error("Yeni şema oluşturulurken bir hata oluştu.");
      }
      return;
    }

    try {
      const updatedVersion = {
        ...selectedVersion,
        nodes: nodes as INode[],
        edges: edges as IEdge[],
      };
      const result = await updateAppFromVersion(updatedVersion, project.id);
      if (result.success) {
        toast.success("Proje başarıyla güncellendi.");
      }
    } catch (error) {
      toast.error("Proje güncellenirken bir hata oluştu.");
    }
  }, [selectedPreset, project.id, toast, nodes, edges]);

  /**
   * @function handleOptimizePrompt
   * @description AI prompt'unu optimize eder
   */
  const handleOptimizePrompt = useCallback(async () => {
    try {
      setIsOptimizing(true);
      const result = await generatePromptForVersion(promptText);
      if (result.success) {
        setPromptText(result.prompt);
        toast.success("Prompt optimize edildi");
        setIsPromptExpanded(true);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Prompt oluşturulurken bir hata oluştu");
    } finally {
      setIsOptimizing(false);
    }
  }, [promptText, toast]);

  /**
   * @function handleGenerateSchema
   * @description AI kullanarak yeni bir şema oluşturur
   */
  const handleGenerateSchema = useCallback(async () => {
    try {
      setIsGenerating(true);
      const result = await generateVersionAction(
        promptText,
        project.id,
        isUpdatingExisting ? nodes : [],
        isUpdatingExisting ? selectedPreset : undefined
      );

      if (result.success && result.version) {
        const flattenedNodes = JSON.parse(
          JSON.stringify(
            result.version.nodes.reduce((acc: any[], node: any) => {
              if (node.data.nodes) {
                return [...acc, ...node.data.nodes];
              }
              return [...acc, node];
            }, [])
          )
        );

        const flattenedEdges = JSON.parse(
          JSON.stringify(
            result.version.nodes.reduce((acc: any[], node: any) => {
              if (node.data.edges) {
                return [...acc, ...node.data.edges];
              }
              return [...acc, ...(result.version.edges || [])];
            }, [])
          )
        );

        setNodes(flattenedNodes);
        setEdges(flattenedEdges);
        setSelectedPreset(result.version.id);
        setIsAIPromptDialogOpen(false);
        toast.success("Şema Oluşturuldu");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Şema oluşturulurken bir hata oluştu"
      );
    } finally {
      setIsGenerating(false);
      setPromptText("");
    }
  }, [promptText, project.id]);

  return (
    <ReactFlowProvider>
      <div className={`flex flex-col h-[calc(100vh-65px)]`}>
        {/* Header */}
        <FlowHeader
          selectedPreset={selectedPreset}
          versions={versions}
          isAutoSaveEnabled={isAutoSaveEnabled}
          selectedNode={selectedNode}
          onPresetChange={onPresetChange}
          onAutoSaveChange={handleAutoSaveChange}
          onSave={updateProject}
          onNewNode={() => setIsDialogOpen(true)}
          onAIPrompt={() => setIsAIPromptDialogOpen(true)}
        />

        {/* Main Content */}
        <div className="h-[calc(100vh-120px)]">
          {/* Canvas Area */}
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            isFullscreen={isFullscreen}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onEdgeDelete={onEdgeDelete}
            nodeTypes={nodeTypes}
          />

          {/* Sidebar */}
          <FlowSidebar
            selectedNode={selectedNode}
            isEditingAgent={isEditingAgent}
            setIsEditingAgent={setIsEditingAgent}
            onUpdateAgent={updateAgent}
            onDeleteAgent={deleteAgent}
          />

          {/* Dialogs */}
          <FlowDialogs
            isDialogOpen={isDialogOpen}
            isGenerating={isGenerating}
            isOptimizing={isOptimizing}
            newAgent={newAgent}
            isAIPromptDialogOpen={isAIPromptDialogOpen}
            isConnectionDialogOpen={isConnectionDialogOpen}
            connectionType={connectionType}
            connectionCondition={connectionCondition}
            isPromptExpanded={isPromptExpanded}
            promptText={promptText}
            isUpdatingExisting={isUpdatingExisting}
            setIsDialogOpen={setIsDialogOpen}
            setNewAgent={setNewAgent}
            onAddNewAgent={addNewAgent}
            setIsAIPromptDialogOpen={setIsAIPromptDialogOpen}
            setIsConnectionDialogOpen={setIsConnectionDialogOpen}
            setConnectionType={setConnectionType}
            setConnectionCondition={setConnectionCondition}
            onCompleteConnection={completeConnection}
            setIsPromptExpanded={setIsPromptExpanded}
            setPromptText={setPromptText}
            onOptimizePrompt={handleOptimizePrompt}
            onGenerateSchema={handleGenerateSchema}
            setIsUpdatingExisting={setIsUpdatingExisting}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
