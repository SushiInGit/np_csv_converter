
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
            var keys = Object.keys(sheet[0]);

            var allSheetTypes = backend.helpers.getAllSheetTypes();
            var sheetType = getSheetType(keys);
            var cleanData;

            var redirectUrl = "";

            switch (sheetType) {
                case allSheetTypes.TEXTS:
                    cleanData = backend.phoneRecordsHelper.normalizeTexts(sheet);
                    break;

                case allSheetTypes.CALLS:
                    // backend.dataController.clearDataBySheetType(sheetType);

                    // Data for phonecalls is already clean
                    // No need for any formatting
                    // Return the data as is
                    cleanData = sheet;
                    break;

                case allSheetTypes.BANKRECORDS:
                    // backend.dataController.clearDataBySheetType(sheetType);

                    // Todo
                    cleanData = backend.dataController.normalizeBankRecords(sheet);
                    break;

                case allSheetTypes.GENERIC:
                default:
                    // backend.dataController.clearDataBySheetType(sheetType);

                    // Handle default
                    cleanData = sheet;
                    break;
            }

            // Save cleanData to localstorage, overwrites the current data
            backend.dataController.saveData(sheetType, cleanData);
            window.location.href = redirectUrl;
        }
    }

    function getSheetType(sheetHeaders) {
        var allSheetTypes = backend.helpers.getAllSheetTypes();

        var textsHeaders = ["number_from", "number_to", "message", "timestamp"];
        var callsHeaders = ["call_from", "call_to", "initiated_at", "established_at", "ended_at"];
        var callsHeaders = ["call_to", "initiated_at", "established_at", "ended_at"];

        if (textsHeaders.every(checkHeader => sheetHeaders.includes(checkHeader)))
            return allSheetTypes.TEXTS;
            
        if (callsHeaders.every(checkHeader => sheetHeaders.includes(checkHeader)))
            return allSheetTypes.CALLS;

        // If we can not identify the sheet, return generic
        return allSheetTypes.GENERIC;
    }

    return {

        processFiles: (files) => processFiles(files)

    }
}();
