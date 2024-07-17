import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import React from "react";
import { Button } from "./ui/button";

function FileContextMenu({
  children,
  fileContextMenuAction,
}: {
  children: React.ReactNode;
  fileContextMenuAction: { actionName: string; onClick: () => Promise<void> }[];
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {fileContextMenuAction.map(({ actionName, onClick }) => {
          <Button onClick={() => onClick()}>
            <ContextMenuItem>{actionName}</ContextMenuItem>;
          </Button>;
          return;
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default FileContextMenu;
