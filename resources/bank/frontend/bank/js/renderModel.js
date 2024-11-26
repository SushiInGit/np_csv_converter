var frontend = frontend ?? {};

frontend.renderModel = (function () {
    const popupDiv = document.getElementById("popup");
    const loader = document.querySelector('.loader');


    document.addEventListener("keydown", function (event) {   // Close Popups
        if (event.key === "Escape") {
            frontend.renderModel.closePopupDiv();
            frontend.renderModel.deactivateLoader();
            const removeStatusMessage = document.querySelectorAll(".status-message");
            removeStatusMessage.forEach((element) => element.remove());
        }
    });

    function createPopup(popupDivName, title, content, footer = '') {

        frontend.renderModel.closePopupDiv(); // Cloth other popups first
        setTimeout(() => {
            showPopup();
            loader.classList.add("active"); // Activate loader
            popupDiv.classList.add(popupDivName);
            const popupDivBody = document.createElement(popupDivName);
            popupDivBody.innerHTML = `
            <div class="model">
                <div class="head">
                    <button class="close" onclick="frontend.renderModel.closePopupDiv(), frontend.renderModel.deactivateLoader()">X</button>
                    <h2>${title}</h2>
                </div>
                <div class="element">${content}</div>
                <div class="footer">${footer}</div>
            </div>   
            `;
            popupDiv.appendChild(popupDivBody);
        }, 50);
    }


    function delBank(dbName) {
        if (dbName) {
            console.log(dbName)
            indexedDBHelper.removeDatabank("BANK_" + dbName);
            frontend.renderModel.closePopupDiv();
            clearOldData();
            frontend.popupUpload.render();
            global.alertsystem('success', `Databank: '${dbName}' is removed.`, 5);
            /* UMAMI */
            try {
                global.helperUserinfo.trackDel("BANK", dbName);
            } catch (error) {
                console.error("An error occurred while tracking changes:", error.message);
            }
        }
    }

    function clearOldData() { // Clears all old shown data
        const bannerRight = document.querySelector(".banner .right.noselect");
        const bannerCenter = document.querySelector(".banner .center.noselect");
        const commList = document.querySelector(".menu .list.noselect .pov");
        const outputHeadLeft = document.querySelector(".output .header.noselect .left");
        const outputHeadRight = document.querySelector(".output .header.noselect .right");
        const outputMessages = document.querySelector(".output .messages .bankoutput");
        const outputMessagesFilter = document.querySelector(".output .messages .filter .treeselect");
        bannerRight.innerHTML = ``;
        bannerCenter.innerHTML = ``;
        commList.innerHTML = ``;
        outputHeadLeft.innerHTML = ``;
        outputHeadRight.innerHTML = ``;
        outputMessages.innerHTML = ``;
        outputMessagesFilter.innerHTML = ``;
    }

    function closePopupDiv() {
        popupDiv.innerHTML = '';
        const classesToRemove = ["hide", "show", "upload", "bug", "settings", "help", "import", "activity", "confirm-delete", "phonebook", "import_np"];
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

    /////

    return {
        createPopup: createPopup,
        closePopupDiv: closePopupDiv,
        deactivateLoader: deactivateLoader,
        delBank: delBank,
        clear: clearOldData
    };

})();