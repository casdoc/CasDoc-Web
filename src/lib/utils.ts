import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function randomColor(): string {
    const colors = [
        "#f44336", // red
        "#e91e63", // pink
        "#9c27b0", // purple
        "#673ab7", // deep purple
        "#3f51b5", // indigo
        "#2196f3", // blue
        "#03a9f4", // light blue
        "#00bcd4", // cyan
        "#009688", // teal
        "#4caf50", // green
        "#8bc34a", // light green
        "#cddc39", // lime
        "#ffc107", // amber
        "#ff9800", // orange
        "#ff5722", // deep orange
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}
