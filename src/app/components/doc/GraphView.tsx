import { useEffect, useState } from "react";
import ProjectTreeView from "./ProjectTreeView";
import { EditorModel } from "@/app/models/editor/EditorModel";
import { Block } from "@/app/types/Block";

const GraphView = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        const modelBlocks = EditorModel.getBlocks();
        console.log(modelBlocks);
        setBlocks(modelBlocks);
    }, []);

    return <ProjectTreeView blocks={blocks} />;
};

export default GraphView;
