import { animate } from "motion";

/**
 * Creates a copy button with SVG icon and click handler.
 * Handles clipboard interaction, fallback for older browsers, and success/error animations.
 *
 * @param text The text to copy to clipboard.
 * @param ariaLabel The aria-label for the button.
 * @returns The button element.
 */
export function createCopyButton(
    text: string,
    ariaLabel: string = "Copy to clipboard",
): HTMLElement {
    const button = document.createElement("button");
    button.className = "code-block-copy-btn";
    button.setAttribute("aria-label", ariaLabel);
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    `;

    button.addEventListener("click", async (e) => {
        e.stopPropagation(); // Prevent triggering parent click handlers (e.g., expand/collapse)
        try {
            // Use the Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand("copy");
                    textArea.remove();
                } catch (err) {
                    console.error("Fallback: Failed to copy", err);
                    textArea.remove();
                    throw err;
                }
            }

            // Show success feedback
            showFeedback(button, "success");
        } catch (err) {
            console.error("Failed to copy code:", err);
            showFeedback(button, "error");
        }
    });

    return button;
}

function showFeedback(button: HTMLElement, type: "success" | "error") {
    const originalIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    `;

    const successIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;

    const errorIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;

    const iconHtml = type === "success" ? successIcon : errorIcon;
    const className = type === "success" ? "copied" : "error";

    button.classList.add(className);
    button.innerHTML = iconHtml;

    // Animate icon in
    const icon = button.querySelector("svg");
    if (icon) {
        animate(icon, { opacity: [0, 1], scale: [0.8, 1] }, { duration: 0.3 });
    }

    setTimeout(() => {
        button.classList.remove(className);
        button.classList.add("reverting");
        button.innerHTML = originalIcon;

        // Animate icon in
        const revertIcon = button.querySelector("svg");
        if (revertIcon) {
            animate(
                revertIcon,
                { opacity: [0, 1], scale: [0.8, 1] },
                { duration: 0.3 },
            );
        }

        // Remove reverting class after animation completes
        setTimeout(() => {
            button.classList.remove("reverting");
        }, 300);
    }, 2000);
}
