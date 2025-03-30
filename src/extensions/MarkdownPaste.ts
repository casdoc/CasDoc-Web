import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import markdownit from "markdown-it";

export const MarkdownPaste = Extension.create({
    name: "markdownPaste",

    addProseMirrorPlugins() {
        const md = markdownit();
        return [
            new Plugin({
                props: {
                    handlePaste: (view, event) => {
                        const clipboardData = event.clipboardData;
                        if (!clipboardData) return false;

                        const text = clipboardData.getData("text/plain");
                        if (text && isMarkdown(text)) {
                            // Prevent the default paste behavior
                            event.preventDefault();

                            // Convert Markdown to HTML
                            const html = md.render(text);

                            // Parse HTML into TipTap nodes
                            const parser = new DOMParser();
                            const dom = parser.parseFromString(
                                html,
                                "text/html"
                            );
                            const { schema } = view.state;
                            const content = ProseMirrorDOMParser.fromSchema(
                                schema
                            ).parse(dom.body);

                            // Insert the converted nodes and replace the current selection
                            const transaction =
                                view.state.tr.replaceSelectionWith(content);
                            view.dispatch(transaction);
                            return true;
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});

// check if the text is in Markdown format
function isMarkdown(text: string): boolean {
    return /^#\s/m.test(text) || /\*\*.+\*\*/.test(text) || /_.+_/.test(text);
}
