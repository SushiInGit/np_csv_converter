const sessionStorageData = {};

for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    const storageKey = `excelSheet${i + 1}`;
    //sessionStorage.removeItem(storageKey);
    //console.log(JSON.parse(value));
    const storedData = JSON.parse(value);
    sessionStorageData[`sheet${i}`] = { storedData };
    //logger.table(storedData);
}

// logger.table(sessionStorageData.sheet0.storedData);
// logger.table(sessionStorageData.sheet1.storedData);
////////////

function isValidExcelFile(file) {
    const validExtensions = ['xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop();
    return validExtensions.includes(fileExtension.toLowerCase());
  }

  function processXLSXData(arrayBuffer) {
    try {
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetNames = workbook.SheetNames;
      const allSheetsData = [];
  
      // Convert each sheet to JSON
      sheetNames.forEach((sheetName, index) => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        allSheetsData.push({ name: sheetName, data: sheetData });
      });
  
      return allSheetsData; // Array of objects with sheet names and data
    } catch (error) {
      showError('Error reading the file. Please check if the file is valid.');
      logger.warn(error);
      return null;
    }
  }
  function storeDataInSessionStorage(sheetDataArray) {
    sheetDataArray.forEach((sheet, index) => {
      const storageKey = `excelSheet${index + 1}`;
      sessionStorage.setItem(storageKey, JSON.stringify(sheet.data));
      const storedData = JSON.parse(sessionStorage.getItem(storageKey));
      logger.table(`SessionStorage: (${sheet.name}):`, storedData);
    });
  }
  












///////////  --- WIP  Filter for input 
function processDataByHeaders(rawData, filterArray) {
    // Extract headers from the first row of rawData
    const headers = Object.keys(rawData[0]);

    // Prepare output containers for different filter sets
    let output1 = [];
    let output2 = [];


    // Helper function to create an empty object based on the filterArray
    function createEmptyObject() {
        let emptyObj = {};
        filterArray.forEach(header => {
            emptyObj[header] = null;
        });
        return emptyObj;
    }

    // Function to check if all required headers are present in the raw data
    function checkHeaders(headers, requiredHeaders) {
        return requiredHeaders.every(header => headers.includes(header));
    }

    // Filter arrays for different outputs, extendable for future checks
    const filterSet1 = ['number_from', 'number_to']; // Output1 checks
    const filterSet2 = ['message', 'timestamp']; // Output2 checks
    // Add more sets for future filters

    // Loop through the rawData and categorize the data
    rawData.forEach(row => {
        // Check for Output1
        if (checkHeaders(headers, filterSet1)) {
            output1.push({
                number_from: row.number_from,
                number_to: row.number_to,
            });
        } else {
            // If headers are missing, add an empty object
            output1.push(createEmptyObject());
        }

        // Check for Output2
        if (checkHeaders(headers, filterSet2)) {
            output2.push({
                message: row.message,
                timestamp: row.timestamp,
            });
        } else {
            // If headers are missing, add an empty object
            output2.push(createEmptyObject());
        }

        // Extend further for more outputs as needed
        // Check for Output3 (for future filter sets)
        /*
        if (--- future check condition --) {
            output3.push({
                // Future data handling
            });
        
        } else {
            output3.push(createEmptyObject());
        }
            */
        
    });

    // Return the categorized outputs
    return {
        output1,
        output2,
    };
}

// Sample rawData 
/*
const rawData = [
    { number_from: 4209479995, number_to: 4200843991, message: 'Test Message 1', timestamp: '2024-08-02T04:51:30.000Z' },
    { number_from: 4200843991, number_to: 4209479995, message: 'Test Message 2', timestamp: '2024-08-02T04:51:46.000Z' },
];
*/
// Define filterArray
const filterArray = ['number_from', 'number_to', 'message', 'timestamp'];

// Call the function and process the data
const result = processDataByHeaders(rawData, filterArray);

// Output the results
logger.trace('Output 1:', result.output1);
logger.trace('Output 2:', result.output2);
logger.trace('Output 3:', result.output3);


/////////////





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
