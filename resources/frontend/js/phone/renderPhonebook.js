function isEmpty(data) {
    if (Array.isArray(data)) {
        return data.length === 0;
    } else if (typeof data === 'object' && data !== null) {
        return Object.keys(data).length === 0;
    }
    return false;
}



// Function to render the list of conversations
function renderPhonebook(data) {
    records = data;
    const parent = document.getElementById('contacts');
    parent.innerHTML = '';
    createEntryHead(parent); // Add header information and searchbar

    if (isEmpty(records) === false) {  // Check if "records" not empty
        const parent = document.getElementById('contacts');
        const child = document.createElement('div');
        child.classList.add('list');
        child.id = "list";
        parent.appendChild(child);
        createEntryList(sortPhoneRecords(records), child);  // create entrys for ea record
    };

}


function createEntryHead(parentDIV) {
    const child = document.createElement('div');
    child.classList.add('head');
    child.innerHTML = `Found ${records.length} entrys. <br>`;
    const childSearch = document.createElement('div');
    childSearch.classList.add('search');
    childSearch.innerHTML = `<input type="text" id="search" required><label for="">Searching contracts...</label>`;
    parentDIV.appendChild(child);
    parentDIV.appendChild(childSearch);
    document.getElementById('search').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const filteredContacts = records.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm) ||
            contact.number.toString().includes(searchTerm)

        );
        console.log(filteredContacts);
        createEntryListSearch(filteredContacts);
    });
}

function createEntryList(records, parentDIV) {
    parent.innerHTML = '';
    records.forEach((contacts, index) => {
        const child = document.createElement('div');
        child.classList.add('entry');
        child.innerHTML = ` <div class="name">${(contacts.name)} <br> ${(contacts.number)}</div> `;
        parentDIV.appendChild(child);
    });
}
function createEntryListSearch(records) {
    const parent = document.getElementById('list');
    parent.innerHTML = '';
    records.forEach((contacts, index) => {
        const child = document.createElement('div');
        child.classList.add('entry');
        child.innerHTML = ` <div class="name">${(contacts.name)} <br> ${(contacts.number)}</div> `;
        parent.appendChild(child);
    });
}

// Function to sort phoneRecords by phone number (numerically) and name (alphabetically)
function sortPhoneRecords(records) {
    return records.sort((a, b) => {
        // Normalize the phone numbers
        const numA = a.number;
        const numB = b.number;
        // compare the names alphabetically
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        // compare the phone numbers
        if (numA < numB) return -1;
        if (numA > numB) return 1;
        return 0;
    });
}
