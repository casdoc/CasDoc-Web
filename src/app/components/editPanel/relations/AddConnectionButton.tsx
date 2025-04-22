import { Button, Flex } from "@radix-ui/themes";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { GoGitMerge } from "react-icons/go";
import { ConnectionEdge, GraphNode } from "@/app/viewModels/GraphViewModel";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useEffect, useState } from "react";
import { AddConnectionList } from "./AddConnectionList";

interface AddConnectionButtonProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    edges: ConnectionEdge[];
}

export interface SelectedNode extends GraphNode {
    selected: boolean;
}

export const AddConnectionButton = ({
    open,
    setOpen,
    edges,
}: AddConnectionButtonProps) => {
    const { parseAttahcedDocsToNodes } = useGraphContext();
    const { selectedNode } = useNodeSelection();
    const [nodes, setNodes] = useState<SelectedNode[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isMounted) return;
        else setIsMounted(true);
        const attachedNodes = parseAttahcedDocsToNodes();
        const filtered = attachedNodes.filter((node) =>
            node.type.startsWith("template")
        );
        if (!filtered) return;

        const selected = filtered.find((node) => node.id === selectedNode);
        const targeted = filtered
            .filter((node) => edges.some((edge) => edge.target === node.id))
            .filter((node) => node.id !== selectedNode);
        const others = filtered.filter(
            (node) =>
                node.id !== selectedNode &&
                !edges.some((edge) => edge.target === node.id)
        );

        const selectedWithFlag = selected
            ? [{ ...selected, selected: true }]
            : [];
        const targetedWithFlag = targeted.map((node) => ({
            ...node,
            selected: true,
        }));
        const othersWithFlag = others.map((node) => ({
            ...node,
            selected: false,
        }));
        const resultNodes = [
            ...selectedWithFlag,
            ...targetedWithFlag,
            ...othersWithFlag,
        ];
        setNodes(resultNodes);
    }, [edges, parseAttahcedDocsToNodes, selectedNode, isMounted]);

    const handleToggle = (id: string) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (node.id === id) {
                    return { ...node, selected: !node.selected };
                }
                return node;
            })
        );
    };

    return (
        <Flex justify="center">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        color="blue"
                        variant="soft"
                        className="cursor-pointer"
                    >
                        +
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Flex className="gap-x-3">
                                <GoGitMerge />
                                Establish relationships
                            </Flex>
                        </DialogTitle>
                        <DialogDescription>
                            Establish some relationships starting from this node
                        </DialogDescription>
                    </DialogHeader>
                    <AddConnectionList
                        nodes={nodes}
                        handleToggle={handleToggle}
                    />
                </DialogContent>
            </Dialog>
        </Flex>
    );
};
