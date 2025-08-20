(function() {
    'use strict';

    const SESSION_KEY = 'np_converter_disclaimer_acknowledged';

    function hasAcknowledged() {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
    }

    function setAcknowledged() {
        sessionStorage.setItem(SESSION_KEY, 'true');
    }

    function createPopupHTML() {
        const html = `
            <div class="session-popup-overlay" id="sessionPopupOverlay">
                <div class="session-popup-container">
                    <div class="session-popup-header">
                        <div class="session-popup-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7V12C2 16.55 4.84 20.74 9 22.35C10.24 22.77 11.37 23 12 23C12.63 23 13.76 22.77 15 22.35C19.16 20.74 22 16.55 22 12V7L12 2Z" fill="#ffffff" opacity="0.9"/>
                                <path d="M12 7V13M12 17H12.01" stroke="#2a2a3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h2 class="session-popup-title">Access Required</h2>
                    </div>
                    <div class="session-popup-body">
                        <p class="session-popup-message" style="margin-bottom: 8px;">
                            This is an in-character tool developed for roleplay purposes.
                        </p>
                        <p class="session-popup-message">
                            Your character must have been given specific access rights to continue.
                        </p>
                        <button class="session-popup-button" id="sessionPopupAccept">
                            My character has access
                        </button>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    function showPopup() {
        const popupElement = document.createElement('div');
        popupElement.innerHTML = createPopupHTML();
        document.body.appendChild(popupElement.firstElementChild);

        const acceptButton = document.getElementById('sessionPopupAccept');
        const overlay = document.getElementById('sessionPopupOverlay');

        acceptButton.addEventListener('click', function() {
            setAcknowledged();
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                overlay.remove();
                enablePageInteraction();
            }, 300);
        });

        disablePageInteraction();
    }

    function disablePageInteraction() {
        document.body.style.overflow = 'hidden';
        
        const mainContent = document.body.children;
        for (let i = 0; i < mainContent.length; i++) {
            const element = mainContent[i];
            if (element.id !== 'sessionPopupOverlay' && !element.classList.contains('session-popup-overlay')) {
                element.style.pointerEvents = 'none';
                element.setAttribute('aria-hidden', 'true');
            }
        }
    }

    function enablePageInteraction() {
        document.body.style.overflow = '';
        
        const mainContent = document.body.children;
        for (let i = 0; i < mainContent.length; i++) {
            const element = mainContent[i];
            element.style.pointerEvents = '';
            element.removeAttribute('aria-hidden');
        }
    }

    function addFadeOutAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function init() {
        if (!hasAcknowledged()) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    addFadeOutAnimation();
                    showPopup();
                });
            } else {
                addFadeOutAnimation();
                showPopup();
            }
        }
    }

    init();
})();