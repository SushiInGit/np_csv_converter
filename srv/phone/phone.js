// Function to format the timestamp
function formatDate(timestamp) {
    const date = new Date(timestamp);
    //return date.toISOString();
    return date.toLocaleString();

}

// Function to normalize phone number to a string for comparison
function normalizeNumber(number) {
    if (Array.isArray(number)) {
        return number[0].toString();  // If multiple numbers, take the first one
    }
    return number.toString();
}

// Function to render the list of conversations
function renderConversations() {
    const conversationList = document.getElementById('conversation-list');
    conversationList.innerHTML = '';
    chatData.forEach((conversation, index) => {
        const link = document.createElement('div');
        link.classList.add('chat-list-item');
        
        link.innerHTML = `
            <div class="chat-info">
                <div class="name">${findNameByNumber(conversation.conversation.number_from)} to ${findNameByNumber(conversation.conversation.number_to)}</div>
                <div class="message-preview">Click to view conversation</div>
            </div>
            <div class="time">Last massage: <br />${formatDate(new Date(conversation.messages[0].timestamp))}</div>
        `;
        
        link.addEventListener('click', () => showConversation(index));
        conversationList.appendChild(link);
    });
}

// Function to display a selected conversation
function showConversation(index) {
    const chatBox = document.getElementById('chat-box');
    const header = document.getElementById('chat-header');
    const conversation = chatData[index];

    // Set chat header information 
    if(isNaN(findNameByNumber(conversation.conversation.number_from))){
        header.querySelector('.name').textContent = `${findNameByNumber(conversation.conversation.number_from)} ( ${(conversation.conversation.number_from)} )`;
    }else{
        header.querySelector('.name').textContent = `Unkown ( ${(conversation.conversation.number_from)} )`;
    }

    if(isNaN(findNameByNumber(conversation.conversation.number_to))){
        header.querySelector('.status').textContent = `Chat to ${findNameByNumber(conversation.conversation.number_to)} ( ${(conversation.conversation.number_to)} )`;
    }else{
        header.querySelector('.status').textContent = `Chat to Unkown ( ${findNameByNumber(conversation.conversation.number_to)} )`;
    }
   
    chatBox.innerHTML = '';  // Clear previous messages
    conversation.messages.forEach(chat => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(chat.number_from === conversation.conversation.number_from ? 'from' : 'to');
        
        const textDiv = document.createElement('div');
        textDiv.textContent = chat.message;
        
        const timestampDiv = document.createElement('div');
        timestampDiv.classList.add('timestamp');
        timestampDiv.textContent = formatDate(chat.timestamp);

        const numberDiv = document.createElement('div');
        numberDiv.classList.add('number');
        numberDiv.textContent = "📞";
        numberDiv.textContent += (chat.number_from === conversation.conversation.number_from ? 'from' : 'to');
        numberDiv.textContent += "\n";
        numberDiv.textContent += (findNameByNumber(chat.number_from));

        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(timestampDiv);
        messageDiv.appendChild(numberDiv);

        chatBox.appendChild(messageDiv);
    });
}

// Function to find name from phone records
function findNameByNumber(number) {
    for (const record of phoneRecords) {
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
        console.log(seenNumbers);

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

// Function to render the list of conversations
function renderPhonebook(records) {
    const phonebookList = document.getElementById('phonebook-list');
    phonebookList.innerHTML = '';
    const sortPhoneRecord = sortPhoneRecords(records);
    const duplicates = findDuplicates(records);

    phoneRecords.forEach((phonelist, index) => {
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
        //console.error(error);
    }
        
}


// Initialize the conversation & phonebook list on page load
renderConversations();
renderPhonebook(sortPhoneRecords(phoneRecords));

