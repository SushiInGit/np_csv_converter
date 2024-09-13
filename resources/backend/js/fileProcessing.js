const sessionStorageData = {};
for (let i = 0; i < sessionStorage.length; i++) {                          // Grab every storedData and put it into "sessionStorageData.sheet[indexNR]"
    const key = sessionStorage.key(i);                                     // Like: sessionStorageData.sheet0.storedData
    const value = sessionStorage.getItem(key);
    const storageKey = `excelSheet${i + 1}`;
    const storedData = JSON.parse(value);
    sessionStorageData[`sheet${i}`] = { storedData };
}

function isValidExcelFile(file) {                                           // Check if its a Excel file
    const validExtensions = ['xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop();
    return validExtensions.includes(fileExtension.toLowerCase());
}

function isValidISODateCheck(dateString) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
    return isoDateRegex.test(dateString);
}

function processXLSXData(arrayBuffer) {                                   // Read the Excel file
    try {
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        const allSheetsData = [];

        sheetNames.forEach((sheetName, index) => {                            // Convert each sheet to JSON
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            allSheetsData.push({ name: sheetName, data: sheetData });
        });

        return allSheetsData;                                                 // Array of objects with sheet names and data

    } catch (error) {
        showError('Error reading the file. Please check if the file is valid.');
        logger.warn(error);
        return null;
    }
}

//  Filter: Settings
const filterPhoneMSG = ['number_from', 'number_to', 'message', 'timestamp'];
const filterPhoneCALL = ['call_from', 'call_to', 'initiated_at', 'established_at', 'ended_at'];
const filterBank = ['id', 'comment', 'type', 'direction', 'from_account_id', 'from_civ_name', 'from_account_name', 'to_account_id', 'to_civ_name', 'to_account_name', 'amount', 'date', 'tax_percentage', 'tax_type', 'tax_id'];

function checkHeaders(headers, filter) {                                      // Check Header informations
    return filter.every(header => headers.includes(header));
}

function outputHeaderType(input) {                                             // Output Sheet Type if its known
    if (input === null) {
        return null;
    } else if (checkHeaders(dataTableHeader, filterPhoneMSG)) {
        return 'phone_message_sheet'
    } else if (checkHeaders(dataTableHeader, filterPhoneCALL)) {
        return 'phone_call_sheet'
    } else if (checkHeaders(dataTableHeader, filterBank)) {
        return 'bank_sheet'
    } else {
        return showError('One or more sheets inside this file are unknown or currupted!');
    }
}

function modifyExcelData(data) {                                                 // Gets the Excelfile
    let count = 0;
    data.forEach((excelFile) => {
        count++;
        dataTable = excelFile.data;
        dataTableHeader = excelFile.data[0];
        getHeaderType = outputHeaderType(dataTableHeader);

        if (getHeaderType === "phone_message_sheet") {
            normalizeSessionSave(excelFile, count);
        };
        if (getHeaderType === "phone_call_sheet") {
            normalizeSessionSave(excelFile, count);
        };
    });
}

function normalizeSessionSave(sheet, index) {                                       // Create SessionStorage Data 
        const storageKey = sheet.name + index;
        sessionStorage.setItem(storageKey, JSON.stringify(sheet.data));
        const storedData = JSON.parse(sessionStorage.getItem(storageKey));           // Read Data out of SessionStorage
        logger.table(`SessionStorage: ${storageKey}\n \nSheet-Name: ${sheet.name}`, storedData);
}

function saveToSessionStorage(sheetDataArray) {                                       // Create SessionStorage Data 
    sheetDataArray.forEach((sheet, index) => {
        const storageKey = `excelSheet${index + 1}`;
        sessionStorage.setItem(storageKey, JSON.stringify(sheet.data));
        const storedData = JSON.parse(sessionStorage.getItem(storageKey));             // Read Data out of SessionStorage
        logger.table(`SessionStorage: (${sheet.name}):`, storedData);
    });
}

