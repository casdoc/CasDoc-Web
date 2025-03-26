import { Icon } from "@/app/components/doc/ui/Icon";
import { Toolbar } from "@/app/components/doc/ui/Toolbar";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { Editor } from "@tiptap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
// import * as Popover from "@radix-ui/react-popover";
// import { Surface } from "@/app/components/doc/ui/Surface";
// import { DropdownButton } from "@/app/components/doc/ui/Dropdown";
import useContentItemActions from "./hooks/useContentItemActions";
import { useData } from "./hooks/useData";
import { useEffect, useState } from "react";

export type ContentItemMenuProps = {
    editor: Editor;
    isEditable?: boolean;
};

export const ContentItemMenu = ({
    editor,
    isEditable = true,
}: ContentItemMenuProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const data = useData();
    const actions = useContentItemActions(
        editor,
        data.currentNode,
        data.currentNodePos
    );

    useEffect(() => {
        if (menuOpen) {
            editor.commands.setMeta("lockDragHandle", true);
        } else {
            editor.commands.setMeta("lockDragHandle", false);
        }
    }, [editor, menuOpen]);

    return (
        <DragHandle
            pluginKey="ContentItemMenu"
            editor={editor}
            onNodeChange={data.handleNodeChange}
            tippyOptions={{
                offset: [-2, 16],
                zIndex: 40,
            }}
        >
            {isEditable ? (
                <div className="flex items-center">
                    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <Toolbar.Button>
                                <Icon name="GripVertical" />
                            </Toolbar.Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" sideOffset={8}>
                            <DropdownMenuItem
                                onClick={actions.resetTextFormatting}
                            >
                                <Icon name="RemoveFormatting" />
                                Clear formatting
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={actions.copyNodeToClipboard}
                            >
                                <Icon name="Clipboard" />
                                Copy to clipboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={actions.duplicateNode}>
                                <Icon name="Copy" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={actions.deleteNode}
                                className="text-red-500 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                            >
                                <Icon name="Trash2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : null}
        </DragHandle>
    );
};
