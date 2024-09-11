/// INIT sheets
const excel = {};

for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    const storageKey = `excelSheet${i + 1}`;
    //sessionStorage.removeItem(storageKey);
    //console.log(JSON.parse(value));
    const storedData = JSON.parse(value);
    excel[`sheet${i}`] = { storedData };
}

const rawData1 = normalizeTexts(excel.sheet0.storedData);
const rawData2 = normalizePhonecalls(excel.sheet1.storedData);
const rawData = rawData1.concat(rawData2);

//  Filter/Combine/Clear object
function groupConversations(data) {
    const conversationMap = {};

    data.forEach(item => {
        const from = item.number_from.toString();
        const to = item.number_to.toString();

        const key = [from, to].sort().join('-');

        if (!conversationMap[key]) {
            conversationMap[key] = {
                conversation: [from, to],
                messages: []
            };
        }
        conversationMap[key].messages.push({
            from: from,
            to: to,
            message: item.message,
            timestamp: item.timestamp || item.initiated_at,
            initiated_at: item.initiated_at,
            established_at: item.established_at,
            ended_at: item.ended_at,
            calltime: item.cakktime
        });
    });
    // Sort messages within each conversation by timestamp
    Object.values(conversationMap).forEach(conversation => {
        conversation.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    return Object.values(conversationMap);
}

//////////////////////////
// functions 

function normalizeTexts(dataArray) {
    var messageRecordsArray = [];
    var defaultMessageRecordLine = {
        number_from: 0, // 0
        number_to: 0, // 1
        message: "", // 2
        timestamp: "" // 3
    }

    try {
        dataArray.forEach(function (row, rowNumber) {
            if (rowNumber > 0) { // Skipping header row

                var messageRecordLine = { ...defaultMessageRecordLine };
                var columnTracker = 0;

                Object.values(row).forEach(function (value, index) {
                    if (columnTracker == 0) {
                        messageRecordLine.number_from = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 1) {
                        messageRecordLine.number_to = value;
                        columnTracker++;
                    }
                    else if (columnTracker >= 2) {
                        if (!isValidISODate(value)) {
                            if (typeof value === 'object' && value !== null) {
                                value = value.text;
                            }

                            if (messageRecordLine.message === "") {
                                messageRecordLine.message += `${value}`;
                            }
                            else {
                                messageRecordLine.message += `  ${value}`;
                            }
                        }
                        else {
                            messageRecordLine.timestamp = new Date(value).toISOString();
                            messageRecordLine.message = messageRecordLine.message.trim();
                            messageRecordsArray.push(messageRecordLine);
                            messageRecordLine = { ...defaultMessageRecordLine };
                            columnTracker = 0;
                        }
                    }
                });
            }
        });
    } catch (e) {
        alert("Something broke, message a dev. \n\n Function: normalizeTexts(worksheet) \n" + e)
    }
    return messageRecordsArray;
}

function normalizePhonecalls(dataArray) {
    var phonecallRecordsArray = [];
    var defaultPhonecallRecordLine = {
        number_from: 0, // 0
        number_to: 0, // 1
        initiated_at: "", // 2
        message: "[-=-=-=-!!CALL!!-=-=-=-]",
        established_at: "", // 3
        ended_at: "" // 4
    }
    try {
        dataArray.forEach(function (row, rowNumber) {
            if (rowNumber > 0) { // Skipping header row
                var columnTracker = 0;
                var phonecallRecordLine = { ...defaultPhonecallRecordLine };
                Object.values(row).forEach(function (value, index) {
                    if (columnTracker == 0) {
                        phonecallRecordLine.number_from = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 1) {
                        phonecallRecordLine.number_to = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 2) {
                        phonecallRecordLine.initiated_at = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 3) {
                        phonecallRecordLine.established_at = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 4) {
                        phonecallRecordLine.ended_at = value;
                        phonecallRecordsArray.push(phonecallRecordLine);
                        phonecallRecordLine = { ...defaultPhonecallRecordLine }
                        columnTracker = 0;
                    }
                });

            }
        });
    } catch (e) {
        alert("Something broke, message a dev. \n\n Function: normalizePhonecalls(worksheet) \n" + e)
    }
    return phonecallRecordsArray;
}

function isValidISODate(dateString) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
    return isoDateRegex.test(dateString);
}

// Sample data 
const phoneRecords = [
    { number: '1209480000', name: "Test" },
    { number: '1209991000', name: "Test2" }, // Duplicate number of Test
    { number: '1208993000', name: "John Doe" },
    { number: '1202008000', name: "Jane Smith" },
    { number: ['1209991000', '1208887000'], name: "Alice White" },
    { number: ['1209991000'], name: "Alice White" },  // Duplicate name and number
    { number: '1202550800', name: "Andi Smith" }, // Duplicate name
    { number: '4209479995', name: "Bruce Baylor" } // Duplicate name
];





// Convert the raw data into grouped conversations
const groupedConversations = groupConversations(rawData);
const chatData = groupedConversations;