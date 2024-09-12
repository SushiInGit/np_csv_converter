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
    const headerconversationList = document.getElementById('header-sidebar');

    const conversationList = document.getElementById('conversation-list');

    conversationList.innerHTML = '';
    chatData.forEach((conversation, index) => {


        const link = document.createElement('div');
        link.classList.add('chat-list-item');
        const sortedData = resultsNormalizedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (parseInt(conversation.conversation[0]) === parseInt(findMFN.mostFrequentNumber)) {
            
            const filteredData = sortedData.filter(item => parseInt(conversation.conversation[1]) === item.filtered_number_to);
            if (filteredData.length > 0) {
                /*  //// Short msg -- Not active anymore
                const lastMessage = filteredData[0];
                const shortenedMessage = lastMessage.message.length > 15 ? lastMessage.message.slice(0, 15) + '...' : lastMessage.message;
                if (lastMessage.message === '[-=-=-=-!!CALL!!-=-=-=-]') { outputshortmsg = "** call **";}else{outputshortmsg = shortenedMessage;}
                */
                headerconversationList.innerHTML = `<div>${findNameByNumber(conversation.conversation[0])}'s Phone History</div>`;
                link.innerHTML = `
                <div class="chat-info">
                    <div class="name">${findNameByNumber(conversation.conversation[1])}</div>
                    <div class="message-preview">${conversation.conversation[1]}</div>
                </div>
                <div class="time">Last massage: <br />
                ${(processTimestamp(conversation.messages[0].timestamp).displayOrder)} ${(processTimestamp(conversation.messages[0].timestamp).timeZone)}
                </div>`;
            }
        } else {
          
            
            const filteredData = sortedData.filter(item => parseInt(conversation.conversation[0]) === item.filtered_number_to);
            if (filteredData.length > 0) {
                /*  //// Short msg -- Not active anymore
                const lastMessage = filteredData[0];
                const shortenedMessage = lastMessage.message.length > 15 ? lastMessage.message.slice(0, 15) + '...' : lastMessage.message;
                if (lastMessage.message === '[-=-=-=-!!CALL!!-=-=-=-]') { outputshortmsg = "** call **";}else{outputshortmsg = shortenedMessage;} 
                */
                headerconversationList.innerHTML = `<div>${findNameByNumber(conversation.conversation[1])}'s Phone History</div>`;
                link.innerHTML = `
                <div class="chat-info">
                    <div class="name">${findNameByNumber(conversation.conversation[0])}</div>
                    <div class="message-preview">${conversation.conversation[0]}</div>
                </div>
                <div class="time">Last massage: <br />
                ${(processTimestamp(conversation.messages[0].timestamp).displayOrder)} ${(processTimestamp(conversation.messages[0].timestamp).timeZone)}
                </div>`;
            }

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
    const showConvMainnr = parseInt(findMFN.mostFrequentNumber);
    const showConvFrom = parseInt(conversation.conversation[0]);
    const showConvTo = parseInt(conversation.conversation[1]);

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
        const currentDate = processTimestamp(chat.timestamp).date;

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
            const callText = document.createElement('div');
            const callIndicator = document.createElement('div');
            const callDurationContainer = document.createElement('div');
            const callTimeContainer = document.createElement('div');
            const callBetween = document.createElement('div');
            callMessageContainer.classList.add('text');
            callIndicator.classList.add('callindicator');
            callText.classList.add('call-message-container');

            const callDuration = calculateCallDuration(chat.established_at, chat.ended_at);
            const fixedDate = processTimestamp(chat.timestamp);
            if (chat.established_at != "null") {
                callDurationContainer.textContent = `Call duration: ${callDuration}`;
                callDurationContainer.classList.add('call-status');
                callTimeContainer.textContent = `${fixedDate.time} ${fixedDate.timeZone}`;
                callTimeContainer.classList.add('time');

                if (parseInt(findMFN.mostFrequentNumber) === parseInt(chat.from)) {
                    callBetween.textContent = `Incomming call: ${chat.to}`;
                    callIndicator.classList.add('callIn');
                    callIndicator.innerHTML = ` <span class="fa-stack fa-2x">
                                                <i class="fas fa-phone-alt fa-stack-2x"></i>
                                                <i class="fas fa-arrow-left fa-stack-1x phone-arrow"></i>
                                                </span>`;
                    // callIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#6f323f" version="1.1" id="Capa_1" width="50px" height="40px" viewBox="0 0 351.912 351.912" xml:space="preserve"><g><g><g><path d="M342.237,284.604l-54.638-54.668c-4.257-4.245-10.189-6.581-16.693-6.581c-6.845,0-13.462,2.672-18.134,7.338     l-29.525,29.537l-7.98-4.425c-17.564-9.733-41.599-23.083-66.999-48.507c-25.493-25.473-38.848-49.576-48.621-67.194     l-4.366-7.758l29.589-29.576c9.791-9.821,10.121-25.439,0.738-34.84L70.961,13.29c-4.254-4.243-10.175-6.591-16.675-6.591     c-6.854,0-13.459,2.682-18.131,7.359L22.737,27.563l-1.261,2.06C16.489,36.03,12.4,43.229,9.332,51.075     C6.497,58.553,4.72,65.66,3.915,72.788c-7.046,58.556,19.96,112.317,93.212,185.563c86.835,86.812,159.386,93.561,179.556,93.561     c3.452,0,5.536-0.186,6.131-0.246c7.451-0.906,14.586-2.69,21.779-5.488c7.77-3.026,14.945-7.086,21.329-12.088l3.057-2.402     l12.556-12.321C351.31,309.596,351.623,293.996,342.237,284.604z"/></g><g><path d="M198.194,157.593c9.68-0.015,86.907-10.854,89.802-11.286c0.919,0,5.675-0.108,8.095-2.543     c1.52-1.519,3.272-4.875-2.071-10.22l-19.155-19.149l68.466-68.449c1.67-1.672,3.646-5.996-0.805-10.433L310.406,3.396     c-2.228-2.225-4.455-3.369-6.653-3.396c-1.675-0.018-3.278,0.64-4.521,1.877c-0.294,0.315-0.522,0.591-0.685,0.805     l-69.151,69.145l-20.891-20.882c-4.546-4.542-7.548-2.534-8.617-1.444c-2.372,2.366-2.42,7.293-2.372,8.403l-8.448,89.505     c-0.036,0.456-0.294,4.563,2.426,7.491C192.61,156.128,194.687,157.593,198.194,157.593z"/></g></g></g></svg>`;
                } else {
                    callBetween.textContent = `Outgoing call: ${chat.from}`;
                    callIndicator.classList.add('callOut');
                    callIndicator.innerHTML = ` <span class="fa-stack fa-2x">
                                                <i class="fas fa-phone-alt fa-stack-2x"></i>
                                                <i class="fas fa-arrow-right fa-stack-1x phone-arrow"></i>
                                                </span>`;
                    // callIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#5d7662" version="1.1" id="Capa_1" width="50px" height="40px" viewBox="0 0 355.694 355.694" xml:space="preserve"><g><g><g><path d="M345.923,287.653l-55.22-55.25c-4.3-4.293-10.299-6.652-16.874-6.652c-6.924,0-13.606,2.695-18.326,7.416l-29.844,29.855     l-8.077-4.479c-17.75-9.849-42.045-23.329-67.716-49.035c-25.772-25.737-39.268-50.099-49.137-67.912l-4.414-7.839l29.901-29.897     c9.893-9.917,10.232-25.707,0.75-35.212L71.732,13.421c-4.305-4.29-10.289-6.659-16.855-6.659     c-6.929,0-13.607,2.708-18.324,7.443L22.982,27.848l-1.279,2.083c-5.041,6.476-9.175,13.757-12.274,21.683     c-2.87,7.563-4.66,14.745-5.476,21.945c-7.116,59.195,20.173,113.527,94.218,187.559c87.77,87.748,161.109,94.576,181.495,94.576     c3.482,0,5.603-0.187,6.197-0.252c7.529-0.907,14.735-2.721,22.014-5.543c7.848-3.062,15.102-7.17,21.557-12.214l3.087-2.426     l12.688-12.454C355.086,312.916,355.41,297.142,345.923,287.653z"/></g><g><path d="M226.283,155.849c2.246,2.252,4.51,3.408,6.726,3.432c1.711,0.018,3.326-0.646,4.569-1.895     c0.312-0.318,0.528-0.594,0.696-0.816l69.896-69.89l21.119,21.109c4.594,4.594,7.619,2.564,8.707,1.462     c2.396-2.39,2.449-7.371,2.396-8.497l8.545-90.469c0.023-0.462,0.282-4.611-2.456-7.569C345.347,1.469,343.257,0,339.696,0     c-9.771,0.006-87.832,10.968-90.757,11.406c-0.931,0-5.74,0.111-8.196,2.57c-1.531,1.537-3.309,4.93,2.102,10.331l19.348,19.354     l-69.188,69.175c-1.682,1.693-3.675,6.059,0.811,10.553L226.283,155.849z"/></g></g></g></svg>`;
                };
                // Need to make from to trigger
                callBetween.classList.add('numbers');
            }
            if (chat.established_at === "null") {
                callDurationContainer.textContent = `Call not be established!`;
                callDurationContainer.classList.add('call-status');
                callTimeContainer.textContent = `${fixedDate.time} ${fixedDate.timeZone}`;
                callTimeContainer.classList.add('time');
                if (parseInt(findMFN.mostFrequentNumber) === parseInt(chat.from)) {
                    callBetween.textContent = `Incomming call: ${chat.to}`;
                } else {
                    callBetween.textContent = `Outgoing call: ${chat.from}`;
                }
                callBetween.classList.add('numbers');
                callIndicator.classList.add('callFail');
                callIndicator.innerHTML = ` <span class="fa-stack fa-2x">
                                            <i class="fas fa-signal fa-stack-2x"></i>
                                            <i class="fas fa-slash fa-stack-2x" style="color: red; opacity: 0.7;"></i>
                                            </span>`;
            }
            callMessageContainer.appendChild(callDurationContainer);
            callMessageContainer.appendChild(callBetween);
            callMessageContainer.appendChild(callTimeContainer);

            callText.appendChild(callIndicator);
            callText.appendChild(callMessageContainer);
            chatBox.appendChild(callText);

        } else {

            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(chat.from === conversation.conversation[0] ? 'from' : 'to');

            const textDiv = document.createElement('div');
            textDiv.textContent = chat.message;

            const timestampDiv = document.createElement('div');
            fixedDate = processTimestamp(chat.timestamp);
            timestampDiv.classList.add('timestamp');
            timestampDiv.textContent = `${fixedDate.time} ${fixedDate.timeZone}`;

            const numberDiv = document.createElement('div');
            numberDiv.classList.add('number');
            numberDiv.classList.add(chat.from === conversation.conversation[0] ? 'from' : 'to');
            //numberDiv.classList.add('from');  📞
            numberDiv.textContent += (chat.from === conversation.conversation[0] ? '✉️ from' : '✉️ from');
            numberDiv.textContent += "\n";
            numberDiv.textContent += (findNameByNumber(chat.from));


            messageDiv.appendChild(numberDiv);

            messageDiv.appendChild(textDiv);
            messageDiv.appendChild(timestampDiv);

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
const findMFN = findMostFrequentNumber(rawData);





// Initialize the conversation & phonebook list on page load
renderConversations();
renderPhonebook(sortPhoneRecords(phoneRecords));