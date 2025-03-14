export const Toast = ({ message }: { message: string }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <div
                className={`flex items-center w-fit bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md animate-fadeInOut transition-opacity opacity-70 pointer-events-auto`}
            >
                {message}
            </div>
        </div>
    );
};

export default Toast;
