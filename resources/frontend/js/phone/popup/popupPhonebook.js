var frontend = frontend ?? {};

frontend.popupPhonebook = (function () {

    function phonebookEvent() {

        const popupDivName = "import";
        const content = `
            <small class="info">This option <u>replaces</u> the existing phone directory with new contacts.</small><br>
            <div id="importer" class="importer">
                <div id="line-numbers" class="importer__lines"></div>
                <textarea id="textarea" class="importer__textarea" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Paste your Phonedata here....\n\nFormat: \n4200000000 Firstname Lastname\n4200000001 Firstname Lastname\n4200000002 Firstname Lastname"></textarea>
            </div>
        `;
        const footer = `
         <button class="ok" class="update" onclick="frontend.popupPhonebook.sendPhonebookImport();">Update contacts</button> 
         <button class="risk hide" onclick="frontend.popupPhonebook.forceSavePhonebookImport();">Update anyway</button>
        `;

        middleman.popupModel.createPopup(popupDivName, 'Import Phone contacts', content, footer);

        const phoneNumbers = backend.dataController.getPhonenumbers();
        setTimeout(() => {
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

    return {
        render: phonebookEvent,
        savePhonebookImport: savePhonebookImport,
        forceSavePhonebookImport: forceSavePhonebookImport,
        sendPhonebookImport: sendPhonebookImport
    };
})();
