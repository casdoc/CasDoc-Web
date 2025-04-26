import fs from "fs";
import path from "path";
import { GetStaticPaths, GetStaticProps } from "next";
import { getDocBySlug } from "@/lib/markdown";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

interface WikiPageProps {
    title: string;
    contentHtml: string;
}

export default function WikiPage({ title, contentHtml }: WikiPageProps) {
    return (
        <div>
            <header className="w-full h-16 flex items-center px-6 border-b sticky top-0 bg-white z-50">
                <Link href="./overview">
                    <Flex gapX="3">
                        <Image
                            src="/icon.svg"
                            width={25}
                            height={10}
                            alt="CasDoc"
                            loading="lazy"
                        />
                        <span className="text-xl font-semibold">
                            CasDoc Wiki
                        </span>
                    </Flex>
                </Link>
            </header>
            <Flex>
                <aside className="w-64 border-r h-screen p-6 sticky top-16">
                    <nav className="flex flex-col space-y-4">
                        <a
                            href="/wiki/overview"
                            className="text-lg font-medium hover:underline"
                        >
                            Overview
                        </a>
                        <a
                            href="/wiki/fundamental-elements"
                            className="text-lg font-medium hover:underline"
                        >
                            Fundamental Elements
                        </a>
                    </nav>
                </aside>
                <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
                    <h1 className="text-4xl font-bold mb-8">{title}</h1>
                    <div
                        className="prose prose-lg"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </main>
            </Flex>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const docsDirectory = path.join(process.cwd(), "public", "wiki");
    const filenames = fs.readdirSync(docsDirectory);

    const slugs = filenames
        .filter((name) => name.endsWith(".md"))
        .map((name) => name.replace(/\.md$/, ""));

    return {
        paths: slugs.map((slug) => ({
            params: { slug },
        })),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;
    const { frontMatter, contentHtml } = await getDocBySlug(slug);

    return {
        props: {
            title: frontMatter.title || slug,
            contentHtml,
        },
    };
};
