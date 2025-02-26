import Editor from "./Editor";
import Preview from "./Preview";

interface SplitViewProps {
    content: string;
    setContent: (content: string) => void;
}

const SplitView = ({ content, setContent }: SplitViewProps) => {
    return (
        <div className="flex w-full h-full">
            <div className="w-1/2 p-4 border-r">
                <Editor value={content} onChange={setContent} />
            </div>
            <div className="w-1/2 p-4">
                <Preview content={content} />
            </div>
        </div>
    );
};

export default SplitView;
