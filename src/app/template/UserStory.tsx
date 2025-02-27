import ReactMarkdown from "react-markdown";
interface UserStoryProps {
    title: string;
    description: string;
    dod: string;
    testCases: string;
}
const UserStory: React.FC<UserStoryProps> = ({
    title,
    description,
    dod,
    testCases,
}) => {
    return (
        <div className="p-6 bg-slate-50 shadow-md rounded-lg max-w-2xl mx-auto">
            {/* 故事標題 */}
            <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>

            {/* 故事描述 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                    故事描述
                </h2>
                <p className="text-gray-600">{description}</p>
            </section>

            {/* DoD (Definition of Done) */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                    DoD (Definition of Done)
                </h2>
                <p className="text-gray-600">{dod}</p>
            </section>

            {/* 測試案例 */}
            <section>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                    測試案例
                </h2>
                <div className="text-gray-600">
                    <ReactMarkdown>{testCases}</ReactMarkdown>
                </div>
            </section>
        </div>
    );
};

export default UserStory;
