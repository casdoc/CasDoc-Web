import { useRef, useEffect, useState } from "react";

interface MermaidPreviewProps {
    renderedSvg: string;
    minScale?: number;
    maxScale?: number;
}

function MermaidPreview({
    renderedSvg,
    minScale = 0.5,
    maxScale = 5.0,
}: MermaidPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const scaleRef = useRef(1);
    const translateRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const isSpaceDownRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const [isSpaceDown, setIsSpaceDown] = useState(false);

    const applyTransform = () => {
        if (innerRef.current) {
            innerRef.current.style.transform = `translate(${translateRef.current.x}px, ${translateRef.current.y}px) scale(${scaleRef.current})`;
            innerRef.current.style.transformOrigin = "0 0";
        }
    };

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.stopPropagation();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = scaleRef.current * delta;
            if (newScale >= minScale && newScale <= maxScale) {
                scaleRef.current = newScale;
                applyTransform();
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (isSpaceDownRef.current) {
                isDraggingRef.current = true;
                startPosRef.current = { x: e.clientX, y: e.clientY };
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const dx = e.clientX - startPosRef.current.x;
            const dy = e.clientY - startPosRef.current.y;
            translateRef.current.x += dx;
            translateRef.current.y += dy;
            startPosRef.current = { x: e.clientX, y: e.clientY };
            applyTransform();
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" && !isSpaceDownRef.current) {
                e.preventDefault();
                isSpaceDownRef.current = true;
                setIsSpaceDown(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                isSpaceDownRef.current = false;
                setIsSpaceDown(false);
                isDraggingRef.current = false;
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: true });
            container.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);
        }

        return () => {
            if (container) {
                container.removeEventListener("wheel", handleWheel);
                container.removeEventListener("mousedown", handleMouseDown);
            }
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [maxScale, minScale]);

    // when renderedSvg changes, apply transform
    useEffect(() => {
        applyTransform();
    }, [renderedSvg]);

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative overflow-hidden flex justify-center items-center ${
                isSpaceDown
                    ? "hover:cursor-grab active:cursor-grabbing"
                    : "cursor-default"
            }`}
        >
            <div
                ref={innerRef}
                dangerouslySetInnerHTML={{ __html: renderedSvg }}
            />
        </div>
    );
}

export default MermaidPreview;
