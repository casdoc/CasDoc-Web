"use client";

import Link from "next/link";
import { FaRegCompass } from "react-icons/fa";

const GuideButton = () => {
    return (
        <Link
            href="/guide"
            className="mx-14 shadow-lg hover:opacity-50 duration-300"
        >
            <FaRegCompass size={30} />
        </Link>
    );
};

export default GuideButton;
