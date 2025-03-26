import mermaid from "mermaid";
export default class MermaidViewModel {
    private code: string;
    private setCode: (code: string) => void;
    private setSvg: (svg: string) => void;
    private setError: (error: string) => void;

    constructor(
        initialCode: string,
        setCode: (code: string) => void,
        setSvg: (svg: string) => void,
        setError: (error: string) => void
    ) {
        this.code = initialCode;
        this.setCode = setCode;
        this.setSvg = setSvg;
        this.setError = setError;
    }

    updateCode(newCode: string) {
        this.code = newCode;
        this.setCode(newCode);
        this.renderMermaid(newCode);
    }

    async renderMermaid(code: string) {
        if (!code) {
            this.setSvg("");
            this.setError("");
            return;
        }
        try {
            const { svg } = await mermaid.render("mermaid-diagram", code);
            this.setSvg(svg);
            this.setError("");
        } catch {
            this.setError("無效的 Mermaid 程式碼");
            this.setSvg("");
        }
    }

    copyCode() {
        navigator.clipboard
            .writeText(this.code)
            .then(() => {
                alert("已複製到剪貼簿！");
            })
            .catch(() => {
                alert("複製失敗");
            });
    }
}
