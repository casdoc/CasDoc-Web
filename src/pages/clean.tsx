import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";

export default function Clean() {
    const router = useRouter();

    const handleClear = () => {
        localStorage.clear();
        router.push("/");
    };

    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Do you sure to clear the data in local storage?
                    </DialogTitle>
                    <DialogDescription>
                        The operation can not be reversed.
                    </DialogDescription>
                </DialogHeader>
                <Flex className="gap-x-4 mt-5">
                    <Button
                        onClick={() => router.push("/")}
                        className="hover:bg-gray-400"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleClear}
                        className="bg-gray-400 text-gray-100"
                    >
                        Ensure
                    </Button>
                </Flex>
            </DialogContent>
        </Dialog>
    );
}
