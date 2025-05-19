import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { getDocBySlug } from "@/lib/markdown";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

interface WikiPageProps {
    params: {
        slug: string;
    };
}

export const generateMetadata = ({ params }: WikiPageProps): Metadata => {
    return {
        title: `${params.slug.replace(/-/g, " ")} - CasDoc Wiki`,
    };
};

export async function generateStaticParams() {
    const docsDirectory = path.join(process.cwd(), "public", "wiki");
    const filenames = fs.readdirSync(docsDirectory);

    return filenames
        .filter((name) => name.endsWith(".md"))
        .map((name) => ({
            slug: name.replace(/\.md$/, ""),
        }));
}

export default async function WikiPage({ params }: WikiPageProps) {
    const { slug } = params;
    const { frontMatter, contentHtml } = await getDocBySlug(slug);

    // Get all slugs for the sidebar
    const docsDirectory = path.join(process.cwd(), "public", "wiki");
    const filenames = fs.readdirSync(docsDirectory);
    const slugs = filenames
        .filter((name) => name.endsWith(".md"))
        .map((name) => name.replace(/\.md$/, ""));

    return (
        <>
            <header className="w-full sticky top-0 bg-white z-50">
                <Flex
                    align="center"
                    justify="between"
                    className="h-16 px-6 border-b"
                >
                    <Link href="/wiki/overview">
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
                    <Link
                        href="/"
                        className="bg-blue-500 text-white rounded-md py-2 px-2 font-medium hover:opacity-80 transition-opacity"
                    >
                        Try CasDoc
                    </Link>
                </Flex>
            </header>
            <Flex>
                <aside className="w-64 border-r h-screen p-6 sticky top-16">
                    <nav className="flex flex-col space-y-2">
                        {slugs.map((s) => (
                            <Link
                                key={s}
                                href={`/wiki/${s}`}
                                className={`text-base text-gray-700 font-medium pl-2 py-1.5 rounded-md ${
                                    slug === s
                                        ? "bg-gray-200 font-bold"
                                        : "hover:bg-gray-100"
                                } capitalize`}
                            >
                                {s.replace(/-/g, " ")}
                            </Link>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
                    <h1 className="text-3xl font-bold mb-8">
                        {frontMatter.title || slug}
                    </h1>
                    <div
                        className="prose prose-base"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </main>
            </Flex>
        </>
    );
}
