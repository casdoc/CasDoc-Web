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

export const AddConnectionButton = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    const { parseAttahcedDocsToNodes } = useGraphContext();
    const nodes = parseAttahcedDocsToNodes();

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
                        <DialogTitle>Establish relationships</DialogTitle>
                        <DialogDescription>
                            Establish some relationships starting from this node
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        {nodes.map((node) => {
                            return (
                                node.type.startsWith("template") && (
                                    <div key={node.id}>{node.label}</div>
                                )
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </Flex>
    );
};
