import { initDragController } from './drag-controller.js';
import { initUrlManager, navigateToUrl, getCurrentUrlState, setupPopStateHandler, setInitialHistoryState } from './url-manager.js';

function initMainController() {
    // --- General Settings ---
    const closeOnClickOutside = true;
    const closeOnEscape = true;
    const allowMultipleActiveModules = false;
    let isAnimating = false;

    // Initialize URL manager
    initUrlManager();
    const initialState = getCurrentUrlState();
    
    // --- State Variables (initialized from current URL) ---
    let isModuleOptionsActive = false;
    let isModuleSurfaceActive = false;
    let isSectionHomeActive = initialState ? initialState.section === 'home' : true;
    let isSectionExploreActive = initialState ? initialState.section === 'explore' : false;
    let isSectionSettingsActive = initialState ? initialState.section === 'settings' : false;
    let isSectionHelpActive = initialState ? initialState.section === 'help' : false;
    
    // Settings subsections
    let isSectionProfileActive = initialState ? initialState.subsection === 'profile' : false;
    let isSectionLoginActive = initialState ? initialState.subsection === 'login' : false;
    let isSectionAccessibilityActive = initialState ? initialState.subsection === 'accessibility' : false;
    let isSectionPurchaseHistoryActive = initialState ? initialState.subsection === 'purchaseHistory' : false;
    
    // Help subsections
    let isSectionPrivacyActive = initialState ? initialState.subsection === 'privacy' : false;
    let isSectionTermsActive = initialState ? initialState.subsection === 'terms' : false;
    let isSectionCookiesActive = initialState ? initialState.subsection === 'cookies' : false;
    let isSectionSuggestionsActive = initialState ? initialState.subsection === 'suggestions' : false;

    // --- Element Selectors ---
    const toggleOptionsButton = document.querySelector('[data-action="toggleModuleOptions"]');
    const moduleOptions = document.querySelector('[data-module="moduleOptions"]');
    const toggleSurfaceButton = document.querySelector('[data-action="toggleModuleSurface"]');
    const moduleSurface = document.querySelector('[data-module="moduleSurface"]');
    const surfaceMain = document.querySelector('[data-surface-type="main"]');
    const surfaceSettings = document.querySelector('[data-surface-type="settings"]');
    const surfaceHelp = document.querySelector('[data-surface-type="help"]');
    
    // Sections
    const sectionHome = document.querySelector('[data-section="sectionHome"]');
    const sectionExplore = document.querySelector('[data-section="sectionExplore"]');
    const sectionSettings = document.querySelector('[data-section="sectionSettings"]');
    const sectionHelp = document.querySelector('[data-section="sectionHelp"]');
    
    // Settings subsections
    const sectionProfile = document.querySelector('[data-section="sectionProfile"]');
    const sectionLogin = document.querySelector('[data-section="sectionLogin"]');
    const sectionAccessibility = document.querySelector('[data-section="sectionAccessibility"]');
    const sectionPurchaseHistory = document.querySelector('[data-section="sectionPurchaseHistory"]');
    
    // Help subsections
    const sectionPrivacy = document.querySelector('[data-section="sectionPrivacy"]');
    const sectionTerms = document.querySelector('[data-section="sectionTerms"]');
    const sectionCookies = document.querySelector('[data-section="sectionCookies"]');
    const sectionSuggestions = document.querySelector('[data-section="sectionSuggestions"]');
    
    // Main navigation buttons
    const toggleSectionHomeButton = document.querySelector('[data-action="toggleSectionHome"]');
    const toggleSectionExploreButton = document.querySelector('[data-action="toggleSectionExplore"]');
    
    // Options menu buttons
    const toggleSectionSettingsButton = document.querySelector('[data-action="toggleSectionSettings"]');
    const toggleSectionHelpButton = document.querySelector('[data-action="toggleSectionHelp"]');
    const toggleSectionPurchaseHistoryButton = document.querySelector('[data-action="toggleSectionPurchaseHistory"]');
    
    // Settings navigation buttons
    const toggleSectionHomeFromSettingsButton = document.querySelector('[data-action="toggleSectionHomeFromSettings"]');
    const toggleSectionProfileButton = document.querySelector('[data-action="toggleSectionProfile"]');
    const toggleSectionLoginButton = document.querySelector('[data-action="toggleSectionLogin"]');
    const toggleSectionAccessibilityButton = document.querySelector('[data-action="toggleSectionAccessibility"]');
    const toggleSectionPurchaseHistoryFromSettingsButton = document.querySelector('[data-action="toggleSectionPurchaseHistoryFromSettings"]');
    
    // Help navigation buttons
    const toggleSectionHomeFromHelpButton = document.querySelector('[data-action="toggleSectionHomeFromHelp"]');
    const toggleSectionPrivacyButton = document.querySelector('[data-action="toggleSectionPrivacy"]');
    const toggleSectionTermsButton = document.querySelector('[data-action="toggleSectionTerms"]');
    const toggleSectionCookiesButton = document.querySelector('[data-action="toggleSectionCookies"]');
    const toggleSectionSuggestionsButton = document.querySelector('[data-action="toggleSectionSuggestions"]');

    if (!toggleOptionsButton || !moduleOptions || !toggleSurfaceButton || !moduleSurface || !sectionHome || !sectionExplore || !sectionSettings || !sectionHelp) return;

    const menuContentOptions = moduleOptions.querySelector('.menu-content');

    // Setup browser navigation handling
    setInitialHistoryState();
    setupPopStateHandler((section, subsection, updateHistory) => {
        handleNavigationChange(section, subsection, updateHistory);
    });

    const updateLogState = () => {
        const toState = (active) => active ? '✅ Activo' : '❌ Inactivo';
        const tableData = {
            '── Modules ──': { section: 'Module Options', status: toState(isModuleOptionsActive) },
            ' ': { section: 'Module Surface', status: toState(isModuleSurfaceActive) },
            '── Sections ──': { section: 'Home', status: toState(isSectionHomeActive) },
            '  ': { section: 'Explore', status: toState(isSectionExploreActive) },
            '   ': { section: 'Settings', status: toState(isSectionSettingsActive) },
            '    ': { section: 'Help', status: toState(isSectionHelpActive) },
            '── Sub-sections (Settings) ──': { section: 'Profile', status: toState(isSectionProfileActive) },
            '     ': { section: 'Login', status: toState(isSectionLoginActive) },
            '      ': { section: 'Accessibility', status: toState(isSectionAccessibilityActive) },
            '       ': { section: 'Purchase History', status: toState(isSectionPurchaseHistoryActive) },
            '── Sub-sections (Help) ──': { section: 'Privacy Policy', status: toState(isSectionPrivacyActive) },
            '        ': { section: 'Terms & Conditions', status: toState(isSectionTermsActive) },
            '         ': { section: 'Cookies Policy', status: toState(isSectionCookiesActive) },
            '          ': { section: 'Suggestions', status: toState(isSectionSuggestionsActive) },
        };
        console.group("ProjectLeviathan - State Overview");
        console.table(tableData);
        console.groupEnd();
    };

    const setMenuOptionsClosed = () => {
        moduleOptions.classList.add('disabled');
        moduleOptions.classList.remove('active');
        menuContentOptions.classList.add('disabled');
        menuContentOptions.classList.remove('active');
        isModuleOptionsActive = false;
    };

    const setMenuOptionsOpen = () => {
        if (!allowMultipleActiveModules && isModuleSurfaceActive) {
            setMenuSurfaceClosed();
        }
        moduleOptions.classList.remove('disabled');
        moduleOptions.classList.add('active');
        menuContentOptions.classList.remove('disabled');
        isModuleOptionsActive = true;
    };

    const closeMenuOptions = () => {
        if (isAnimating || !isModuleOptionsActive) return false;

        if (window.innerWidth <= 468 && menuContentOptions) {
            isAnimating = true;
            menuContentOptions.removeAttribute('style');
            moduleOptions.classList.remove('fade-in');
            moduleOptions.classList.add('fade-out');
            menuContentOptions.classList.remove('active');

            moduleOptions.addEventListener('animationend', () => {
                setMenuOptionsClosed();
                moduleOptions.classList.remove('fade-out');
                isAnimating = false;
            }, { once: true });
        } else {
            setMenuOptionsClosed();
        }
        return true;
    };

    const openMenuOptions = () => {
        if (isAnimating || isModuleOptionsActive) return false;

        setMenuOptionsOpen();

        if (window.innerWidth <= 468 && menuContentOptions) {
            isAnimating = true;
            moduleOptions.classList.remove('fade-out');
            moduleOptions.classList.add('fade-in');

            requestAnimationFrame(() => {
                menuContentOptions.classList.add('active');
            });

            moduleOptions.addEventListener('animationend', () => {
                moduleOptions.classList.remove('fade-in');
                isAnimating = false;
            }, { once: true });
        } else {
            menuContentOptions.classList.add('active');
        }
        return true;
    };

    const setMenuSurfaceClosed = () => {
        moduleSurface.classList.add('disabled');
        moduleSurface.classList.remove('active');
        surfaceMain.classList.add('disabled');
        surfaceMain.classList.remove('active');
        surfaceSettings.classList.add('disabled');
        surfaceSettings.classList.remove('active');
        surfaceHelp.classList.add('disabled');
        surfaceHelp.classList.remove('active');
        isModuleSurfaceActive = false;
    };

    const setMenuSurfaceOpen = () => {
        if (!allowMultipleActiveModules && isModuleOptionsActive) {
            setMenuOptionsClosed();
        }
        moduleSurface.classList.remove('disabled');
        moduleSurface.classList.add('active');
        isModuleSurfaceActive = true;

        if (isSectionSettingsActive) {
            surfaceSettings.classList.remove('disabled');
            surfaceSettings.classList.add('active');
        } else if (isSectionHelpActive) {
            surfaceHelp.classList.remove('disabled');
            surfaceHelp.classList.add('active');
        } else {
            surfaceMain.classList.remove('disabled');
            surfaceMain.classList.add('active');
        }
    };

    const closeMenuSurface = () => {
        if (!isModuleSurfaceActive) return false;
        setMenuSurfaceClosed();
        return true;
    };

    const openMenuSurface = () => {
        if (isModuleSurfaceActive) return false;
        setMenuSurfaceOpen();
        return true;
    };

    const updateMainMenuButtons = (activeButton) => {
        [toggleSectionHomeButton, toggleSectionExploreButton].forEach(button => {
            if (button) button.classList.remove('active');
        });
        if (activeButton) {
            activeButton.classList.add('active');
        }
    };

    const updateSettingsMenuButtons = (activeButton) => {
        [toggleSectionProfileButton, toggleSectionLoginButton, toggleSectionAccessibilityButton, toggleSectionPurchaseHistoryFromSettingsButton].forEach(button => {
            if (button) button.classList.remove('active');
        });
        if (activeButton) {
            activeButton.classList.add('active');
        }
    };

    const updateHelpMenuButtons = (activeButton) => {
        [toggleSectionPrivacyButton, toggleSectionTermsButton, toggleSectionCookiesButton, toggleSectionSuggestionsButton].forEach(button => {
            if (button) button.classList.remove('active');
        });
        if (activeButton) {
            activeButton.classList.add('active');
        }
    };

    const setSectionActive = (sectionToShow, sectionsToHide, activeStateSetter, updateUrl = true) => {
        sectionToShow.classList.remove('disabled');
        sectionToShow.classList.add('active');
        sectionsToHide.forEach(section => {
            section.classList.add('disabled');
            section.classList.remove('active');
        });

        isSectionHomeActive = activeStateSetter === 'home';
        isSectionExploreActive = activeStateSetter === 'explore';
        isSectionSettingsActive = activeStateSetter === 'settings';
        isSectionHelpActive = activeStateSetter === 'help';

        if (activeStateSetter !== 'settings') {
            isSectionProfileActive = false;
            isSectionLoginActive = false;
            isSectionAccessibilityActive = false;
            isSectionPurchaseHistoryActive = false;
        }

        if (activeStateSetter !== 'help') {
            isSectionPrivacyActive = false;
            isSectionTermsActive = false;
            isSectionCookiesActive = false;
            isSectionSuggestionsActive = false;
        }

        if (isSectionSettingsActive) {
            surfaceMain.classList.add('disabled');
            surfaceMain.classList.remove('active');
            surfaceHelp.classList.add('disabled');
            surfaceHelp.classList.remove('active');
            surfaceSettings.classList.remove('disabled');
            surfaceSettings.classList.add('active');
        } else if (isSectionHelpActive) {
            surfaceMain.classList.add('disabled');
            surfaceMain.classList.remove('active');
            surfaceSettings.classList.add('disabled');
            surfaceSettings.classList.remove('active');
            surfaceHelp.classList.remove('disabled');
            surfaceHelp.classList.add('active');
        } else {
            surfaceSettings.classList.add('disabled');
            surfaceSettings.classList.remove('active');
            surfaceHelp.classList.add('disabled');
            surfaceHelp.classList.remove('active');
            surfaceMain.classList.remove('disabled');
            surfaceMain.classList.add('active');
        }

        if (updateUrl) {
            let subsection = null;
            if (isSectionSettingsActive) {
                subsection = isSectionProfileActive ? 'profile' : 
                           isSectionLoginActive ? 'login' : 
                           isSectionAccessibilityActive ? 'accessibility' : 'purchaseHistory';
            } else if (isSectionHelpActive) {
                subsection = isSectionPrivacyActive ? 'privacy' : 
                           isSectionTermsActive ? 'terms' : 
                           isSectionCookiesActive ? 'cookies' : 'suggestions';
            }
            navigateToUrl(activeStateSetter, subsection);
        }
    };

    const setSubSectionActive = (sectionToShow, sectionsToHide, buttonToActivate, buttonsToDeactivate, activeStateSetter, updateUrl = true) => {
        sectionToShow.classList.remove('disabled');
        sectionToShow.classList.add('active');
        sectionsToHide.forEach(section => {
            section.classList.add('disabled');
            section.classList.remove('active');
        });

        buttonToActivate.classList.add('active');
        buttonsToDeactivate.forEach(button => {
            button.classList.remove('active');
        });

        // Settings subsections
        isSectionProfileActive = activeStateSetter === 'profile';
        isSectionLoginActive = activeStateSetter === 'login';
        isSectionAccessibilityActive = activeStateSetter === 'accessibility';
        isSectionPurchaseHistoryActive = activeStateSetter === 'purchaseHistory';

        // Help subsections
        isSectionPrivacyActive = activeStateSetter === 'privacy';
        isSectionTermsActive = activeStateSetter === 'terms';
        isSectionCookiesActive = activeStateSetter === 'cookies';
        isSectionSuggestionsActive = activeStateSetter === 'suggestions';

        if (updateUrl) {
            const mainSection = isSectionSettingsActive ? 'settings' : 'help';
            navigateToUrl(mainSection, activeStateSetter);
        }
    };

    const handleNavigationChange = (section, subsection = null, updateUrl = true) => {
        if (section === 'home') {
            setSectionActive(sectionHome, [sectionExplore, sectionSettings, sectionHelp], 'home', updateUrl);
            updateMainMenuButtons(toggleSectionHomeButton);
        } else if (section === 'explore') {
            setSectionActive(sectionExplore, [sectionHome, sectionSettings, sectionHelp], 'explore', updateUrl);
            updateMainMenuButtons(toggleSectionExploreButton);
        } else if (section === 'settings') {
            setSectionActive(sectionSettings, [sectionHome, sectionExplore, sectionHelp], 'settings', false);
            
            const sub = subsection || 'profile';
            if (sub === 'profile') {
                setSubSectionActive(sectionProfile, [sectionLogin, sectionAccessibility, sectionPurchaseHistory], 
                    toggleSectionProfileButton, [toggleSectionLoginButton, toggleSectionAccessibilityButton, toggleSectionPurchaseHistoryFromSettingsButton], 'profile', updateUrl);
            } else if (sub === 'login') {
                setSubSectionActive(sectionLogin, [sectionProfile, sectionAccessibility, sectionPurchaseHistory], 
                    toggleSectionLoginButton, [toggleSectionProfileButton, toggleSectionAccessibilityButton, toggleSectionPurchaseHistoryFromSettingsButton], 'login', updateUrl);
            } else if (sub === 'accessibility') {
                setSubSectionActive(sectionAccessibility, [sectionProfile, sectionLogin, sectionPurchaseHistory], 
                    toggleSectionAccessibilityButton, [toggleSectionProfileButton, toggleSectionLoginButton, toggleSectionPurchaseHistoryFromSettingsButton], 'accessibility', updateUrl);
            } else if (sub === 'purchaseHistory') {
                setSubSectionActive(sectionPurchaseHistory, [sectionProfile, sectionLogin, sectionAccessibility], 
                    toggleSectionPurchaseHistoryFromSettingsButton, [toggleSectionProfileButton, toggleSectionLoginButton, toggleSectionAccessibilityButton], 'purchaseHistory', updateUrl);
            }
        } else if (section === 'help') {
            setSectionActive(sectionHelp, [sectionHome, sectionExplore, sectionSettings], 'help', false);
            
            const sub = subsection || 'privacy';
            if (sub === 'privacy') {
                setSubSectionActive(sectionPrivacy, [sectionTerms, sectionCookies, sectionSuggestions], 
                    toggleSectionPrivacyButton, [toggleSectionTermsButton, toggleSectionCookiesButton, toggleSectionSuggestionsButton], 'privacy', updateUrl);
            } else if (sub === 'terms') {
                setSubSectionActive(sectionTerms, [sectionPrivacy, sectionCookies, sectionSuggestions], 
                    toggleSectionTermsButton, [toggleSectionPrivacyButton, toggleSectionCookiesButton, toggleSectionSuggestionsButton], 'terms', updateUrl);
            } else if (sub === 'cookies') {
                setSubSectionActive(sectionCookies, [sectionPrivacy, sectionTerms, sectionSuggestions], 
                    toggleSectionCookiesButton, [toggleSectionPrivacyButton, toggleSectionTermsButton, toggleSectionSuggestionsButton], 'cookies', updateUrl);
            } else if (sub === 'suggestions') {
                setSubSectionActive(sectionSuggestions, [sectionPrivacy, sectionTerms, sectionCookies], 
                    toggleSectionSuggestionsButton, [toggleSectionPrivacyButton, toggleSectionTermsButton, toggleSectionCookiesButton], 'suggestions', updateUrl);
            }
        }
        
        if (window.innerWidth <= 468) {
            closeMenuSurface();
            closeMenuOptions();
        }
        
        updateLogState();
    };

    const handleResize = () => {
        if (isModuleOptionsActive) {
            if (window.innerWidth <= 468) {
                if (!menuContentOptions.classList.contains('active')) {
                    menuContentOptions.classList.add('active');
                }
            } else {
                menuContentOptions.classList.remove('active');
                menuContentOptions.removeAttribute('style');
            }
        }
    };

    // Event Listeners
    toggleOptionsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isModuleOptionsActive ? closeMenuOptions() : openMenuOptions();
        updateLogState();
    });

    toggleSurfaceButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isModuleSurfaceActive ? closeMenuSurface() : openMenuSurface();
        updateLogState();
    });

    // Main navigation
    if (toggleSectionHomeButton) {
        toggleSectionHomeButton.addEventListener('click', () => {
            if (!isSectionHomeActive) {
                handleNavigationChange('home');
            }
        });
    }

    if (toggleSectionExploreButton) {
        toggleSectionExploreButton.addEventListener('click', () => {
            if (!isSectionExploreActive) {
                handleNavigationChange('explore');
            }
        });
    }

    // Navigation from options menu
    if (toggleSectionSettingsButton) {
        toggleSectionSettingsButton.addEventListener('click', () => {
            handleNavigationChange('settings', 'profile');
            closeMenuOptions();
        });
    }

    if (toggleSectionHelpButton) {
        toggleSectionHelpButton.addEventListener('click', () => {
            handleNavigationChange('help', 'privacy');
            closeMenuOptions();
        });
    }

    if (toggleSectionPurchaseHistoryButton) {
        toggleSectionPurchaseHistoryButton.addEventListener('click', () => {
            handleNavigationChange('settings', 'purchaseHistory');
            closeMenuOptions();
        });
    }

    // Navigation from settings surface
    if (toggleSectionHomeFromSettingsButton) {
        toggleSectionHomeFromSettingsButton.addEventListener('click', () => {
            handleNavigationChange('home');
        });
    }

    if (toggleSectionProfileButton) {
        toggleSectionProfileButton.addEventListener('click', () => {
            if (!isSectionProfileActive) {
                handleNavigationChange('settings', 'profile');
            }
        });
    }

    if (toggleSectionLoginButton) {
        toggleSectionLoginButton.addEventListener('click', () => {
            if (!isSectionLoginActive) {
                handleNavigationChange('settings', 'login');
            }
        });
    }

    if (toggleSectionAccessibilityButton) {
        toggleSectionAccessibilityButton.addEventListener('click', () => {
            if (!isSectionAccessibilityActive) {
                handleNavigationChange('settings', 'accessibility');
            }
        });
    }

    if (toggleSectionPurchaseHistoryFromSettingsButton) {
        toggleSectionPurchaseHistoryFromSettingsButton.addEventListener('click', () => {
            if (!isSectionPurchaseHistoryActive) {
                handleNavigationChange('settings', 'purchaseHistory');
            }
        });
    }

    // Navigation from help surface
    if (toggleSectionHomeFromHelpButton) {
        toggleSectionHomeFromHelpButton.addEventListener('click', () => {
            handleNavigationChange('home');
        });
    }

    if (toggleSectionPrivacyButton) {
        toggleSectionPrivacyButton.addEventListener('click', () => {
            if (!isSectionPrivacyActive) {
                handleNavigationChange('help', 'privacy');
            }
        });
    }

    if (toggleSectionTermsButton) {
        toggleSectionTermsButton.addEventListener('click', () => {
            if (!isSectionTermsActive) {
                handleNavigationChange('help', 'terms');
            }
        });
    }

    if (toggleSectionCookiesButton) {
        toggleSectionCookiesButton.addEventListener('click', () => {
            if (!isSectionCookiesActive) {
                handleNavigationChange('help', 'cookies');
            }
        });
    }

    if (toggleSectionSuggestionsButton) {
        toggleSectionSuggestionsButton.addEventListener('click', () => {
            if (!isSectionSuggestionsActive) {
                handleNavigationChange('help', 'suggestions');
            }
        });
    }

    // Click outside to close menus
    if (closeOnClickOutside) {
        document.addEventListener('click', (e) => {
            if (isAnimating) return;
            let optionsStateChanged = false;
            let surfaceStateChanged = false;

            if (isModuleOptionsActive) {
                if (window.innerWidth <= 468) {
                    if (e.target === moduleOptions) {
                        optionsStateChanged = closeMenuOptions();
                    }
                } else {
                    if (!moduleOptions.contains(e.target) && !toggleOptionsButton.contains(e.target)) {
                        optionsStateChanged = closeMenuOptions();
                    }
                }
            }

            if (isModuleSurfaceActive && !moduleSurface.contains(e.target) && !toggleSurfaceButton.contains(e.target)) {
                surfaceStateChanged = closeMenuSurface();
            }

            if (optionsStateChanged || surfaceStateChanged) {
                updateLogState();
            }
        });
    }

    // Close with Escape key
    if (closeOnEscape) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const optionsClosed = closeMenuOptions();
                const surfaceClosed = closeMenuSurface();
                if (optionsClosed || surfaceClosed) {
                    updateLogState();
                }
            }
        });
    }

    window.addEventListener('resize', handleResize);
    initDragController(closeMenuOptions, () => isAnimating);
    
    // Initialize state based on current URL
    updateLogState();
    console.log('ProjectLeviathan initialized with URL routing support');
}

export { initMainController };