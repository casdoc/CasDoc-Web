import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectedNode } from "./AddConnectionButton";
import { ConnectActionButton } from "./ConnectActionButton";
import { Flex, Text } from "@radix-ui/themes";

interface AddConnectionListProps {
    nodes: SelectedNode[];
    handleToggle: (id: string) => void;
}

export const AddConnectionList = ({
    nodes,
    handleToggle,
}: AddConnectionListProps) => {
    const { selectedNode } = useNodeSelection();
    return (
        <ScrollArea>
            <div className="space-y-1">
                {nodes.map((node) => {
                    if (!node) return;
                    return (
                        <Flex
                            key={node.id}
                            className="gap-x-3 hover:bg-gray-100 p-2 rounded transition-colors"
                        >
                            <ConnectActionButton
                                id={node.id}
                                isSelf={node.id === selectedNode}
                                selected={node.selected}
                                toggleSelected={() => handleToggle(node.id)}
                            />
                            <Text className="cursor-default">{node.label}</Text>
                        </Flex>
                    );
                })}
            </div>
        </ScrollArea>
    );
};
