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
        ended_at: "", // 4
        timestamp: ""
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
                        phonecallRecordLine.timestamp = value;
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
    { number: '4208384290', name: 'Tolan Black' },
    { number: '4202827342', name: 'Flops Rainman' },
    { number: '4209183663', name: 'Ana Hunter' },
    { number: '4202532095', name: 'Raiden Four' },
    { number: '4202275420', name: 'Tweetie Chirpwood' },
    { number: '4202644517', name: 'Rean Brite' },
    { number: '4208359104', name: 'Sparky Kane' },
    { number: '4204026213', name: 'James Malding' },
    { number: '4201790814', name: 'Taylor Lott' },
    { number: '4207012843', name: 'Mohammed Momin' },
    { number: '4200843991', name: 'Tallie Marks' },
    { number: '4205703232', name: 'Winter Sison' },
    { number: '4200637817', name: 'Asher Alden' },
    { number: '4205872170', name: 'Ava Deveraux' },
    { number: '4207994307', name: 'Daquan Dumas' },
    { number: '4201656022', name: 'Leah Strong' },
    { number: '4205514811', name: 'DJ Cooper' },
    { number: '4205023106', name: 'Denzel Wallace' },
    { number: '4207790954', name: 'Michael Razzel' },
    { number: '4200634275', name: 'Pip Squeak' },
    { number: '4207829279', name: 'Chas Diaz' },
    { number: '4208004059', name: 'Quinton Omar Bastoni' },
    { number: '4202019103', name: 'Arya Shah' },
    { number: '4208992777', name: 'Cau Mau' },
    { number: '4207218336', name: 'Claire Miles' },
    { number: '4205896088', name: 'Stuart KnightWolf' },
    { number: '4203262028', name: 'Shang Liu' },
    { number: '4203090789', name: 'Sunny Moonstar' },
    { number: '4208558671', name: 'Peri Wattson' },
    { number: '4204475414', name: 'Lang Buddha' },
    { number: '4203434475', name: 'Gheto Kaiba' },
    { number: '4206537375', name: 'Reverend Mullins' },
    { number: '4208762855', name: 'Jerry Anderson' },
    { number: '4200328802', name: 'Capped Tarranova' },
    { number: '4206819802', name: 'Pedro Gonzales' },
    { number: '4200327586', name: 'Patar Bellosh' },
    { number: '4206350299', name: 'Jason McGrath' },
    { number: '4202047642', name: 'Ashton Sterlingham' },
    { number: '4204454284', name: 'Viktor Schmidt' },
    { number: '4203925486', name: 'Joseph Arrowhead' },
    { number: '4201260846', name: 'Jason Ledson' },
    { number: '4205449498', name: 'Nick Bagel' },
    { number: '4208190888', name: 'John Gray' },
    { number: '4201185096', name: 'Irwin Dundee' },
    { number: '4203590900', name: 'Joey Toes' },
    { number: '4203692145', name: 'Luca Bianchi' },
    { number: '4201418388', name: 'Leonardo DelSilver' },
    { number: '4204186335', name: 'Marlo Stanfield' },
    { number: '4202781033', name: 'Marceline Slade' },
    { number: '4200056849', name: 'Sam Song' },
    { number: '4201400008', name: 'Miguel Almerion' },
    { number: '4208825047', name: 'Vince Riggs' }, 
    { number: '4202801082', name: 'LulaBelle Lawson' },
    { number: '4206653268', name: 'Alma Vergara' },
    { number: '4200504732', name: 'Aubrey Synnefo' },
    { number: '4205103659', name: 'Victor Fuentez' },
    { number: '4209025790', name: 'Zuck Cuc' },
    { number: '4209997217', name: 'Sean Danielson' },
    { number: '4200290425', name: 'Vincent Villano' },
    { number: '4209886168', name: 'Cleo Cloak' },
    { number: '4209479995', name: 'Bruce Baylor' } // Duplicate name
];





// Convert the raw data into grouped conversations
const groupedConversations = groupConversations(rawData);
const chatData = groupedConversations;