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
import { IVersion, VersionType } from "@/lib/models/version";
import { IProject } from "@/lib/models/project";
import { templates } from "@/lib/constants/templates";
import {
  generatePromptForVersion,
  generateVersionAction,
  setAutoSaveState,
  updateVersionAction,
} from "@/lib/actions/version";
import { toast } from "sonner";
import { INode } from "@/lib/models/node";
import { IEdge } from "@/lib/models/edge";
import { useParams } from "next/navigation";
import { IAgentConnectionType } from "@/lib/types/xgo/agents";

interface Props {
  versions: IVersion<VersionType.AGENT>[];
  defaultVersion: IVersion<VersionType.AGENT>;
  project: IProject;
  defaultAutoSave: boolean;
}

const defaultAgentNode: INode<VersionType.AGENT> = {
  id: "",
  type: VersionType.AGENT,
  position: {
    x: 0,
    y: 0,
  },
  data: {
    instructions: "",
    stream: false,
    model_provider: "openai",
    model_name: "gpt-3.5-turbo",
    max_tokens: 1000,
    temperature: 0.5,
    seed: 1,
    name: "",
    title: "",
    is_public: false,
    photo: "",
    key: "",
    children: [],
  },
};

export default function FlowPlayground({
  versions,
  defaultVersion,
  project,
  defaultAutoSave,
}: Props) {
  const { versionId } = useParams();
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
  const [newAgent, setNewAgent] =
    useState<INode<VersionType.AGENT>>(defaultAgentNode);

  // Bağlantı durumları
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null
  );
  const [connectionType, setConnectionType] =
    useState<IAgentConnectionType>("sequential");
  const [connectionCondition, setConnectionCondition] = useState<string>("");

  // ReactFlow durumları
  const [selectedNode, setSelectedNode] =
    useState<INode<VersionType.AGENT> | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    defaultVersion.nodes.map((node) => {
      const flowNode = {
        ...node,
        type: VersionType.AGENT,
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
    (type: IAgentConnectionType, condition?: string) => {
      if (!pendingConnection?.source || !pendingConnection?.target) return;

      const newEdge: IEdge<VersionType.AGENT> = {
        id: `${pendingConnection.source}-${pendingConnection.target}`,
        source: pendingConnection.source,
        target: pendingConnection.target,
        animated: true,
        type: VersionType.AGENT,
        data: {
          type: type,
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
    (edgeId: string, updates: IEdge<VersionType.AGENT>) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === edgeId) {
            const type = updates.data.type;
            const updatedEdge: IEdge<VersionType.AGENT> = {
              ...edge,
              type: VersionType.AGENT,
              data: {
                ...edge.data,
                type: type,
              },
              style: {
                ...edge.style,
                stroke:
                  type === "sequential"
                    ? "hsl(var(--primary))"
                    : type === "parallel"
                    ? "hsl(var(--success))"
                    : "hsl(var(--warning))",
              },
              label:
                type === "sequential" ? "→" : type === "parallel" ? "⇉" : "?",
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
      const selected: any = selectedNodes[0];
      if (selected) {
        const currentNode = nodes.find((n) => n.id === selected.id);
        setSelectedNode(currentNode as INode<VersionType.AGENT> | null);
      } else {
        setSelectedNode(null);
      }
    },
    [nodes]
  );

  // Yeni agent ekleme
  const addNewAgent = useCallback(() => {
    if (!newAgent.data.name) return;

    setNodes((nds) => [...nds, newAgent]);
    setNewAgent(defaultAgentNode);
    setIsDialogOpen(false);
  }, [newAgent]);

  // Agent güncelleme
  const updateAgent = useCallback(
    (updates: Partial<INode<VersionType.AGENT>>) => {
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
                  setSelectedNode(node as INode<VersionType.AGENT>);
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
        const nodesWithHandlers = clonedNodes.map(
          (node: INode<VersionType.AGENT>) => ({
            ...node,
            data: {
              ...node.data,
              onWidthChange: (width: number) =>
                updateNodeDimensions(node.id, width),
              onHeightChange: (height: number) =>
                updateNodeDimensions(node.id, undefined, height),
            },
          })
        );
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
      const result = await updateVersionAction(versionId as string, {
        nodes: nodes as INode<VersionType.AGENT>[],
        edges: edges as IEdge<VersionType.AGENT>[],
      });
      if (result.success && result.data) {
        setSelectedPreset(result.data.id);

        toast.success("Yeni şema oluşturuldu.");
      } else {
        toast.error("Yeni şema oluşturulurken bir hata oluştu.");
      }
      return;
    }

    try {
      const updatedVersion = {
        ...selectedVersion,
        nodes: nodes as INode<VersionType.AGENT>[],
        edges: edges as IEdge<VersionType.AGENT>[],
      };
      const result = await updateVersionAction(
        versionId as string,
        updatedVersion
      );
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
            result.version.nodes.reduce(
              (acc: any[], node: INode<VersionType.AGENT>) => {
                if (node.data.edges) {
                  return [...acc, ...node.data.edges];
                }
                return [...acc, ...(result.version.edges || [])];
              },
              []
            )
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
