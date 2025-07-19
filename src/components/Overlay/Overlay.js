export default function createOverlay(onClick) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    overlay.addEventListener('click', () => {
        if (typeof onClick === 'function') onClick();
    });

    return overlay;
}
