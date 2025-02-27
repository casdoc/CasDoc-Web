import { useState, useEffect, useCallback, useMemo } from "react";
import { MDXProvider } from "@mdx-js/react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import debounce from "lodash/debounce";
import MDXComponents from "@/app/template/MDXComponents";
interface PreviewProps {
    content: string;
}

const Preview = ({ content }: PreviewProps) => {
    const [mdxContent, setMdxContent] =
        useState<MDXRemoteSerializeResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const compileMdx = useCallback(async (text: string) => {
        try {
            const mdxSource = await serialize(text, {
                mdxOptions: {
                    remarkPlugins: [remarkGfm, remarkBreaks],
                },
            });
            setMdxContent(mdxSource);
            setError(null);
        } catch (err) {
            console.error("MDX compilation error:", err);
            setError("MDX compilation error, please check your syntax.");
        }
    }, []);
    const debouncedCompileMdx = useMemo(
        () => debounce(compileMdx, 500),
        [compileMdx]
    );

    useEffect(() => {
        compileMdx(content);

        return () => {
            debouncedCompileMdx.cancel();
        };
    }, [content, debouncedCompileMdx, compileMdx]);

    return (
        <div className="prose max-w-full min-h-screen p-16 rounded-lg bg-white shadow-xl overflow-auto">
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : mdxContent ? (
                <MDXProvider components={MDXComponents}>
                    <MDXRemote {...mdxContent} components={MDXComponents} />
                </MDXProvider>
            ) : (
                <div>loading...</div>
            )}
        </div>
    );
};

export default Preview;
