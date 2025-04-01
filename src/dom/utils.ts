/**
 * * Scrolls smoothly to the given element with an optional vertical offset.
 * @param element The target element to scroll to.
 * @param offset Additional vertical offset in pixels (positive moves down, negative moves up).
 */
export function smoothScrollTo(element: HTMLElement, offset = 0) {
	element.scrollIntoView({ behavior: 'smooth', block: 'start' });

	if (offset !== 0) {
		setTimeout(() => {
			window.scrollBy({ top: offset, behavior: 'smooth' });
		}, 300); // Delay to ensure smooth scrolling effect
	}
}

/** * Toggle full-screen using browser API. */
export function toggleFullScreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
	}
}

/**
 * * Copy text to clipboard.
 * @param text Text to copy in clipboard.
 */
export async function copyToClipboard(text: string) {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error('Failed to copy:', err);
	}
}
