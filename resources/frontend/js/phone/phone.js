// Function to normalize phone number to a string for comparison
function normalizeNumber(number) {

    if (Array.isArray(number)) {
        return number[0].toString();  // If multiple numbers, take the first one
    }
    return number.toString();
}

// Function to calculate the difference between two ISO timestamps
function calculateCallDuration(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;

    // Convert milliseconds into minutes and seconds
    const minutes = Math.floor(diffMs / 60000);
    const seconds = ((diffMs % 60000) / 1000).toFixed(0);

    return `${minutes} min ${seconds} sec`;
}



// Function to find name from phone records
function findNameByNumberUnknown(number) {
    for (const record of contactList) {
        if (Array.isArray(record.number)) {
            if (record.number.includes(number)) {
                return record.name;
            }
        } else if (record.number === number) {
            return record.name;
        }
    }
    return number;
}
// Function to find name from phone records
function findNameByNumber(number) {
    for (const record of contactList) {
        if (Array.isArray(record.number)) {
            if (record.number.includes(number)) {
                return record.name;
            }
        } else if (record.number === number) {
            return record.name;
        }
    }
    return number;
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

// Function to render the sorted records (same as before)
function renderPhoneRecords(records) {
    const recordList = document.getElementById('phone-records');
    try {
        recordList.innerHTML = '';
        records.forEach(record => {
            const listItem = document.createElement('div');
            listItem.classList.add('record-item');

            // Render the record (numbers as a comma-separated string)
            const numbers = Array.isArray(record.number) ? record.number.join(', ') : record.number;
            listItem.textContent = `${numbers} - ${record.name}`;

            recordList.appendChild(listItem);
        });
    } catch (error) {
        logger.error(error);
    }

}



// Function to normalize messages so the most frequent number is always in `number_from`
function normalizeMessages(messages, mostFrequentNumber) {
    return messages.map(msg => {
        if (msg.number_to === mostFrequentNumber && msg.number_from !== mostFrequentNumber) {
            return {
                ...msg,
                filtered_number_from: msg.number_to,
                filtered_number_to: msg.number_from
            };
        }
        if (msg.number_to !== mostFrequentNumber && msg.number_from === mostFrequentNumber) {
            return {
                ...msg,
                filtered_number_from: msg.number_from,
                filtered_number_to: msg.number_to
            };
        }
        return msg;
    });
}
const resultsNormalizedMessages = normalizeMessages(rawData, simOwner.Number);







// Initialize the conversation & phonebook list on page load
renderConversations(conversationData);
//renderPhonebook(sortPhoneRecords(contactList.number));
renderPhonebook(contactList);