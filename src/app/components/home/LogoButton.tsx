"use server";

import { Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

const LogoButton = () => {
    return (
        <Link
            href="/"
            className="flex text-xl font-bold text-gray-800 my-2 mx-6 select-none"
        >
            <Flex gapX="2">
                <Image src="/icon.svg" width={35} height={25} alt="casdoc" />
                <Text size="7">CasDoc</Text>
            </Flex>
        </Link>
    );
};

export default LogoButton;
