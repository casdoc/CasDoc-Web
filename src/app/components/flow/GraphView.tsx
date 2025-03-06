import { BlockViewModel } from "@/app/viewModels/BlockViewModel";
import FlowView from "./FlowView";

interface GraphViewProps {
    blockViewModel: BlockViewModel;
}

const GraphView = ({ blockViewModel }: GraphViewProps) => {
    return <FlowView />;
};

export default GraphView;
