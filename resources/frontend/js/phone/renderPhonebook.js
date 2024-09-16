// Function to render the list of conversations
function renderPhonebook(records) {
    const phonebookList = document.getElementById('phonebook-list');
    phonebookList.innerHTML = '';
    const sortPhoneRecord = sortPhoneRecords(records);
    const duplicates = findDuplicates(records);

    // contactList.forEach((phonelist, index) => {
    backend.dataController.getPhonenumbers().forEach((phonelist, index) => {
        const phonebooklist = document.createElement('div');
        phonebooklist.classList.add('phonebook-list-item');

        if (duplicates.includes(index)) {
            phonebooklist.classList.add('duplicate');
        }

        phonebooklist.innerHTML = `
            <div class="phonebook-info">
                <div class="name">${(phonelist.name)} <br> ${(phonelist.number)}</div>
            </div>
        `;
        phonebookList.appendChild(phonebooklist);
    });
}



// Function to detect duplicates in the phoneRecords array by number and name
function findDuplicates(records) {
    const duplicateIndices = new Set();  // Set to store indices of duplicate entries
    const seenNumbers = new Set();
    const seenNames = new Set();
    // Loop through phoneRecords and check for duplicates
    for (let i = 0; i < records.length; i++) {
        const record = records[i];

        // Normalize the number field into an array (whether it's a single number or multiple numbers)
        const numbers = Array.isArray(record.number) ? record.number : [record.number];

        // Check for duplicate numbers
        for (const number of numbers) {
            if (seenNumbers.has(number)) { ////// WIP: Add Original aswell
                seenNumbers.add(number);
                duplicateIndices.add(i);
            } else {
                seenNumbers.add(number);
            }
        }
        // Check for duplicate names
        /*
        if (seenNames.has(record.name)) {
            duplicateIndices.add(i); 
 
        } else {
            seenNames.add(record.name); 
        }
        */
    }
    return Array.from(duplicateIndices);
}


// Function to normalize phone number to a string for comparison
function normalizeNumber(number) {

    if (Array.isArray(number)) {
        return number[0].toString();  // If multiple numbers, take the first one
    }
    return number.toString();
}



// Function to sort phoneRecords by phone number (numerically) and name (alphabetically)
function sortPhoneRecords(records) {
    return records.sort((a, b) => {
        // Normalize the phone numbers
        const numA = normalizeNumber(a.number);
        const numB = normalizeNumber(b.number);
        // compare the names alphabetically
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        // compare the phone numbers
        if (numA < numB) return -1;
        if (numA > numB) return 1;
        return 0;
    });
}
