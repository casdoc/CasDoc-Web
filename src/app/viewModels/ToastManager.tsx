import { useState } from "react";
import Toast from "@/app/components/flow/Toast";

const ToastManager = () => {
    const [message, setMessage] = useState("");

    const showToast = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 2000);
    };

    return { showToast, ToastComponent: <Toast message={message} /> };
};

export default ToastManager;