function normalizeTexts(dataArray) {
    var messageRecordsArray = [];
    var defaultMessageRecordLine = {
        From: 0,           // 0 "number_from"
        To: 0,             // 1 "number_to"
        Message: "",       // 2 "message"
        Timestamp: "",     // 3 "timestamp"
        IsCall: false,     // Boolean [false = Message, true = Call]
        CallStart: null,   // Initially null/empty
        CallEnd: null      // Initially null/empty
    }
    try {
        dataArray.forEach(function (row, rowNumber) {
            if (rowNumber > 0) { // Skipping header row
                var messageRecordLine = { ...defaultMessageRecordLine };
                var columnTracker = 0;

                Object.values(row).forEach(function (value, index) {
                    if (columnTracker == 0) {
                        messageRecordLine.From = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 1) {
                        messageRecordLine.To = value;
                        columnTracker++;
                    }
                    else if (columnTracker >= 2) {
                        if (!isValidISODateCheck(value)) {
                            if (typeof value === 'object' && value !== null) {
                                value = value.text;
                            }
                            if (messageRecordLine.Message === "") {
                                messageRecordLine.Message += `${value}`;
                            }
                            else {
                                messageRecordLine.Message += `  ${value}`;
                            }
                        }
                        else {

                            messageRecordLine.Timestamp = new Date(value).toISOString();
                            messageRecordLine.Message = messageRecordLine.Message.trim();
                            messageRecordsArray.push(messageRecordLine);
                            messageRecordLine = { ...defaultMessageRecordLine };
                            columnTracker = 0;
                        }
                    }
                });
            }
        });
    } catch (e) {
        showError("Something broke, message a dev. \n\nFunction: normalizeTexts() \n\n" + e)
    }
    return messageRecordsArray;
}

function normalizePhonecalls(dataArray) {
    var phonecallRecordsArray = [];
    var defaultPhonecallRecordLine = {
        From: 0,           // 0 "call_from"
        To: 0,             // 1 "call_to"
        Message: null,     // Initially null/empty
        Timestamp: "",     // 2 "initiated_at"
        IsCall: true,      // Boolean [false = Message, true = Call]
        CallStart: "",     // 3 "established_at"
        CallEnd: ""        // 4 "ended_at"
    }
    try {
        dataArray.forEach(function (row, rowNumber) {
            if (rowNumber > 0) { // Skipping header row
                var columnTracker = 0;
                var phonecallRecordLine = { ...defaultPhonecallRecordLine };
                Object.values(row).forEach(function (value, index) {
                    if (columnTracker == 0) {
                        phonecallRecordLine.From = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 1) {
                        phonecallRecordLine.To = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 2) {
                        phonecallRecordLine.Timestamp = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 3) {
                        phonecallRecordLine.CallStart = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 4) {
                        phonecallRecordLine.CallEnd = value;
                        phonecallRecordsArray.push(phonecallRecordLine);
                        phonecallRecordLine = { ...defaultPhonecallRecordLine }
                        columnTracker = 0;
                    }
                });

            }
        });
    } catch (e) {
        alert("Something broke, message a dev. \n\nFunction: normalizePhonecalls() \n\n" + e)
    }
    return phonecallRecordsArray;
}

////////////////////////////////////////////// WIP
function normalizeBankRecords(worksheet) {

    worksheet.eachRow(function (row, rowNumber) {

        // var createArray = [];
        var types = ["deposit", "transfer", "purchase", "payslip", "forfeiture", "withdraw"];

        // First line is always a header row
        if (rowNumber > 1) {

            var columnTracker = 0;

            var customObject = {
                guid: "", // 0
                comment: "", // 1
                type: "", // 2
                direction: "", // 3
                from_account_id: -1, // 4
                from_civ_name: "", // 5
                from_account_name: "", // 6
                to_account_id: -1, // 7
                to_civ_name: "", // 8
                to_account_name: "", // 9
                amount: -1, // 10
                datetime: "", // 11
                tax_percentage: -1, // 12
                tax_type: "", // 13
                tax_id: -1 // 14
            }

            row.values.forEach(function (value, index) {

                if (columnTracker == 0) { // GUID
                    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) {
                        customObject.guid = value;
                        return;
                    }

                    columnTracker++;
                }

                if (columnTracker == 1) { // Comment 
                    if (!types.includes(value)) {
                        customObject.comment += value;
                    } else {
                        columnTracker++;
                        return;
                    }
                }

                if (columnTracker == 2) { // Type 
                    customObject.type = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 3) { // Direction 
                    customObject.direction = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 4) { // From account ID
                    customObject.from_account_id = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 5) { // From civ name
                    customObject.from_civ_name = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 6) { // From account name
                    customObject.from_account_name = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 7) { // To account ID
                    customObject.to_account_id = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 8) { // To civ name
                    customObject.to_civ_name = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 9) { // To account name
                    customObject.to_account_name = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 10) { // Amount
                    customObject.amount = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 11) { // Datetime
                    customObject.datetime = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 12) { // Tax percentage
                    customObject.tax_percentage = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 13) { // Tax type
                    customObject.tax_type = value;
                    columnTracker++;
                    return;
                }

                if (columnTracker == 14) { // Tax id
                    customObject.tax_id = value;
                    columnTracker++;
                    return;
                }

            });

        }
    })
}
