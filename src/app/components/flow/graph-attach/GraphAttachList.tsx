import { useProjectContext } from "@/app/viewModels/context/ProjectContext";
import { AttachActionButton } from "./AttachActionButton";
import { Flex } from "@radix-ui/themes";

export const GraphAttachList = ({
    isSelected,
    toggleSelected,
    searchContent,
}: {
    isSelected: Record<string, boolean>;
    toggleSelected: (id: string) => void;
    searchContent: string;
}) => {
    const { selectedDocumentId, getDocumentsByProjectId } = useProjectContext();

    if (!selectedDocumentId) return;
    // const project = getProjectByDocumentId(selectedDocumentId);
    const project = null;
    if (!project) return;
    const docs = getDocumentsByProjectId(project.id);

    return (
        <div className="overflow-y-auto h-[200px] px-2 space-y-4">
            <div key={project.id}>
                <h3 className="text-base font-semibold">{project.name}</h3>
                <ul className="mt-1 space-y-2">
                    {docs?.map(
                        (doc) =>
                            doc.title.toLowerCase().includes(searchContent) && (
                                <li
                                    key={doc.id}
                                    className="hover:bg-gray-100 rounded-md px-2 py-1 my-2 transition cursor-default"
                                >
                                    <Flex className="gap-3">
                                        <AttachActionButton
                                            id={doc.id}
                                            isSelf={
                                                doc.id === selectedDocumentId
                                            }
                                            selected={isSelected[doc.id]}
                                            toggleSelected={() =>
                                                toggleSelected(doc.id)
                                            }
                                        />
                                        <span
                                            className={`text-sm ${
                                                doc.id === selectedDocumentId &&
                                                "font-semibold"
                                            }`}
                                        >
                                            {doc.title}
                                        </span>
                                    </Flex>
                                </li>
                            )
                    )}
                </ul>
            </div>
        </div>
    );
};
