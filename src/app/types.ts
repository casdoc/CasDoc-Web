type MarkdownBlockType =
    | "paragraph"
    | "heading1"
    | "heading2"
    | "heading3"
    | "list_item"
    | "code_block"
    | "quote";
type BlockType = MarkdownBlockType | "component";

interface BaseBlock {
    id: string;
    type: BlockType;
}

interface MarkdownBlock extends BaseBlock {
    type: MarkdownBlockType;
    content: string;
}

interface ComponentBlock extends BaseBlock {
    type: "component";
    componentName: string;
    props: Record<string, any>;
}

type Block = MarkdownBlock | ComponentBlock;
