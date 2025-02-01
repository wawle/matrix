import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AgentCard } from "./components/agent-card";
import { fetchAgents } from "@/lib/actions/agent";
import { fetchFlows } from "@/lib/actions/flow";
import FlowCard from "./components/flow-card";

export default async function AgentsPage() {
  const [{ data: flows }, { data: agents }] = await Promise.all([
    fetchFlows(),
    fetchAgents(),
  ]);
  return (
    <div className="grid lg:grid-cols-4">
      <div className="col-span-3 lg:col-span-4 px-8 py-4">
        <Tabs defaultValue="public" className="space-y-6">
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="public" className="relative">
                Public
              </TabsTrigger>
              <TabsTrigger value="private">Private</TabsTrigger>
            </TabsList>
            <div className="ml-auto mr-4">
              <Button>
                <PlusCircle />
                Add Agent
              </Button>
            </div>
          </div>
          <TabsContent value="public" className="border-none p-0 outline-none">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Public Agents
                </h2>
                <p className="text-sm text-muted-foreground">
                  Public agents for you.
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="relative">
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {agents.map((agent) => (
                    <AgentCard
                      key={agent.name}
                      agent={agent}
                      className="w-[250px]"
                      aspectRatio="portrait"
                      width={250}
                      height={330}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Public Flows
                </h2>
                <p className="text-sm text-muted-foreground">
                  Public Flows for you.
                </p>
              </div>
            </div>
            <div className="relative">
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {flows.map((flow) => (
                    <FlowCard
                      key={flow.name}
                      flow={flow}
                      className="w-[800px]"
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent
            value="private"
            className="h-full flex-col border-none p-0 data-[state=active]:flex"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Private Agents
                </h2>
                <p className="text-sm text-muted-foreground">
                  Private agents for you.
                </p>
              </div>
            </div>
            <Separator className="my-4" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
