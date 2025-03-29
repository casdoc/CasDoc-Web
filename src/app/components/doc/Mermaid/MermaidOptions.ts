import {
    lineNumbers,
    keymap,
    highlightActiveLineGutter,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { langs } from "@uiw/codemirror-extensions-langs";
import { indentUnit } from "@codemirror/language";
const MermaidOptions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    indentUnit.of("    "),
    langs.mermaid(),
];
export default MermaidOptions;
