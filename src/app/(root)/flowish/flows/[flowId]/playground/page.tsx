import { fetchFlow } from "@/lib/actions/flow";
import { notFound } from "next/navigation";
import React from "react";
import FlowPlayground from "./components/flow-playground";

interface Props {
  params: Promise<{
    flowId: string;
  }>;
}

const FlowPlaygroundPage = async ({ params }: Props) => {
  const { flowId } = await params;
  const { data: flow } = await fetchFlow(flowId);
  console.log(flow);
  if (!flow) notFound();

  const agents = flow.steps.map((step) => step.agent);

  return (
    <FlowPlayground
      agents={agents}
      defaultAgent={agents[0]}
      flow={flow}
      defaultAutoSave={false}
    />
  );
};

export default FlowPlaygroundPage;
