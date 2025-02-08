"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
  MenubarSeparator,
} from "@/components/ui/menubar";

interface SchemaActionButtonsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export function SchemaActionButtons({
  isOpen,
  setIsOpen,
  isFullscreen,
  toggleFullscreen,
}: SchemaActionButtonsProps) {
  return (
    <Menubar className="border-none px-2 bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer data-[state=open]:bg-muted">
          Görünüm
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => setIsOpen(!isOpen)}>
            Şema Özellikleri
            <MenubarShortcut>⌥1</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={toggleFullscreen}>
            {isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran"}
            <MenubarShortcut>⌥F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
