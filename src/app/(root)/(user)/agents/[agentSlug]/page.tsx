import React from "react";
import { fetchAgentBySlug } from "@/lib/actions/agent";

interface Props {
  params: Promise<{ agentId: string }>;
}

const AgentDetailPage = async ({ params }: Props) => {
  const { agentId } = await params;
  const agent = await fetchAgentBySlug(agentId);
  return <div>AgentDetailPage edit</div>;
};

export default AgentDetailPage;
