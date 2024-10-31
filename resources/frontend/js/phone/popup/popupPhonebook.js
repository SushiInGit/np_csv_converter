var frontend = frontend ?? {};

frontend.popupPhonebook = (function () {
    function swap() {
        const importer = document.getElementById("importer");
        const importernp = document.getElementById("importernp");
        const button = document.getElementById("swap");
        setTimeout(() => {
            const riskButton = document.querySelector('#popup .footer .risk');
            const updateButton = document.querySelector('#popup .footer .ok');
            const npButton = document.querySelector('#popup .footer .np');
            const infoText = document.querySelector('#popup .element .info');


            if (importer.style.height === "0px") {
                importer.style.height = "170px";
                importernp.style.height = "0px";
                button.textContent = "⇄ Swap to NP-Phone Import";
                riskButton.classList = "risk hide";
                npButton.classList = "np hide";
                updateButton.classList = "ok show";
                infoText.innerHTML = "This option <u>replaces</u> the existing phone directory with new contacts.";

            } else {
                importer.style.height = "0px";
                importernp.style.height = "170px";
                button.textContent = "⇄ Swap to Converter Import";
                updateButton.classList = "ok hide";
                riskButton.classList = "risk hide";
                npButton.classList = "np show";
                infoText.innerHTML = "You can copy and paste your <u>NP in-game</u> phonebook-contacts here. <br>This list will be added to the NP-Converter contacts.";

            }
        }, 50);
    }

    function phonebookEvent() {

        const popupDivName = "import";
        const content = `

            <small class="info">This option <u>replaces</u> the existing phone directory with new contacts.</small><br>
            <div style="display:flex; justify-content: center;" ><button id="swap" class="swap" onclick="frontend.popupPhonebook.swap()">⇄ Swap to NP-Phone Import</button></div>
                <div id="importer" class="importer">
                    <div id="line-numbers" class="importer__lines"></div>
                    <textarea id="textarea" class="importer__textarea" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Paste your Phonedata here....\n\nFormat: \n4200000000 Firstname Lastname\n4200000001 Firstname Lastname\n4200000002 Firstname Lastname"></textarea>
                </div>
                <div id="importernp" class="importer">
                    <textarea id="npPhone" class="importer__textarea" autocomplete="off" autocorrect="off" spellcheck="false" 
                    placeholder="Post you NP-Phone contacts here... \nLooks like this then: \n\n2002\nJD\nJohn Doe\n(420) 000-0000" ></textarea>
                 </div>
        `;
        const footer = `
         <button class="ok" class="update" onclick="frontend.popupPhonebook.sendPhonebookImport();">Update contacts</button> 
         <button class="risk hide" onclick="frontend.popupPhonebook.forceSavePhonebookImport();">Update anyway</button>
         <button class="np hide" class="update" onclick="frontend.popupPhonebook.convertNpPhonebook();">Upload NP-Contact</button>
        `;

        middleman.popupModel.createPopup(popupDivName, 'Import Phone contacts', content, footer);

        const phoneNumbers = backend.dataController.getPhonenumbers();
        setTimeout(() => {
            document.getElementById("importernp").style.height = "0px";
            try {
                const textarea = document.getElementById('textarea');
                let output = '';
                phoneNumbers.forEach(entry => {
                    output += `${entry.number} ${entry.name}\n`;
                });
                textarea.value = output;
            } catch (error) {
                //console.error('An error occurred:', error);
                return;
            }

            try {
                const textarea = document.getElementById('npPhone');
                let output = '';
                textarea.value = output;
            } catch (error) {
                //console.error('An error occurred:', error);
                return;
            }
        }, 50);

    }

    function savePhonebookImport(textarea) {
        backend.phonebookHelper.uploadPhonebookData(textarea.value);
        middleman.popupModel.closePopupDiv();
        global.alertsystem('success', 'Contacts are ready to go! <br>Loading now—thank you for your patience.', 4);
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    };

    function sendPhonebookImport() {
        try {
            const textarea = document.querySelector('#popup .element #textarea');
            const riskButton = document.querySelector('#popup .footer .risk');

            if (!textarea || !textarea.value) {
                throw new Error("The phone contacts textbox appears to be empty. ");
            }

            const lines = textarea.value.trim().split('\n');
            //const phoneNumberPattern = /^(420\d{7}|\(420\)\s?\d{3}\s?\d{4}|\d{10}) (.+)$/;
            const phoneNumberPattern = /^(420\d{7}|\(420\)\s?\d{3}\s?\d{4}|\d{10})\s*(.+)$/;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim(); // T

                if (!phoneNumberPattern.test(line)) {
                    riskButton.classList.remove("hide");
                    riskButton.classList.add("show");
                    throw new Error(`Line ${i + 1} is incorrect: '${line}'.<br>Each phone contact must be in the format:<br>'4201234567 John Doe' or '(420) 123 4567 John Doe'.`);
                }
            }
            frontend.popupPhonebook.savePhonebookImport(textarea);
        } catch (error) {
            global.alertsystem('error', error.message, 7);
        }
    }
    function forceSavePhonebookImport() {
        try {
            const textarea = document.querySelector('#popup .element #textarea');
            const riskButton = document.querySelector('#popup .element .risk');
            if (!textarea || !textarea.value) {
                throw new Error("The phone contacts textbox appears to be empty. ");
            }

            const lines = textarea.value.trim().split('\n');
            const phoneNumberPattern = /^(420\d{7}|\(420\)\s?\d{3}\s?\d{4}|\d{10}) (.+)$/;
            let skippedLines = 0;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (!phoneNumberPattern.test(line)) {
                    skippedLines++;
                }
            }

            if (skippedLines > 0) {
                throw new Error(`Skipped ${skippedLines} broken contacts`);
            }
            frontend.popupPhonebook.savePhonebookImport(textarea);

        } catch (error) {
            global.alertsystem('warning', error.message, 4);
            frontend.popupPhonebook.savePhonebookImport(textarea);
        }
    }
    function convertNpPhonebook() {
        try {
            const textarea = document.getElementById('npPhone');            
            if (!textarea || !textarea.value) {
                throw new Error("The NP-phone contacts textbox appears to be empty. ");
            }

            backend.phonebookHelper.uploadNopixelPhoneData(textarea.value);

            middleman.popupModel.closePopupDiv();
            global.alertsystem('success', 'Contacts are ready to go! <br>Loading now—thank you for your patience.', 4);
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        } catch (error) {
            global.alertsystem('error', error.message, 7);
        }
    }
    return {
        render: phonebookEvent,
        savePhonebookImport: savePhonebookImport,
        forceSavePhonebookImport: forceSavePhonebookImport,
        sendPhonebookImport: sendPhonebookImport,
        swap: swap,
        convertNpPhonebook: convertNpPhonebook
    };
})();
