
var backend = backend ?? {};

backend.fileProcessor = function () {

    function processFiles(files) {

        Array.from(files).forEach((file, fileIndex) => {

            const reader = new FileReader();

            reader.onload = function (event) {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const allSheets = {};
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    allSheets[sheetName] = XLSX.utils.sheet_to_json(worksheet);
                });

                processSheets(allSheets);
            }

            reader.readAsArrayBuffer(file);
        });

    }

    function processSheets(sheets) {
        for (const sheetName in sheets) {
            var sheet = sheets[sheetName];
            var keys = Array.from(new Set(sheet.reduce((acc, row) => acc.concat(Object.keys(row).filter(key => !key.startsWith("__EMPTY"))), [])));

            var allSheetTypes = backend.helpers.getAllSheetTypes();
            var sheetType = getSheetType(keys);
            var cleanData;

            var redirectUrl = "";

            if (!!keys.length) {
                switch (sheetType) {
                    case allSheetTypes.TEXTS:
                        cleanData = backend.phoneRecordsHelper.normalizeTexts(sheet);
                        redirectUrl = "phone.html"
                        break;

                    case allSheetTypes.CALLS:
                        // Data for phonecalls is already clean
                        // No need for any formatting
                        // Return the data as is
                        cleanData = sheet;
                        redirectUrl = "phone.html"
                        break;

                    case allSheetTypes.BANKRECORDS:
                        cleanData = backend.bankRecordsHelper.normalizeBankRecords(sheet);
                        redirectUrl = "bank.html";
                        break;

                    case allSheetTypes.GENERIC:
                    default:
                        // Handle default
                        cleanData = sheet;
                        redirectUrl = ""; // ???
                        break;
                }

                // Save cleanData to localstorage, overwrites the current data
                backend.dataController.saveData(sheetType, cleanData);
            }
        }

        window.location.href = redirectUrl;
    }

    function getSheetType(sheetHeaders) {
        var allSheetTypes = backend.helpers.getAllSheetTypes();

        var textsHeaders = ["number_from", "number_to", "message", "timestamp"];
        var callsHeaders = ["call_from", "call_to", "initiated_at", "established_at", "ended_at"];
        var bankRecordsHeaders = ["id", "type", "direction", "from_account_id", "from_civ_name", "from_account_name", "to_account_id", "to_civ_name", "to_account_name", "amount", "date", "tax_percentage", "tax_type", "tax_id", "comment"];

        if (sheetHeaders.every(checkHeader => textsHeaders.includes(checkHeader)))
            return allSheetTypes.TEXTS;
            
        if (sheetHeaders.every(checkHeader => callsHeaders.includes(checkHeader)))
            return allSheetTypes.CALLS;

        if (sheetHeaders.every(checkHeader => bankRecordsHeaders.includes(checkHeader)))
            return allSheetTypes.BANKRECORDS;

        // If we can not identify the sheet, return generic
        return allSheetTypes.GENERIC;
    }

    return {

        processFiles: (files) => processFiles(files)

    }
}();
