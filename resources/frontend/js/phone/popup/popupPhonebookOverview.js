var frontend = frontend ?? {};

frontend.popupPhonebookOverview = (function () {
    let reloadTrigger = false;
    let contactToEdit = null;

    function reloadCheck(){
        if(reloadTrigger) {
            frontend.popupPhonebookOverview.reload();
        }
    }

    document.addEventListener("keydown", function (event) { 
        if (event.key === "Escape") {
            if(reloadTrigger) {
                frontend.popupPhonebookOverview.reload();
            }
        }
    });

    function showPopup(name) {
        const popup = document.getElementById("popup");
        popup.classList = `noselect show ${name}`;
    }

    function reload() {
        global.alertsystem('success', 'Reloading Contacts! <br>Loading now—thank you for your patience.', 4);
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    }

    function exportRemoveDupeandSort(data) {
        return data
            .filter((contact, index, self) =>
                index === self.findIndex((c) => c.number === contact.number && c.name === contact.name)
            )
            .sort((a, b) => a.number - b.number);
    }

    function phoneOutput(number) {
        return String(number).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3");
    }
    
    function createPopup(popupDivName = 'phonebook', title = 'Phone Contacts', content = '') {
        const popupDiv = document.getElementById("popup");
        const loader = document.querySelector('.loader');

        middleman.popupHelp.closeHelp();
        middleman.popupModel.closePopupDiv(); 

        showPopup(popupDivName);
        loader.classList.add("active"); 
        popupDiv.classList.add(popupDivName);
        const popupDivBody = document.createElement(popupDivName);
        popupDivBody.innerHTML = `
            <div class="model">
                <div class="head">
                    <button class="close" onclick="middleman.popupModel.closePopupDiv(), middleman.popupModel.deactivateLoader(), frontend.popupPhonebookOverview.reloadCheck();">X</button>
                    <h2>${title}</h2>
                </div>
                <div class="element phonebook">${content}
                <div class="phonebook">
                <!-- Delete Confirmation Dialog -->
                <div id="confirm-dialog" style="display:none;">
                    <div id="confirm-content">
                        <p id="confirm-message"></p>
                        <button class="risk" onclick="frontend.popupPhonebookOverview.delConfirm(true)">Delete</button>
                        <button class="ok" onclick="frontend.popupPhonebookOverview.delConfirm(false)">Cancel</button>
                    </div>
                </div>

                <!-- Edit Contact Dialog -->
                <div id="edit-dialog" style="display:none;">
                    <div id="confirm-content">
                        <p>Edit Contact Name:</p>
                        <input type="text" id="edit-input" contenteditable="true" autocorrect="off" autocomplete="off" spellcheck="false" />
                        <button class="ok" onclick="frontend.popupPhonebookOverview.confirmEdit(true)">Save</button>
                        <button class="risk" onclick="frontend.popupPhonebookOverview.confirmEdit(false)">Cancel</button>
                    </div>
                </div>
                <div class="search"><input type="text" id="search-bar" contenteditable="true" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Search by contacts..." data-placeholder="Search by contacts..." onkeyup="frontend.popupPhonebookOverview.filter()"></div>
                <div id="contacts-list"></div>
                </div>
                <div class="uploader"><div class="body">

                <a href="#" onclick="frontend.popupPhonebook.render()">
                    <div class="card">
                        <img src="https://sushiingit.github.io/np_csv_converter/resources/frontend/image/phonebook/vanilla.png">
                        <span>Importer from <br>Textfile / Excelfile / MDT</span>
                    </div>
                </a>
                <a href="#" onclick="frontend.popupPhonebook_NP.render()">
                    <div class="card">
                        <img src="https://sushiingit.github.io/np_csv_converter/resources/frontend/image/phonebook/npphone.png">
                        <span>NP-Phone Import</span>
                    </div>
                </a>
                <a href="#" onclick="frontend.popupPhonebook_NPLL.render()">
                    <div class="card">
                        <img src="https://sushiingit.github.io/np_csv_converter/resources/frontend/image/phonebook/llphone.png">
                        <span>Lemon-List Import</span>
                    </div>
                </a>
                <a href="#" onclick="frontend.popupPhonebookOverview.export()">
                    <div class="card">
                        <img src="https://sushiingit.github.io/np_csv_converter/resources/frontend/image/phonebook/download.png">
                        <span>Export Phone Contacts<br><smaller>(Duplicates Will Be Removed)</smaller></span>
                    </div>
                </a>
                </div></div>  
                
                </div>
            </div>   
            `;
        popupDiv.appendChild(popupDivBody);
        setTimeout(() => {
            frontend.popupPhonebookOverview.contacts();


        }, 50);
    }

    function displayContacts() {
        const contactsList = document.getElementById("contacts-list");
        const contacts = JSON.parse(localStorage.getItem("phonenumbers")) || [];
        contacts.sort((a, b) => a.number - b.number);
        contactsList.innerHTML = "";

        contacts.forEach((contact, index) => {
            const contactDiv = document.createElement("div");
            contactDiv.classList.add("contact");
            contactDiv.innerHTML = `
            <div class="userContact">
            <div class="contact">
                <div class="contact-name">${contact.name || "Unknown Contact"}</div>
                <div class="contact-number">${phoneOutput(contact.number)}</div>
            </div>
            <div class="buttonbox">
                <button class="edit" onclick="frontend.popupPhonebookOverview.edit(${index})"><span class="material-icons">edit</span></button>
                <button class="del" onclick="frontend.popupPhonebookOverview.del(${index})"><span class="material-icons">delete</span></button>
            </div>
            <hr class="phonebook">
            </div>
            
        `;
            contactsList.appendChild(contactDiv);
        });
    }

    function filterContacts() {
        const searchTerm = document.getElementById("search-bar").value.toLowerCase();
        const numberTerm = searchTerm.replace(/\D/g, '');
        const contacts = JSON.parse(localStorage.getItem("phonenumbers")) || [];
        
        contacts.sort((a, b) => a.number - b.number);

        const filteredContacts = contacts
        .map((contact, index) => ({ ...contact, Index: index })) 
        .filter(contact => {
            const isDigitsOnly = /^[\d ()-]*$/.test(searchTerm);
            return (
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (isDigitsOnly && contact.number.toString().includes(numberTerm))
            );
        });
        
        const contactsList = document.getElementById("contacts-list");
        contactsList.innerHTML = "";

        filteredContacts.forEach((contact, index) => {
            const contactDiv = document.createElement("div");
            contactDiv.classList.add("contact");
            contactDiv.innerHTML = `
            <div class="userContact">
            <div class="contact">
                <div class="contact-name">${contact.name || "Unknown Contact"}</div>
                <div class="contact-number">${phoneOutput(contact.number)}</div>
            </div>
            <div class="buttonbox">
                <button class="edit" onclick="frontend.popupPhonebookOverview.edit(${contact.Index})"><span class="material-icons">edit</span></button>
                <button class="del" onclick="frontend.popupPhonebookOverview.del(${contact.Index})"><span class="material-icons">delete</span></button>
            </div>
            <hr class="phonebook">
            </div>
            `;
            contactsList.appendChild(contactDiv);
        });
    }

    let contactToDelete = null;

    function deleteContact(index) {
        const contacts = JSON.parse(localStorage.getItem("phonenumbers")) || [];
        contacts.sort((a, b) => a.number - b.number);
        contactToDelete = index;
        const contact = contacts[index];
        document.getElementById("confirm-message").innerText = `Are you sure you want to delete:\n\n${contact.name || "Unknown"} \n${phoneOutput(contact.number)}`;
        document.getElementById("confirm-dialog").style.display = "flex";
    }

    function confirmDelete(confirm) {
        if (confirm && contactToDelete !== null) {
            let contacts = JSON.parse(localStorage.getItem("phonenumbers")) || [];
            contacts.sort((a, b) => a.number - b.number);
            contacts.splice(contactToDelete, 1);
            localStorage.setItem("phonenumbers", JSON.stringify(contacts));
            displayContacts();
            reloadTrigger = true;
        }
        document.getElementById("confirm-dialog").style.display = "none";
        contactToDelete = null;

    }

    function exportContacts() {
        let contacts = JSON.parse(localStorage.getItem("phonenumbers")) || [];
        contacts = frontend.popupPhonebookOverview.exportFilterDupes(contacts);
        const contactLines = contacts
            .filter(contact => contact.name)
            .map(contact => `${contact.number} ${contact.name}`);
        const blob = new Blob([contactLines.join("\n")], { type: 'text/plain' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "np-converter-phonebook.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function showEdit(index) {
        const contacts = JSON.parse(localStorage.getItem("phonenumbers")) || [];
        contactToEdit = index;
        const contact = contacts[index];
        document.getElementById("edit-input").value = contact.name || "";
        document.getElementById("edit-dialog").style.display = "flex";
    }

    function confirmEdit(confirm) {
        if (confirm && contactToEdit !== null) {
            const newName = document.getElementById("edit-input").value.trim();
            if (newName) {
                const contacts = JSON.parse(localStorage.getItem("phonenumbers")) || [];
                contacts[contactToEdit].name = newName;
                localStorage.setItem("phonenumbers", JSON.stringify(contacts));
                displayContacts();
                reloadTrigger = true;
            }
        }
        document.getElementById("edit-dialog").style.display = "none";
        contactToEdit = null;
    }

    return {
        render: createPopup,
        contacts: displayContacts,
        filter: filterContacts,
        del: deleteContact,
        edit: showEdit,
        confirmEdit: confirmEdit,
        delConfirm: confirmDelete,
        export: exportContacts,
        exportFilterDupes: exportRemoveDupeandSort,
        reloadCheck: reloadCheck,
        reload: reload

    };
})();


