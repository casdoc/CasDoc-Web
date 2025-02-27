export function determineBlockType(content: string): MarkdownBlockType {
    if (content.startsWith("# ")) return "heading1";
    else if (content.startsWith("## ")) return "heading2";
    else if (content.startsWith("### ")) return "heading3";
    else if (
        content.startsWith("- ") ||
        content.startsWith("* ") ||
        content.startsWith("1. ")
    )
        return "list_item";
    else if (content.startsWith("```")) return "code_block";
    else if (content.startsWith("> ")) return "quote";
    else return "paragraph";
}
