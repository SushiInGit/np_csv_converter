// Function to format the timestamp
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function formatDateJustDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
}

function formatDateJustTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
}
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

// Function to render the list of conversations
function renderConversations() {
    const conversationList = document.getElementById('conversation-list');
    conversationList.innerHTML = '';
    chatData.forEach((conversation, index) => {
        //console.log("phone.js - index:", index, " - ", conversation);
        const link = document.createElement('div');
        link.classList.add('chat-list-item');
        if (parseInt(conversation.conversation[0]) === parseInt(result_findMostFrequentNumber.mostFrequentNumber)) {
            link.innerHTML = `
            <div class="chat-info">
                <div class="name">${findNameByNumber(conversation.conversation[1])}</div>
                <div class="message-preview">➤ last msg WIP</div>
            </div>
            <div class="time">Last massage: <br />
            ${(processTimestamp(conversation.messages[0].timestamp).displayOrder)}
            </div>`;
        } else {
            link.innerHTML = `
        <div class="chat-info">
            <div class="name">${findNameByNumber(conversation.conversation[0])} </div>
            <div class="message-preview">➤ last msg WIP</div>
        </div>
        <div class="time">Last massage: <br />
        ${(processTimestamp(conversation.messages[0].timestamp).displayOrder)}
        </div>`;
        }
        link.addEventListener('click', () => showConversation(index));
        conversationList.appendChild(link);
    });
}

