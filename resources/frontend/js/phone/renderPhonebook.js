function isEmpty(data) {
    if (Array.isArray(data)) {
        return data.length === 0;
    } else if (typeof data === 'object' && data !== null) {
        return Object.keys(data).length === 0;
    }
    return false;
}


// Function to render the list of conversations
function renderPhonebook() {
    records = backend.dataController.getPhonenumbers();
    const phonebookList = document.getElementById('phonebook-list');
    phonebookList.innerHTML = '';
    const phonebookhead = document.createElement('div');

    phonebookhead.classList.add('phonebook-head');
    phonebookhead.innerHTML = `
      <div class="phonebook-head">
      Found ${records.length} entrys.
        <br>
      <input type="text" id="search" class="search-bar" placeholder="Searching contracts...">
      </div>
  `;

    phonebookList.appendChild(phonebookhead);

    const phonebookbody = document.createElement('div');
    phonebookbody.classList.add('phonebook-body');

    if (isEmpty(records) === false) {   // Add card for ea record

        records.forEach((contacts, index) => {
            const phonebooklist = document.createElement('div');
            phonebooklist.classList.add('phonebook-list-item');
            phonebooklist.innerHTML = `
            <div class="phonebook-info">
                <div class="name">${(contacts.name)} <br> ${(contacts.number)}</div>
            </div>
        `;
            phonebookbody.appendChild(phonebooklist);
            phonebookList.appendChild(phonebookbody);

        })

    };
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
