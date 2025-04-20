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
import { useEffect, useState } from "react";
import { useGraphContext } from "@/app/viewModels/context/GraphContext";
import { AttachActionButton } from "./AttachActionButton";

export const GraphAttachDialog = ({
    openAttach,
    setOpenAttach,
}: {
    openAttach: boolean;
    setOpenAttach: (open: boolean) => void;
}) => {
    const { projects, getDocumentsByProjectId, selectedDocumentId } =
        useProjectContext();
    const { setAttachedDocs } = useGraphContext();
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
        setAttachedDocs([]);
    }, [selectedDocumentId, setAttachedDocs]);

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
                                <ul className="mt-1 space-y-2">
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
