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
import { useState } from "react";
// import { useGraphContext } from "@/app/viewModels/context/GraphContext";

export const GraphAttachDialog = ({
    openAttach,
    setOpenAttach,
}: {
    openAttach: boolean;
    setOpenAttach: (open: boolean) => void;
}) => {
    const { projects, getDocumentsByProjectId } = useProjectContext();
    // const { appendGraphNodes } = useGraphContext();

    return (
        <Dialog open={openAttach} onOpenChange={setOpenAttach}>
            <DialogTrigger asChild>
                <button
                    className="hover:bg-gray-200 transition-colors duration-300 p-1.5 rounded-lg"
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
                                                <AttachActionButton />
                                                <span className="text-sm">
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
                {/* <button
                    className="p-1 hover:bg-gray-300 hover:text-gray-600 transition-colors duration-300 rounded"
                    onClick={() => {
                        appendGraphNodes([
                            {
                                id: "root2",
                                pid: "root2",
                                label: "root",
                                type: "",
                            },
                        ]);
                    }}
                >
                    Add
                </button> */}
            </DialogContent>
        </Dialog>
    );
};

const AttachActionButton = () => {
    const [selected, setSelected] = useState(false);
    return (
        <button onClick={() => setSelected(!selected)}>
            {selected ? (
                <CircleMinus className="h-5 w-5 text-red-500 cursor-pointer" />
            ) : (
                <CirclePlus className="h-5 w-5 text-green-500 cursor-pointer" />
            )}
        </button>
    );
};
