import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { CircleMinus, CirclePlus } from "lucide-react";

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
    const { appendAttachedDocsById, removeAttachedDoc } = useGraphContext();

    const handleClick = () => {
        toggleSelected();
        if (!selected) {
            appendAttachedDocsById(id);
        } else {
            removeAttachedDoc(id);
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
                        isSelf ? "text-gray-300" : "text-red-500"
                    }`}
                />
            ) : (
                <CirclePlus className="h-5 w-5 text-green-500" />
            )}
        </button>
    );
};
