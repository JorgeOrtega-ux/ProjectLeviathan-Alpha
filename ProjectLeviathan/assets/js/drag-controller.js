function initDragController(closeMenuCallback, isAnimatingCallback) {
    const moduleOptions = document.querySelector('[data-module="moduleOptions"]');
    if (!moduleOptions) return;

    const menuContent = moduleOptions.querySelector('.menu-content');
    const pillContainer = moduleOptions.querySelector('.pill-container');

    if (!menuContent || !pillContainer) return;

    let isDragging = false;
    let startY;
    let initialMenuTop;

    const onDragStart = (e) => {
        if (window.innerWidth > 468 || (isAnimatingCallback && isAnimatingCallback())) return;
        isDragging = true;
        startY = e.pageY || e.touches[0].pageY;
        initialMenuTop = menuContent.getBoundingClientRect().top;
        menuContent.style.transition = 'none';
    };

    const onDragMove = (e) => {
        if (!isDragging) return;
        const currentY = e.pageY || e.touches[0].pageY;
        let diffY = currentY - startY;
        if (diffY < 0) diffY = 0;
        menuContent.style.transform = `translateY(${diffY}px)`;
    };

    const onDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        const dragDistance = menuContent.getBoundingClientRect().top - initialMenuTop;
        const menuHeight = menuContent.offsetHeight;

        if (Math.abs(dragDistance) < 5) {
            menuContent.removeAttribute('style');
            return;
        }

        if (dragDistance > menuHeight * 0.4) {
            if (typeof closeMenuCallback === 'function') {
                closeMenuCallback();
            }
        } else {
            menuContent.style.transition = 'transform 0.3s ease-out';
            menuContent.style.transform = 'translateY(0)';

            const cleanupStyles = () => {
                menuContent.removeAttribute('style');
            };

            menuContent.addEventListener('transitionend', cleanupStyles, {
                once: true
            });
        }
    };

    pillContainer.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    pillContainer.addEventListener('touchstart', onDragStart, {
        passive: true
    });
    document.addEventListener('touchmove', onDragMove);
    document.addEventListener('touchend', onDragEnd);
}

export {
    initDragController
};