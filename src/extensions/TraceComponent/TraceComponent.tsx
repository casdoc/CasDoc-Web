import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
const increase = () => {
    props.updateAttributes({
        count: props.node.attrs.count + 1,
    });
};
export const TraceComponent = () => {
    return (
        <NodeViewWrapper>
            <label contentEditable={true}>TraceComponent</label>
            {/* <div className="bg-slate-600 content">test test</div> */}
            <div className="content">
                <button
                    onClick={() => {
                        console.debug("clicked");
                    }}
                >
                    This button has been clicked {props.node.attrs.count} times.
                </button>
            </div>
        </NodeViewWrapper>
    );
};
