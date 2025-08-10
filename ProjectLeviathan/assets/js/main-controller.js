import { initDragController } from './drag-controller.js';

function initMainController() {
    let closeOnClickOutside = true;
    let closeOnEscape = true;
    let allowMultipleActiveModules = false;

    let isModuleOptionsActive = false;
    let isModuleSurfaceActive = false;
    let isAnimating = false;

    const toggleOptionsButton = document.querySelector('[data-action="toggleModuleOptions"]');
    const moduleOptions = document.querySelector('[data-module="moduleOptions"]');
    const toggleSurfaceButton = document.querySelector('[data-action="toggleModuleSurface"]');
    const moduleSurface = document.querySelector('[data-module="moduleSurface"]');

    if (!toggleOptionsButton || !moduleOptions || !toggleSurfaceButton || !moduleSurface) return;

    const menuContentOptions = moduleOptions.querySelector('.menu-content');

    const _setMenuOptionsClosed = () => {
        moduleOptions.classList.add('disabled');
        moduleOptions.classList.remove('active');
        isModuleOptionsActive = false;
    };

    const _setMenuOptionsOpen = () => {
        if (!allowMultipleActiveModules && isModuleSurfaceActive) {
            _setMenuSurfaceClosed();
        }
        moduleOptions.classList.remove('disabled');
        moduleOptions.classList.add('active');
        isModuleOptionsActive = true;
    };

    const closeMenuOptions = () => {
        if (isAnimating || !isModuleOptionsActive) return false;

        if (window.innerWidth <= 468 && menuContentOptions) {
            isAnimating = true;
            menuContentOptions.removeAttribute('style');
            moduleOptions.classList.remove('fade-in');
            moduleOptions.classList.add('fade-out');
            menuContentOptions.classList.remove('is-open');

            moduleOptions.addEventListener('animationend', () => {
                _setMenuOptionsClosed();
                moduleOptions.classList.remove('fade-out');
                isAnimating = false;
            }, { once: true });
        } else {
            _setMenuOptionsClosed();
        }
        return true;
    };

    const openMenuOptions = () => {
        if (isAnimating || isModuleOptionsActive) return false;

        _setMenuOptionsOpen();

        if (window.innerWidth <= 468 && menuContentOptions) {
            isAnimating = true;
            moduleOptions.classList.remove('fade-out');
            moduleOptions.classList.add('fade-in');

            requestAnimationFrame(() => {
                menuContentOptions.classList.add('is-open');
            });

            moduleOptions.addEventListener('animationend', () => {
                moduleOptions.classList.remove('fade-in');
                isAnimating = false;
            }, { once: true });
        }
        return true;
    };

    const _setMenuSurfaceClosed = () => {
        moduleSurface.classList.add('disabled');
        moduleSurface.classList.remove('active');
        isModuleSurfaceActive = false;
    };

    const _setMenuSurfaceOpen = () => {
        if (!allowMultipleActiveModules && isModuleOptionsActive) {
            _setMenuOptionsClosed();
        }
        moduleSurface.classList.remove('disabled');
        moduleSurface.classList.add('active');
        isModuleSurfaceActive = true;
    };

    const closeMenuSurface = () => {
        if (!isModuleSurfaceActive) return false;
        _setMenuSurfaceClosed();
        return true;
    };

    const openMenuSurface = () => {
        if (isModuleSurfaceActive) return false;
        _setMenuSurfaceOpen();
        return true;
    };

    const handleResize = () => {
        if (isModuleOptionsActive) {
            if (window.innerWidth <= 468) {
                if (!menuContentOptions.classList.contains('is-open')) {
                    menuContentOptions.classList.add('is-open');
                }
            } else {
                menuContentOptions.classList.remove('is-open');
                menuContentOptions.removeAttribute('style');
            }
        }
    };

    toggleOptionsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isModuleOptionsActive ? closeMenuOptions() : openMenuOptions();
    });

    toggleSurfaceButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isModuleSurfaceActive ? closeMenuSurface() : openMenuSurface();
    });

    if (closeOnClickOutside) {
        document.addEventListener('click', (e) => {
            if (isAnimating) return;

            if (isModuleOptionsActive) {
                if (window.innerWidth <= 468) {
                    if (e.target === moduleOptions) closeMenuOptions();
                } else {
                    if (!moduleOptions.contains(e.target) && !toggleOptionsButton.contains(e.target)) {
                        closeMenuOptions();
                    }
                }
            }

            if (isModuleSurfaceActive && !moduleSurface.contains(e.target) && !toggleSurfaceButton.contains(e.target)) {
                closeMenuSurface();
            }
        });
    }

    if (closeOnEscape) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenuOptions();
                closeMenuSurface();
            }
        });
    }

    window.addEventListener('resize', handleResize);
    initDragController(closeMenuOptions, () => isAnimating);
}

export {
    initMainController
};