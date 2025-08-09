import { initDragController } from './drag-controller.js';

function initMainController() {
    let closeOnClickOutside = true;
    let closeOnEscape = true;
    let isModuleOptionsActive = false;
    // **LA NUEVA BANDERA DE ESTADO**
    let isAnimating = false;

    const toggleButton = document.querySelector('[data-action="toggleModuleOptions"]');
    const moduleOptions = document.querySelector('[data-module="moduleOptions"]');

    if (!toggleButton || !moduleOptions) return;

    const menuContent = moduleOptions.querySelector('.menu-content');

    const logState = (message) => {
        console.groupCollapsed('ProjectLeviathan - (Modules)');
        console.log(`${message} -> isModuleOptionsActive: ${isModuleOptionsActive}, isAnimating: ${isAnimating}`);
        console.groupEnd();
    };

    const _setMenuClosed = () => {
        moduleOptions.classList.add('disabled');
        moduleOptions.classList.remove('active');
        if (isModuleOptionsActive) {
            isModuleOptionsActive = false;
            logState('Module updated');
        }
    };

    const _setMenuOpen = () => {
        moduleOptions.classList.remove('disabled');
        moduleOptions.classList.add('active');
        if (!isModuleOptionsActive) {
            isModuleOptionsActive = true;
            logState('Module updated');
        }
    };

    const closeMenu = () => {
        // **Verificar si ya está animando o si ya está cerrado**
        if (isAnimating || !isModuleOptionsActive) return;

        if (window.innerWidth <= 468 && menuContent) {
            isAnimating = true; // **Bloquear interacciones**
            logState('Animation START - Closing');

            menuContent.style.transition = 'transform 0.3s ease-out';
            menuContent.style.transform = 'translateY(100%)';

            const onTransitionEnd = () => {
                _setMenuClosed();
                menuContent.removeAttribute('style');
                menuContent.removeEventListener('transitionend', onTransitionEnd);
                isAnimating = false; // **Desbloquear interacciones**
                logState('Animation END - Closing');
            };
            menuContent.addEventListener('transitionend', onTransitionEnd);
        } else {
            _setMenuClosed();
        }
    };

    const openMenu = () => {
        // **Verificar si ya está animando o si ya está abierto**
        if (isAnimating || isModuleOptionsActive) return;

        if (window.innerWidth <= 468 && menuContent) {
            isAnimating = true; // **Bloquear interacciones**
            logState('Animation START - Opening');

            menuContent.style.transition = 'none';
            menuContent.style.transform = 'translateY(100%)';
            _setMenuOpen();

            menuContent.offsetHeight;

            menuContent.style.transition = 'transform 0.3s ease-out';
            menuContent.style.transform = 'translateY(0)';

            const onTransitionEnd = () => {
                menuContent.removeAttribute('style');
                menuContent.removeEventListener('transitionend', onTransitionEnd);
                isAnimating = false; // **Desbloquear interacciones**
                logState('Animation END - Opening');
            };
            menuContent.addEventListener('transitionend', onTransitionEnd);
        } else {
            _setMenuOpen();
        }
    };

    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (moduleOptions.classList.contains('disabled')) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    if (closeOnClickOutside) {
        document.addEventListener('click', (e) => {
            if (isAnimating || !isModuleOptionsActive) return; // **Protección añadida**
            if (window.innerWidth <= 468) {
                if (e.target === moduleOptions) closeMenu();
            } else {
                if (!moduleOptions.contains(e.target) && !toggleButton.contains(e.target)) closeMenu();
            }
        });
    }

    if (closeOnEscape) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu(); // La lógica de `closeMenu` ya contiene la protección
        });
    }

    // **Pasamos una función para que el drag-controller sepa si se está animando**
    initDragController(closeMenu, () => isAnimating);

    logState('Initial state');
}

export { initMainController };