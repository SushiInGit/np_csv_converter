var middleman = middleman ?? {};

middleman.popupModel = (function () {
    const popupDiv = document.getElementById("popup");
    const loader = document.querySelector('.loader');


    document.addEventListener("keydown", function (event) {   // Close Popups
        if (event.key === "Escape") {
            middleman.popupModel.closePopupDiv();
            middleman.popupModel.deactivateLoader();
        }
    });

    function createPopup(popupDivName, title, content, footer = '') {
        middleman.popupModel.closePopupDiv(); // Cloth other popups first
        setTimeout(() => {
            showPopup();
            loader.classList.add("active"); // Activate loader
            popupDiv.classList.add(popupDivName);
            const popupDivBody = document.createElement(popupDivName);
            popupDivBody.innerHTML = `
            <div class="model">
                <div class="head">
                    <button class="close" onclick="middleman.popupModel.closePopupDiv(), middleman.popupModel.deactivateLoader()">X</button>
                    <h2>${title}</h2>
                </div>
                <div class="element">${content}</div>
                <div class="footer">${footer}</div>
            </div>   
            `;
            popupDiv.appendChild(popupDivBody);
        }, 50);
    }

    function delPhone(item) {
        if (item) {
            backend.storageSelector.deleteTextsAndCalls(item);
    
            if (backend.storageSelector.searchRecord(item, true, 'last') === false) {
               window.location.href = 'phone.html';
            }
    
            if (backend.storageSelector.searchRecord(item, false) === false) {
                backend.storageSelector.searchRecord(item, true, 'last');
                global.alertsystem('success', `You deleted ${item.replace(/_/g, ' ')}.`, 7);
                const getName = backend.storageSelector.lastRecordName().lastPhone[0];
                backend.storageShow.saveLastSearchRecord(getName, true);
            }

            middleman.popupModel.closePopupDiv(); 
            clearOldData();
            frontend.popupUpload.render();
            //window.location.href = 'phone.html';
        }
    }
    function delBank(item) {
        if (item) {
            backend.storageSelector.deleteBank(item);
    
            if (backend.storageSelector.searchRecord(item, true, 'last') === false) {
               window.location.href = 'bank.html';
            }
    
            if (backend.storageSelector.searchRecord(item, false) === false) {
                backend.storageSelector.searchRecord(item, true, 'last');
                global.alertsystem('success', `You deleted ${item.replace(/_/g, ' ')}.`, 7);
                const getName = backend.storageSelector.lastRecordName().lastPhone[0];
                backend.storageShow.saveLastSearchRecord(getName, true);
            }

            middleman.popupModel.closePopupDiv(); 
            clearOldData();
            frontend.popupUpload.render();
            //window.location.href = 'phone.html';
        }
    }
       
    function clearOldData() { // Clears all old shown data
        const bannerRight = document.querySelector(".banner .right.noselect");
        const bannerCenter = document.querySelector(".banner .center.noselect");
        const commList = document.querySelector(".menu .list.noselect");
        const outputHead = document.querySelector(".output .header.noselect");
        const outputMessages = document.querySelector(".output .messages");
        bannerRight.innerHTML = '';
        bannerCenter.innerHTML = "";
        commList.innerHTML = "";
        outputHead.innerHTML = "";
        outputMessages.innerHTML = "";
    }

    function closePopupDiv() {
        popupDiv.innerHTML = '';
        const classesToRemove = ["hide", "show", "upload", "bug", "settings", "help", "import", "activity", "confirm-delete"];
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
        getBrowserInfo: getBrowserInfo,
        closePopupDiv: closePopupDiv,
        deactivateLoader: deactivateLoader,
        delPhone: delPhone,
        delBank: delBank 
    };

})();
