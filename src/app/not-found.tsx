import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl font-medium text-gray-600 mb-6">
                Page Not Found
            </h2>
            <p className="text-gray-500 mb-8 text-center">
                The page you are looking for doesn&apos;t exist or has been
                moved.
            </p>
            <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
