import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { PiMagnifyingGlass } from "react-icons/pi";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Flex, TextField } from "@radix-ui/themes";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { GraphNode } from "@/app/viewModels/useDocument";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { JsonObject } from "@/app/models/types/JsonObject";

export const GraphAttachDialog = ({
    openAttach,
    setOpenAttach,
}: {
    openAttach: boolean;
    setOpenAttach: (open: boolean) => void;
}) => {
    const { projects, getDocumentsByProjectId, selectedDocumentId } =
        useProjectContext();
    const { setAttachedNodes } = useGraphContext();
    const [isSelected, setIsSelected] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setIsSelected((prev) => {
            const updated: Record<string, boolean> = {};
            projects.forEach((project) => {
                updated[project.id] = prev[project.id] ?? false;
            });
            return updated;
        });
    }, [projects]);

    useEffect(() => {
        setIsSelected({});
        setAttachedNodes([]);
    }, [selectedDocumentId, setAttachedNodes]);

    const toggleSelected = (id: string) => {
        setIsSelected((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Dialog open={openAttach} onOpenChange={setOpenAttach}>
            <DialogTrigger asChild>
                <button
                    className="hover:bg-gray-200 transition-colors duration-300 p-1.5 rounded-lg select-none"
                    onClick={() => setOpenAttach(true)}
                >
                    <IoExtensionPuzzleOutline size={28} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Flex align="center" className="gap-x-1.5">
                            <IoExtensionPuzzleOutline size={24} />
                            Attach more docs
                        </Flex>
                    </DialogTitle>
                    <DialogDescription>
                        Search and select some documents to attach to the graph.
                    </DialogDescription>
                </DialogHeader>
                <TextField.Root
                    size="2"
                    placeholder="Search the docs…"
                    className="rounded-md p-1"
                >
                    <TextField.Slot>
                        <PiMagnifyingGlass size={25} className="p-1" />
                    </TextField.Slot>
                </TextField.Root>
                <div className="overflow-y-auto h-[200px] px-2 space-y-4">
                    {projects?.map((project) => {
                        const docs = getDocumentsByProjectId(project.id);
                        return (
                            <div key={project.id}>
                                <h3 className="text-base font-semibold">
                                    {project.name}
                                </h3>
                                <ul className="ml-4 mt-1 space-y-2">
                                    {docs?.map((doc) => (
                                        <li
                                            key={doc.id}
                                            className="hover:bg-gray-100 rounded-md px-2 py-1 my-2 transition cursor-default"
                                        >
                                            <Flex className="gap-3">
                                                {
                                                    <AttachActionButton
                                                        id={doc.id}
                                                        isSelf={
                                                            doc.id ===
                                                            selectedDocumentId
                                                        }
                                                        selected={
                                                            isSelected[doc.id]
                                                        }
                                                        toggleSelected={() =>
                                                            toggleSelected(
                                                                doc.id
                                                            )
                                                        }
                                                    />
                                                }
                                                <span
                                                    className={`text-sm ${
                                                        doc.id ===
                                                            selectedDocumentId &&
                                                        "font-semibold"
                                                    }`}
                                                >
                                                    {doc.title}
                                                </span>
                                            </Flex>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
};

interface AttachActionButtonProps {
    id: string;
    isSelf: boolean;
    selected: boolean;
    toggleSelected: () => void;
}

const AttachActionButton = ({
    id,
    isSelf,
    selected,
    toggleSelected,
}: AttachActionButtonProps) => {
    const { getDocumentById } = useProjectContext();
    const { appendAttachedNodes } = useGraphContext();

    const handleClick = () => {
        toggleSelected();
        if (!selected) {
            handleAttached();
        }
    };

    const handleAttached = () => {
        const doc = getDocumentById(id);
        if (!doc) return;
        const docContents = doc.content;
        const newGraphNodes: GraphNode[] = [
            {
                id: doc.id,
                pid: doc.id,
                label: doc.title || "Untitled",
                type: "root",
            },
        ];
        const lastTopicId: string[] = [doc.id, doc.id, doc.id];
        let lastTopicLevel = 0;

        for (let i = 0; i < docContents.length; i++) {
            const topicLevel: number =
                parseInt(docContents[i].attrs.level) ?? 0;
            let parent = lastTopicLevel;

            if (topicLevel === 1) parent = 0;
            else if (topicLevel === lastTopicLevel) parent = lastTopicLevel - 1;
            else if (topicLevel < lastTopicLevel) parent = topicLevel - 1;

            if (docContents[i].type.startsWith("topic")) {
                lastTopicId[topicLevel] = docContents[i].attrs.id;
                lastTopicLevel = topicLevel;
            }

            const graphNode = newGraphNode(docContents[i], lastTopicId[parent]);
            if (graphNode) newGraphNodes.push(graphNode);
        }
        appendAttachedNodes(newGraphNodes);
    };

    const newGraphNode = (content: JsonObject, lastTopicId?: string) => {
        if (
            content.type.startsWith("topic") ||
            content.type.startsWith("template")
        ) {
            return {
                id: content.attrs.id,
                pid: lastTopicId || content.attrs.topicId,
                label: content.attrs.config?.info.name || "",
                type: content.type,
                level: content.attrs.level,
            };
        }
    };

    return (
        <button
            disabled={isSelf}
            onClick={handleClick}
            className={`${isSelf ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
            {selected || isSelf ? (
                <CircleMinus
                    className={`h-5 w-5 ${
                        isSelf ? "text-blue-500" : "text-red-500"
                    }`}
                />
            ) : (
                <CirclePlus className="h-5 w-5 text-green-500" />
            )}
        </button>
    );
};
