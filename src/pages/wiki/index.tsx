import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Wiki() {
    const router = useRouter();

    useEffect(() => {
        router.push("./wiki/overview");
    }, [router]);

    return null;
}
