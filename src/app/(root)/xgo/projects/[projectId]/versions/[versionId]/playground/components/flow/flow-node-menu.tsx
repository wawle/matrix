import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface FlowNodeMenuProps {
  onEdit: () => void;
}

export function FlowNodeMenu({ onEdit }: FlowNodeMenuProps) {
  return (
    <Button
      variant="ghost"
      onClick={onEdit}
      className="w-fit absolute top-2 right-2"
    >
      <Edit className="h-4 w-4" />
    </Button>
  );
}
