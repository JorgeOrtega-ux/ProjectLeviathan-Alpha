function initMainController() {
    let closeOnClickOutside = true;
    let closeOnEscape = true;
    let isModuleOptionsActive = false;

    const toggleButton = document.querySelector('[data-action="toggleModuleOptions"]');
    const moduleOptions = document.querySelector('[data-module="moduleOptions"]');

    if (!toggleButton || !moduleOptions) return;

    const logState = (message) => {
        console.groupCollapsed('ProjectLeviathan - (Modules)');
        console.log(`${message} -> isModuleOptionsActive: ${isModuleOptionsActive}`);
        console.groupEnd();
    };

    const closeMenu = () => {
        moduleOptions.classList.add('disabled');
        moduleOptions.classList.remove('active');
        if (isModuleOptionsActive) {
            isModuleOptionsActive = false;
            logState('Module updated');
        }
    };

    const openMenu = () => {
        moduleOptions.classList.remove('disabled');
        moduleOptions.classList.add('active');
        if (!isModuleOptionsActive) {
            isModuleOptionsActive = true;
            logState('Module updated');
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
            if (isModuleOptionsActive && !moduleOptions.contains(e.target) && !toggleButton.contains(e.target)) {
                closeMenu();
            }
        });
    }

    if (closeOnEscape) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isModuleOptionsActive) {
                closeMenu();
            }
        });
    }

    logState('Initial state');
}

export { initMainController };