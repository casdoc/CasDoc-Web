import ProjectTreeView from "./ProjectTreeView";
import { Block } from "@/app/models/types/Block";

interface GraphViewProps {
    blocks: Block[];
}

const GraphView = ({ blocks }: GraphViewProps) => {
    return <ProjectTreeView blocks={blocks} />;
};

export default GraphView;
