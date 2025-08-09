export function initMainController() {
    // === CONTROLES ===
    let closeOnClickOutside = true;
    let closeOnEscape = true;
    let isModuleOptionsActive = false;
    // =================

    const toggleButton = document.querySelector('[data-action="toggleModuleOptions"]');
    const moduleOptions = document.querySelector('[data-module="moduleOptions"]');

    if (!toggleButton || !moduleOptions) return;

    /**
     * Registra un mensaje de estado en la consola, con "ProjectLeviathan - (Modules)" como el grupo expandible.
     * @param {string} message - El mensaje específico a mostrar (ej. "Initial state", "Module updated").
     */
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

    // Listener para el botón principal que abre/cierra el menú.
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (moduleOptions.classList.contains('disabled')) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    // Listener para cerrar el menú haciendo clic fuera.
    if (closeOnClickOutside) {
        document.addEventListener('click', (e) => {
            if (isModuleOptionsActive && !moduleOptions.contains(e.target) && !toggleButton.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // Listener para cerrar el menú con la tecla 'Escape'.
    if (closeOnEscape) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isModuleOptionsActive) {
                closeMenu();
            }
        });
    }

    // Muestra el estado inicial al cargar la página.
    logState('Initial state');
}