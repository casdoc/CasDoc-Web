import GraphView from "../flow/GraphView";
import EditorView from "./EditorView";

const SplitView = () => {
    return (
        <div className="flex justify-center">
            <div className="w-5/12 h-3/4 mx-8">
                <EditorView />
            </div>
            <div className="w-5/12 h-3/4 mx-8">
                <GraphView />
            </div>
        </div>
    );
};

export default SplitView;
