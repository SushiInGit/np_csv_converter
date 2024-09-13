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

function checkHeaders(headers, filter) {                                // Check Header informations
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



function modifyExcelData(data) {                                            // Gets the Excelfile
    data.forEach((excelFile, index) => {
        dataKey = `${index + 1}`;
        dataName = excelFile.name
        dataTable = excelFile.data;
        dataTableHeader = excelFile.data[0];
        outputHeaderType(dataTableHeader);
    });



    // saveToSessionStorage(excelFile);                                              // Send to storeDataInSessionStorage() for sessionStorage creation
}

function saveToSessionStorage(sheetDataArray) {                            // Create SessionStorage Data 
    sheetDataArray.forEach((sheet, index) => {
        const storageKey = `excelSheet${index + 1}`;
        sessionStorage.setItem(storageKey, JSON.stringify(sheet.data));
        const storedData = JSON.parse(sessionStorage.getItem(storageKey));     // Read Data out of SessionStorage
        logger.table(`SessionStorage: (${sheet.name}):`, storedData);
    });
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
