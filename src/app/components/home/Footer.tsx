import Link from "next/link";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-100 border-t border-gray-300 py-4 sm:py-6">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                <p className="text-gray-600 text-sm">
                    © {new Date().getFullYear()} CasDoc. All rights reserved.
                </p>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Link
                        href="mailto:casdoc.official@gmail.com"
                        className="text-gray-600 text-sm hover:text-gray-800 transition-colors"
                    >
                        casdoc.official@gmail.com
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
