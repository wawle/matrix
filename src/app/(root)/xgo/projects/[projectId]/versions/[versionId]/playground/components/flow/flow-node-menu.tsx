import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export function FlowNodeMenu() {
  return (
    <Button variant="ghost" className="w-fit absolute top-2 right-2">
      <Edit className="h-4 w-4" />
    </Button>
  );
}