// Function to display a selected conversation
function showConversation(index) {
    const chatBox = document.getElementById('chat-box');
    const header = document.getElementById('chat-header');
    const conversation = chatData[index];
    let lastDate = null;
    /// That Main Number is always on top
    const showConvMainnr = parseInt(result_findMostFrequentNumber.mostFrequentNumber);
    const showConvFrom = parseInt(conversation.conversation[0]);
    const showConvTo = parseInt(conversation.conversation[1]);
    //console.log("phone.js mainNR", showConvMainnr, " -  from to:", showConvFrom, " - ", showConvTo);

    ///          (parseInt(showConvMainnr === showConvFrom ? showConvFrom : showConvTo)).toString()

    if (showConvMainnr === showConvFrom) {
        if (isNaN(findNameByNumber(conversation.conversation[0]))) {
            header.querySelector('.name').textContent = `${findNameByNumber(conversation.conversation[0])} ( ${(showConvFrom)} )`;
        } else {
            header.querySelector('.name').textContent = `Unkown ( ${(showConvFrom)} )`;
        }

        if (isNaN(findNameByNumber(conversation.conversation[1]))) {
            header.querySelector('.status').textContent = `Chat to ${findNameByNumber(conversation.conversation[1])} ( ${(showConvTo)} )`;
        } else {
            header.querySelector('.status').textContent = `Chat to Unkown ( ${findNameByNumber(showConvTo)} )`;
        }
    } else {
        ////////// Revers From <> To to fix the display 
        console.log("no");
        if (isNaN(findNameByNumber(conversation.conversation[1]))) {
            header.querySelector('.name').textContent = `${findNameByNumber(conversation.conversation[1])} ( ${(showConvTo)} )`;
        } else {
            header.querySelector('.name').textContent = `Unkown ( ${(showConvTo)} )`;
        }

        if (isNaN(findNameByNumber(conversation.conversation[0]))) {
            header.querySelector('.status').textContent = `Chat to ${findNameByNumber(conversation.conversation[0])} ( ${(showConvFrom)} )`;
        } else {
            header.querySelector('.status').textContent = `Chat to Unkown ( ${findNameByNumber(showConvFrom)} )`;
        }

    }

    chatBox.innerHTML = '';  // Clear previous messages
    conversation.messages.forEach(chat => {

        const currentDate = formatDateJustDate(new Date(chat.timestamp));

        // Check if a new day has begun and add a date marker
        if (lastDate !== currentDate) {
            const dateMarker = document.createElement('div');
            dateMarker.classList.add('date-marker');
            dateMarker.textContent = currentDate;
            chatBox.appendChild(dateMarker);
            lastDate = currentDate;
        }
        // Check if the message contains a call marker
        if (chat.message === '[-=-=-=-!!CALL!!-=-=-=-]') {
            const callMessageContainer = document.createElement('div');
            callMessageContainer.classList.add('call-message-container');
            const callDurationContainer = document.createElement('div');
            const callTimeContainer = document.createElement('div');
            const callBetween = document.createElement('div');
            const callDuration = calculateCallDuration(chat.established_at, chat.ended_at);

            if (chat.established_at != "null") {
                callDurationContainer.textContent = `📞 Call duration: ${callDuration}`;
                callTimeContainer.textContent = `Time: ${formatDateJustTime(chat.initiated_at)}`;
                callBetween.textContent = `${chat.from} to ${chat.to}`;    // Need to make from to trigger
            }
            if (chat.established_at === "null") {
                callDurationContainer.textContent = `📞 Call not be established!`;
                callTimeContainer.textContent = `Time: ${formatDateJustTime(chat.initiated_at)}`;
                callBetween.textContent = `${chat.from} to ${chat.to}`;    // Need to make from to trigger
            }
            callMessageContainer.appendChild(callDurationContainer);
            callMessageContainer.appendChild(callTimeContainer);
            callMessageContainer.appendChild(callBetween);
            chatBox.appendChild(callMessageContainer);
        } else {

            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(chat.from === conversation.conversation[0] ? 'from' : 'to');

            const textDiv = document.createElement('div');
            textDiv.textContent = chat.message;

            const timestampDiv = document.createElement('div');
            timestampDiv.classList.add('timestamp');
            timestampDiv.textContent = formatDate(chat.timestamp);

            const numberDiv = document.createElement('div');
            numberDiv.classList.add('number');
            numberDiv.textContent = "📞";
            numberDiv.textContent += (chat.from === conversation.conversation[0] ? 'from' : 'to');
            numberDiv.textContent += "\n";
            numberDiv.textContent += (findNameByNumber(chat.from));

            messageDiv.appendChild(textDiv);
            messageDiv.appendChild(timestampDiv);
            messageDiv.appendChild(numberDiv);

            chatBox.appendChild(messageDiv);
        }
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
        logger.error(error);
    }

}

function closePhonebook() {
    document.getElementById('phonebook-container').style.display = "none";
    document.getElementById("chat-container").style.width = "80%";
}
function openPhonebook() {
    document.getElementById('phonebook-container').style.display = "block";
    document.getElementById("chat-container").style.width = "70%";
}


// Get Main used Number (hint how is the owner)
function findMostFrequentNumber(messages) {
    const numberCount = {}
    messages.forEach(msg => {
        numberCount[msg.number_from] = (numberCount[msg.number_from] || 0) + 1;
        numberCount[msg.number_to] = (numberCount[msg.number_to] || 0) + 1;
    });

    let mostFrequentNumber = null;
    let maxCount = 0;
    for (const number in numberCount) {
        if (numberCount[number] > maxCount) {
            maxCount = numberCount[number];
            mostFrequentNumber = parseInt(number);
        }
    }

    return { mostFrequentNumber, count: maxCount };
}
const resultfindMostFrequentNumber = findMostFrequentNumber(rawData);
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
const resultsNormalizedMessages = normalizeMessages(rawData, resultfindMostFrequentNumber.mostFrequentNumber);



// Get Main used Number (hint how is the owner)
function findMostFrequentNumber(messages) {
    const numberCount = {}
    messages.forEach(msg => {
        numberCount[msg.number_from] = (numberCount[msg.number_from] || 0) + 1;
        numberCount[msg.number_to] = (numberCount[msg.number_to] || 0) + 1;
    });

    let mostFrequentNumber = null;
    let maxCount = 0;
    for (const number in numberCount) {
        if (numberCount[number] > maxCount) {
            maxCount = numberCount[number];
            mostFrequentNumber = parseInt(number);
        }
    }

    return { mostFrequentNumber, count: maxCount };
}
const result_findMostFrequentNumber = findMostFrequentNumber(rawData);






// Initialize the conversation & phonebook list on page load
renderConversations();
renderPhonebook(sortPhoneRecords(phoneRecords));

console.log(rawData);