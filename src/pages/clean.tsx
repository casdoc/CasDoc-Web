import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Clean() {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            localStorage.clear();
            router.push("/");
        }, 500);
    }, [router]);
    return (
        <div className="flex justify-center items-center h-screen w-screen text-6xl font-bold">
            Cleaning...
        </div>
    );
}
