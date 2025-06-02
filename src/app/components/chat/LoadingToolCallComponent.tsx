export const LoadingToolCallComponent = () => {
    return (
        <div className="flex justify-start my-2 pl-2">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-black dark:text-white px-4 py-3 rounded-xl shadow-sm whitespace-pre-wrap w-full max-w-md relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500/70 flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm">🔧</span>
                    </div>
                    <h4 className="font-medium">{"Running Tool"}</h4>
                </div>

                <div className="space-y-2">
                    {/* Animated loading bars */}
                    <div className="h-3 bg-gray-300/50 dark:bg-gray-600/50 rounded-full w-3/4 overflow-hidden">
                        <div
                            className="h-full bg-blue-400 dark:bg-blue-600 animate-shimmer"
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.5s infinite",
                            }}
                        ></div>
                    </div>
                    <div className="h-3 bg-gray-300/50 dark:bg-gray-600/50 rounded-full w-1/2 overflow-hidden">
                        <div
                            className="h-full bg-blue-400 dark:bg-blue-600 animate-shimmer"
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.5s infinite linear",
                            }}
                        ></div>
                    </div>
                    <div className="h-3 bg-gray-300/50 dark:bg-gray-600/50 rounded-full w-5/6 overflow-hidden">
                        <div
                            className="h-full bg-blue-400 dark:bg-blue-600 animate-shimmer"
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.5s infinite linear 0.2s",
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
