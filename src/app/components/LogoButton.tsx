"use server";

import Link from "next/link";
import { GrDocumentTest } from "react-icons/gr";

const LogoButton = () => {
    return (
        <Link
            href="/"
            className="flex text-xl font-bold text-gray-800 my-2 mx-6 select-none"
        >
            <GrDocumentTest className="mr-2 pb-0.5" size={25} />
            CasDoc
        </Link>
    );
};

export default LogoButton;
