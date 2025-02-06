import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Clipboard,
  Code,
  Copy,
  Download,
  Ellipsis,
  Save,
  Settings2,
  Trash2,
} from "lucide-react";

export function SchemaNodeMenu() {
  return (
    <Menubar className="w-fit">
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-1">
          <Code className="h-4 w-4" />
          Code
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-1">
          <Settings2 className="h-4 w-4" />
          Controlls
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Ellipsis className="h-4 w-4" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem className="flex items-center gap-1 text-xs">
            <Code className="h-3 w-3" />
            Code <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem className="flex items-center gap-1 text-xs">
            <Settings2 className="h-3 w-3" />
            Controlls <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>

          <MenubarItem className="flex items-center gap-1 text-xs">
            <Save className="h-3 w-3" />
            Save
          </MenubarItem>
          <MenubarItem className="flex items-center gap-1 text-xs">
            <Clipboard className="h-3 w-3" />
            Copy
          </MenubarItem>
          <MenubarItem className="flex items-center gap-1 text-xs">
            <Copy className="h-3 w-3" />
            Duplicate
          </MenubarItem>
          <MenubarItem className="flex items-center gap-1 text-xs">
            <Download className="h-3 w-3" />
            Download
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="flex items-center gap-1 text-xs text-destructive focus:text-destructive">
            <Trash2 className="h-3 w-3" />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
