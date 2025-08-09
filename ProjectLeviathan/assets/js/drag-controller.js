/**
 * drag-controller.js
 *
 * Maneja la lógica para arrastrar y cerrar el menú de opciones.
 * Acepta un callback para cerrar y otro para verificar el estado de la animación.
 * El arrastre se inicia desde cualquier parte del `pill-container`.
 */
export function initDragController(closeMenuCallback, isAnimatingCallback) {
    const moduleOptions = document.querySelector('[data-module="moduleOptions"]');
    if (!moduleOptions) return;

    const menuContent = moduleOptions.querySelector('.menu-content');
    // **Seleccionamos el contenedor entero, no solo el manejador.**
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
        if (!isDragging || window.innerWidth > 468) return;

        const currentY = e.pageY || e.touches[0].pageY;
        const diffY = currentY - startY;

        if (diffY > 0) {
            menuContent.style.transform = `translateY(${diffY}px)`;
        }
    };

    const onDragEnd = () => {
        if (!isDragging || window.innerWidth > 468) return;
        isDragging = false;

        const menuHeight = menuContent.offsetHeight;
        const dragDistance = menuContent.getBoundingClientRect().top - initialMenuTop;

        if (dragDistance > menuHeight * 0.4) {
            if (typeof closeMenuCallback === 'function') {
                closeMenuCallback();
            }
        } else {
            menuContent.style.transition = 'transform 0.3s ease-in-out';
            menuContent.style.transform = 'translateY(0)';

            const onTransitionEnd = () => {
                menuContent.removeAttribute('style');
                menuContent.removeEventListener('transitionend', onTransitionEnd);
            };
            menuContent.addEventListener('transitionend', onTransitionEnd);
        }
    };

    // **LA CORRECCIÓN CLAVE:**
    // **Asignamos los eventos al `pillContainer` en lugar del `dragHandle`.**
    pillContainer.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    pillContainer.addEventListener('touchstart', onDragStart);
    document.addEventListener('touchmove', onDragMove);
    document.addEventListener('touchend', onDragEnd);
}