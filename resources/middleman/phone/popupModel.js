var middleman = middleman ?? {};

middleman.popupModel = (function () {
    const popupDiv = document.getElementById("popup");
    const loader = document.querySelector('.loader');


    document.addEventListener("keydown", function (event) {   // Close Popups
        if (event.key === "Escape") {
            closePopupDiv();
        }
    });

    function createPopup(popupDivName, title, content, footer = '') {
        closePopupDiv(); // Cloth other popups first
        setTimeout(() => {
            showPopup();
            loader.classList.add("active"); // Activate loader
            popupDiv.classList.add(popupDivName);
            const popupDivBody = document.createElement(popupDivName);
            popupDivBody.innerHTML = `
            <div class="model">
                <div class="head">
                    <button class="close" onclick="closePopupDiv(), deactivateLoader()">X</button>
                    <h2>${title}</h2>
                </div>
                <div class="element">${content}</div>
                <div class="footer">${footer}</div>
            </div>   
            `;
            popupDiv.appendChild(popupDivBody);
        }, 50);
    }

    function closePopupDiv() {
        popupDiv.innerHTML = '';
        const classesToRemove = ["hide", "show", "upload", "bug", "settings", "help", "import", "activity"];
        classesToRemove.forEach(className => {
            popupDiv.classList.remove(className);
        });
        loader.classList.remove('active');
        popupDiv.classList.add("hide");   
    }


    function showPopup() {
        loader.classList.add('active');
        popupDiv.classList.remove("hide");
        popupDiv.classList.add("show");
    }

    function deactivateLoader() {
        try {
            loader.classList.remove("active");
        } catch (error) {
            //console.error("Error removing 'active' class:", error);
            return;
        } finally {
            loader.classList.add("inactive");
        }
    }

    function getBrowserInfo() {
        const userAgent = navigator.userAgent;
        const browserInfo = `
            User Agent: ${userAgent}
            Plattform: ${navigator.platform}
            App Name: ${navigator.appName}
            App Version: ${navigator.appVersion}
        `;
        return browserInfo;
    }
    /////

    return {
        createPopup: createPopup,
        getBrowserInfo: getBrowserInfo
    };

})();
