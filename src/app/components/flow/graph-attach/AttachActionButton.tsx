import { CircleMinus, CirclePlus } from "lucide-react";
import { GraphNode } from "@/app/viewModels/useDocument";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { JsonObject } from "@/app/models/types/JsonObject";
import { useProjectContext } from "@/app/viewModels/context/ProjectContext";

interface AttachActionButtonProps {
    id: string;
    isSelf: boolean;
    selected: boolean;
    toggleSelected: () => void;
}

export const AttachActionButton = ({
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
