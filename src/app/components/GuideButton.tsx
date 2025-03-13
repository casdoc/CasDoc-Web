"use client";

import { FaRegCompass } from "react-icons/fa";
import GuidePopup from "./GuidePopup";
import { useState } from "react";

const GuideButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="hover:opacity-50 hover:rotate-180 duration-300 bg-none"
            >
                <FaRegCompass size={30} />
            </button>
            {isOpen && <GuidePopup onClose={handleClose} />}
        </>
    );
};

export default GuideButton;
