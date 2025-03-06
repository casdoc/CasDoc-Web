"use client";

import React, { useCallback, JSX, useState, useRef } from "react";
import {
    useFloating,
    useInteractions,
    useHover,
    useFocus,
    useRole,
    useDismiss,
    offset,
    flip,
    shift,
    arrow,
    autoUpdate,
    FloatingPortal,
    Placement,
} from "@floating-ui/react";

// Types
interface TooltipProps {
    children?: string | React.ReactNode;
    enabled?: boolean;
    title?: string;
    shortcut?: string[];
    tippyOptions?: {
        placement?: Placement;
        delay?: number | { open?: number; close?: number };
        offset?: [number, number];
        // Add other options you need here
    };
    content?: React.ReactNode;
}

// 修正 platform deprecation 警告，使用更現代的方法檢測 Mac
const isMac =
    typeof window !== "undefined"
        ? /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent)
        : false;

const ShortcutKey = ({ children }: { children: string }): JSX.Element => {
    const className =
        "inline-flex items-center justify-center w-5 h-5 p-1 text-[0.625rem] rounded font-semibold leading-none border border-neutral-200 text-neutral-500 border-b-2";

    if (children === "Mod") {
        return <kbd className={className}>{isMac ? "⌘" : "Ctrl"}</kbd>; // ⌃
    }
    if (children === "Shift") {
        return <kbd className={className}>⇧</kbd>;
    }
    if (children === "Alt") {
        return <kbd className={className}>{isMac ? "⌥" : "Alt"}</kbd>;
    }
    return <kbd className={className}>{children}</kbd>;
};

export const Tooltip = ({
    children,
    enabled = true,
    title,
    shortcut,
    tippyOptions = {},
}: TooltipProps): JSX.Element => {
    const [open, setOpen] = useState(false);
    const arrowRef = useRef(null);

    // Extract options with defaults that match original behavior
    const {
        placement = "top",
        delay = 500,
        offset: offsetValue = [0, 8],
    } = tippyOptions;

    const {
        x,
        y,
        strategy,
        context,
        refs,
        placement: actualPlacement,
    } = useFloating({
        open,
        onOpenChange: setOpen,
        placement,
        middleware: [
            offset({ mainAxis: offsetValue[1], crossAxis: offsetValue[0] }),
            flip(),
            shift(),
            arrow({ element: arrowRef }),
        ],
        whileElementsMounted: autoUpdate,
    });

    // 修正 delay 類型錯誤
    const hoverDelay =
        typeof delay === "number" ? { open: delay, close: 0 } : delay;

    // Setup interactions (hover, focus, etc)
    const hover = useHover(context, {
        delay: hoverDelay,
        enabled: enabled,
    });
    const focus = useFocus(context, { enabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "tooltip" });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    const renderTooltip = useCallback(() => {
        if (!open) return null;

        return (
            <FloatingPortal>
                <div
                    ref={refs.setFloating}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                        zIndex: 99999,
                    }}
                    {...getFloatingProps()}
                    className="flex items-center gap-2 px-2.5 py-1 bg-white border border-neutral-100 rounded-lg shadow-sm z-[999]"
                    data-placement={actualPlacement}
                >
                    {title && (
                        <span className="text-xs font-medium text-neutral-500">
                            {title}
                        </span>
                    )}
                    {shortcut && (
                        <span className="flex items-center gap-0.5">
                            {shortcut.map((shortcutKey) => (
                                <ShortcutKey key={shortcutKey}>
                                    {shortcutKey}
                                </ShortcutKey>
                            ))}
                        </span>
                    )}
                </div>
            </FloatingPortal>
        );
    }, [
        open,
        shortcut,
        title,
        x,
        y,
        strategy,
        getFloatingProps,
        refs.setFloating,
        actualPlacement,
    ]);

    if (enabled) {
        return (
            <span ref={refs.setReference} {...getReferenceProps()}>
                {children}
                {renderTooltip()}
            </span>
        );
    }

    return <>{children}</>;
};

export default Tooltip;
