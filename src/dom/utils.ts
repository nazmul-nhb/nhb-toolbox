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

/**
 * * Toggles full-screen mode for a given element (or the `document` by default).
 * @param element The element to toggle fullscreen mode for (default: document root).
 */
export function toggleFullScreen(element = document.documentElement) {
	const doc = document as Document & {
		webkitFullscreenElement?: Element | null;
		webkitExitFullscreen?: () => Promise<void>;
	};

	const elem = element as HTMLElement & {
		webkitRequestFullscreen?: () => Promise<void>;
	};

	if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
	} else {
		if (doc.exitFullscreen) {
			doc.exitFullscreen();
		} else if (doc.webkitExitFullscreen) {
			doc.webkitExitFullscreen();
		}
	}
}

/**
 * * Copies text to the clipboard, falling back to legacy methods if needed.
 * @param text - The text to copy.
 * @returns A promise that resolves when the text is copied.
 */
export async function copyToClipboard(text: string): Promise<void> {
	try {
		if (navigator?.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
		} else {
			const textArea = document.createElement('textarea');

			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.opacity = '0';
			document.body.appendChild(textArea);

			textArea.select();
			textArea.setSelectionRange(0, textArea.value?.length);

			const success = document.execCommand('copy');

			document.body.removeChild(textArea);

			if (!success) {
				throw new Error('Cannot execute command in this environment!');
			}
		}
	} catch (error) {
		console.error('Failed to copy text:', error);
		throw error;
	} finally {
		const textArea = document.querySelector('textarea[style*="fixed"]');

		if (textArea) {
			document.body.removeChild(textArea);
		}
	}
}
