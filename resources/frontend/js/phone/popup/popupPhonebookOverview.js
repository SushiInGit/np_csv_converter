var frontend = frontend ?? {};

frontend.popupPhonebookOverview = (function () {
    let reloadTrigger = false;
    let contactToEdit = null;
    let contactToDelete = null;

    function reloadCheck() {
        if (reloadTrigger) {
            frontend.popupPhonebookOverview.reload();
        }
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            if (reloadTrigger) {
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

    function sortContacts(contacts) {
        return contacts.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    }

    function removeEmptyNames(index) {
        const contacts = JSON.parse(localStorage.getItem("phonenumbers")) || [];

        if (contacts[index] && contacts[index].name.trim() === "") {
            contacts.splice(index, 1);
            localStorage.setItem("phonenumbers", JSON.stringify(contacts));
            displayContacts();
        }
    }

    function exportRemoveDupeandSort(data) {
        return data
            .filter((contact, index, self) =>
                index === self.findIndex((c) => c.number === contact.number && c.name === contact.name)
            )
            .sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();

                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
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
                <!-- Delete Confirmation -->
                <div id="confirm-dialog" style="display:none;">
                    <div id="confirm-content">
                        <p id="confirm-message"></p>
                        <button class="risk" onclick="frontend.popupPhonebookOverview.delConfirm(true)">Delete</button>
                        <button class="ok" onclick="frontend.popupPhonebookOverview.delConfirm(false)">Cancel</button>
                    </div>
                </div>

                <!-- Edit Contact -->
                <div id="edit-dialog" style="display:none;">
                    <div id="confirm-content">
                        <p>Edit Contact Name:</p>
                        <input type="text" id="edit-input" contenteditable="true" autocorrect="off" autocomplete="off" spellcheck="false" />
                        <button class="ok" onclick="frontend.popupPhonebookOverview.confirmEdit(true)">Save</button>
                        <button class="risk" onclick="frontend.popupPhonebookOverview.confirmEdit(false)">Cancel</button>
                    </div>
                </div>

                <!-- Add New Contact -->
                <div id="add-contact" class="modal" style="display: none;">
                    <div class="contact">
                        <span class="close" onclick="frontend.popupPhonebookOverview.closeAddContact()">&times;</span>
                        <p class="label"><b>Add New Contact</b></p>
                        <form id="add-contact-form" onsubmit="frontend.popupPhonebookOverview.addContact(event)">
                            <p class="label small">Name:</p>
                            <input type="text" id="contact-name" class="input" name="name" required placeholder="Enter contact name" contenteditable="true" autocorrect="off" autocomplete="off" spellcheck="false">

                            <p class="label small">Phone Number:</p>
                            <input type="text" class="input" id="contact-number" name="number" required placeholder="Enter phone number" contenteditable="true" autocorrect="off" autocomplete="off" spellcheck="false">

                            <div id="error-message" display: none;"></div>

                            <button class="ok" type="submit">Add</button>
                            <button class="risk" type="button" onclick="frontend.popupPhonebookOverview.closeAddContact()">Cancel</button>
                        </form>
                    </div>
                </div>

                <div class="search"><input type="text" id="search-bar" contenteditable="true" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Search in your ${backend.dataController.getPhonenumbers().length} contacts..." data-placeholder="Search in your ${backend.dataController.getPhonenumbers().length} contacts..." onkeyup="frontend.popupPhonebookOverview.filter()"></div>
                <div id="contacts-list"></div>
                </div>
                <div class="uploader"><div class="body">
                <a href="#" onclick="frontend.popupPhonebookOverview.showAddContact()">
                    <div class="card full">
                        <img src="https://sushiingit.github.io/np_csv_converter/resources/frontend/image/phonebook/add.png">
                        <span>Add new Contact</span>
                    </div>
                </a>
                <a href="#" onclick="frontend.popupPhonebook.render()">
                    <div class="card half">
                        <img src="https://sushiingit.github.io/np_csv_converter/resources/frontend/image/phonebook/vanilla.png">
                        <span>Importer from <br>Textfile / Excelfile / MDT</span>
                    </div>
                </a>
                <a href="#" onclick="frontend.popupPhonebook_NP.render()">
                    <div class="card half">
                        <img src="https://sushiingit.github.io/np_csv_converter/resources/frontend/image/phonebook/npphone.png">
                        <span>NP-Phone Import</span>
                    </div>
                </a>
                <a href="#" onclick="frontend.popupPhonebook_NPLL.render()">
                    <div class="card half">
                        <img src="https://sushiingit.github.io/np_csv_converter/resources/frontend/image/phonebook/llphone.png">
                        <span>Lemon-List Import</span>
                    </div>
                </a>
                <a href="#" onclick="frontend.popupPhonebookOverview.export()">
                    <div class="card half">
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
        }, 100);
    }

    function displayContacts() {
        const contactsList = document.getElementById("contacts-list");
        const contacts = middleman.findNames.phoneArray.filter(contact => contact.name);

        const sortedContacts = sortContacts(contacts);

        contactsList.innerHTML = "";

        const fragment = document.createDocumentFragment();

        sortedContacts.forEach((contact) => {
            const contactDiv = document.createElement("div");
            contactDiv.classList.add("contact");
            contactDiv.innerHTML = `
                <div class="userContact">
                <div class="contact">
                    <div class="contact-name">${contact.name || "Unknown Contact"}</div>
                    <div class="contact-number">${phoneOutput(contact.number)}</div>
                </div>
                <div class="buttonbox">
                    <button class="edit" onclick="frontend.popupPhonebookOverview.edit(${contact.index})"><span class="material-icons">edit</span></button>
                    <button class="del" onclick="frontend.popupPhonebookOverview.del(${contact.index})"><span class="material-icons">delete</span></button>
                </div>
                <hr class="phonebook">
                </div>
            `;
            fragment.appendChild(contactDiv);
        });

        contactsList.appendChild(fragment);
    }


    function filterContacts() {
        const searchTerm = document.getElementById("search-bar").value.toLowerCase();
        const numberTerm = searchTerm.replace(/\D/g, '');
        const isDigitsOnly = /^[\d ()-]*$/.test(searchTerm);

        const filteredContacts = middleman.findNames.phoneArray.filter(contact => {
            return (
                contact.name.toLowerCase().includes(searchTerm) ||
                (isDigitsOnly && contact.number.toString().includes(numberTerm))
            );
        });

        const sortedContacts = sortContacts(filteredContacts);

        const contactsList = document.getElementById("contacts-list");
        contactsList.innerHTML = "";

        const fragment = document.createDocumentFragment();

        sortedContacts.forEach((contact, index) => {
            const contactDiv = document.createElement("div");
            contactDiv.classList.add("contact");
            contactDiv.innerHTML = `
            <div class="userContact">
            <div class="contact">
                <div class="contact-name">${contact.name || "Unknown Contact"}</div>
                <div class="contact-number">${phoneOutput(contact.number)}</div>
            </div>
            <div class="buttonbox">
                <button class="edit" onclick="frontend.popupPhonebookOverview.edit(${contact.index})"><span class="material-icons">edit</span></button>
                <button class="del" onclick="frontend.popupPhonebookOverview.del(${contact.index})"><span class="material-icons">delete</span></button>
            </div>
            <hr class="phonebook">
            </div>
            `;
            fragment.appendChild(contactDiv);
        });

        contactsList.appendChild(fragment);
    }

    function deleteContact(index) {
        const contact = middleman.findNames.phoneArray[index];
        document.getElementById("confirm-message").innerText = `Are you sure you want to delete:\n\n${contact.name || "Unknown Contact"} \n${phoneOutput(contact.number)}`;
        document.getElementById("confirm-dialog").style.display = "flex";
        contactToDelete = index;
    }

    function confirmDelete(confirm) {
        if (confirm && contactToDelete !== null) {
            middleman.findNames.phoneArray.splice(contactToDelete, 1);
    
            middleman.findNames.phoneArray.forEach((contact, newIndex) => {
                contact.index = newIndex;
            });
    
            localStorage.setItem("phonenumbers", JSON.stringify(middleman.findNames.phoneArray));
            reloadTrigger = true;
            displayContacts();
        }
        document.getElementById("confirm-dialog").style.display = "none";
        contactToDelete = null;
    }

    function exportContacts() {
        
        try {
            middleman.umami.trackExport();
        } catch (error) {
            console.error("An error occurred while tracking contact exports:", error.message);
        }
        
        const contacts = frontend.popupPhonebookOverview.exportFilterDupes(middleman.findNames.phoneArray);
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
        const contact = middleman.findNames.phoneArray[index];
        contactToEdit = index;

        document.getElementById("edit-input").value = (contact.name && contact.name.trim() !== "") ? contact.name : "Unknown Contact";
        document.getElementById("edit-dialog").style.display = "flex";
    }

    function confirmEdit(confirm) {
        if (confirm && contactToEdit !== null) {
            const newName = document.getElementById("edit-input").value.trim();
            if (newName) {
                middleman.findNames.phoneArray[contactToEdit].name = newName;
                localStorage.setItem("phonenumbers", JSON.stringify(middleman.findNames.phoneArray));
                reloadTrigger = true;
                displayContacts();
            }
        }
        document.getElementById("edit-dialog").style.display = "none";
        contactToEdit = null;
    }

    function showAddContact() {
        document.getElementById("add-contact").style.display = "flex";
    }

    function closeAddContact() {
        document.getElementById("add-contact").style.display = "none";
        document.getElementById("add-contact-form").reset();
    }

    function addContact(event) {
        event.preventDefault();
        const name = document.getElementById("contact-name").value;
        let number = document.getElementById("contact-number").value.replace(/\D/g, '');;
        const errorMessage = document.getElementById("error-message");

        errorMessage.style.display = "none";
        errorMessage.textContent = "";

        if (!name || !number) return;


        const addContactValidCheck = backend.regex.addContactValidCheck(number);
        if (!addContactValidCheck.isValid) {
            errorMessage.style.display = "block";
            errorMessage.textContent = addContactValidCheck.message;
            return;
        }

        middleman.findNames.phoneArray.push({ name, number });
        middleman.findNames.phoneArray.sort((a, b) => a.name.localeCompare(b.name));
        middleman.findNames.phoneArray.forEach((contact, index) => {
            contact.index = index;
        });

        localStorage.setItem("phonenumbers", JSON.stringify(middleman.findNames.phoneArray));
        reloadTrigger = true;
        displayContacts();
        closeAddContact();
    }

    return {
        render: createPopup,
        contacts: displayContacts,
        filter: filterContacts,
        del: deleteContact,
        edit: showEdit,
        confirmEdit: confirmEdit,
        delConfirm: confirmDelete,
        showAddContact: showAddContact,
        closeAddContact: closeAddContact,
        addContact: addContact,
        export: exportContacts,
        removeEmptyNames: removeEmptyNames,
        exportFilterDupes: exportRemoveDupeandSort,
        reloadCheck: reloadCheck,
        reload: reload
    };
})();


