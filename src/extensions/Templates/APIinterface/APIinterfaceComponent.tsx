import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useNodeSelection } from "@/app/viewModels/context/NodeSelectionContext";
import { useState, useEffect } from "react";
import NodeBubbleBar from "@/app/components/doc/Popover/NodeBubbleBar";
import useCustomNodeActions from "@/extensions/hooks/useCustomNodeActions";
import { Collapsible } from "@/components/ui/collapsible";
import APIinterfaceUI from "./APIinterfaceUI";

export interface APIinterfaceInfo {
    name: string;
    method: string;
    description: string;
    endPoint: string;
}

export interface APIinterfaceParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

export interface APIStatusCode {
    code: number;
    description: string;
}

export interface APIinterfaceConfig {
    info: APIinterfaceInfo;
    headers: APIinterfaceParameter[];
    queryParams: APIinterfaceParameter[];
    pathParams: APIinterfaceParameter[];
    requestBody: APIinterfaceParameter[];
    responseBody: APIinterfaceParameter[];
    statusCodes: APIStatusCode[];
    fieldKey: string;
}

const APIinterfaceComponent = ({
    node,
    selected,
    editor,
    getPos,
}: NodeViewProps) => {
    const { id, config } = node.attrs;
    const info = config?.info || {};
    const {
        headers = [],
        queryParams = [],
        pathParams = [],
        requestBody = [],
        responseBody = [],
        statusCodes = [],
    } = config || {};
    const { selectedNode } = useNodeSelection();
    const isEditing = selectedNode === id;
    const [showBubbleBar, setShowBubbleBar] = useState(false);
    const { setNodeRef } = useCustomNodeActions({
        id,
        selected,
        getPos,
        editor,
    });

    useEffect(() => {
        if (!selected && showBubbleBar) {
            setShowBubbleBar(false);
        }
    }, [selected, showBubbleBar]);

    const handleClick = (e: React.MouseEvent): void => {
        e.stopPropagation();
        if (window.getSelection()?.toString()) return;
        setShowBubbleBar(!showBubbleBar);
    };

    return (
        <NodeViewWrapper
            className={`ml-8 group cursor-pointer hover:bg-gray-50 rounded-lg pt-2 border-2 relative bg-white ${
                isEditing
                    ? "border-blue-500"
                    : selected
                    ? "border-gray-500"
                    : "border-white hover:border-gray-200"
            }`}
            onClick={handleClick}
            ref={setNodeRef}
        >
            <Collapsible defaultOpen={true}>
                <NodeBubbleBar
                    id={id}
                    selected={showBubbleBar}
                    getPos={getPos}
                    editor={editor}
                />
                <APIinterfaceUI
                    info={info}
                    headers={headers}
                    queryParams={queryParams}
                    pathParams={pathParams}
                    requestBody={requestBody}
                    responseBody={responseBody}
                    statusCodes={statusCodes}
                />
            </Collapsible>
        </NodeViewWrapper>
    );
};

export default APIinterfaceComponent;
