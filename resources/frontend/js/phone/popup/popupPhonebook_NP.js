var frontend = frontend ?? {};

frontend.popupPhonebook_NP = (function () {
   

    function phonebookEvent() {

        const popupDivName = "import_np";
        const content = `

            <small class="info">You can copy and paste your <u>NP in-game</u> phonebook-contacts here. <br>This list will be added to the NP-Converter contacts.</small><br>
                <div id="importernp" class="importer">
                    <textarea id="npPhone" class="importer__textarea" autocomplete="off" autocorrect="off" spellcheck="false" 
                    placeholder="Post the NP-Phone contacts here... \n[CTRL+A] + [CTRL+C] inside the in-game phone.\n\nOutput looks like this:\n\nJD\nJohn Doe\n(420) 000-0000" ></textarea>
                </div>
        `;
        const footer = `
         <button class="np" class="update" onclick="frontend.popupPhonebook_NP.convertNpPhonebook();">Upload NP-Contact</button>
        `;

        middleman.popupModel.createPopup(popupDivName, 'Import NP-Phone contacts', content, footer);

    }

    function convertNpPhonebook() {
        try {
            const textarea = document.getElementById('npPhone');            
            if (!textarea || !textarea.value) {
                throw new Error("The NP-phone contacts textbox appears to be empty. ");
            }

            // const jsonString = JSON.stringify(textarea.value, null, 2);
            // backend.phonebookHelper.uploadNopixelPhoneData(jsonString);

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
        convertNpPhonebook: convertNpPhonebook
    };
})();
