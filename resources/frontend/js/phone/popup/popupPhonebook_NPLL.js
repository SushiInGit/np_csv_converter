var frontend = frontend ?? {};

frontend.popupPhonebook_NPLL = (function () {
   

    function phonebookEvent() {

        const popupDivName = "import_np";
        const content = `

            <small class="info">You can copy and paste the <u>NP-Lemon List</u> here. <br>This list will be add the contacts to the NP-Converter contacts.</small><br>
                <div id="importernp" class="importer">
                    <textarea id="npPhone" class="importer__textarea" autocomplete="off" autocorrect="off" spellcheck="false" 
                    placeholder="Post the Lemon List here... \n[CTRL+A] + [CTRL+C] inside the in-game phone.
                    \n\nOutput looks like this:\n\nLemon List\nLocal services at your fingertips" ></textarea>
                </div>
        `;
        const footer = `
         <button class="np" class="update" onclick="frontend.popupPhonebook_NPLL.convertNpLL();">Upload NP-Contact</button>
        `;

        middleman.popupModel.createPopup(popupDivName, 'Import Lemon List', content, footer);

    }

    function convertNpLL() {
        try {
            const textarea = document.getElementById('npPhone');            
            if (!textarea || !textarea.value) {
                throw new Error("The Lemon-List textbox appears to be empty. ");
            }

            backend.phonebookHelper.uploadNopixelLemonListData(textarea.value);

            middleman.popupModel.closePopupDiv();
            global.alertsystem('success', 'Lemon_list contacts are exported and added to the contacts! <br>Loading now—thank you for your patience.', 4);
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        } catch (error) {
            global.alertsystem('error', error.message, 7);
        }
    }
    return {
        render: phonebookEvent,
        convertNpLL: convertNpLL
    };
})();
