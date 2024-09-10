
/// Returns array of objects
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

function normalizeTexts(worksheet) {

    var messageRecordsArray = [];

    var defaultMessageRecordLine = {
        number_from: 0, // 0
        number_to: 0, // 1
        message: "", // 2
        timestamp: "" // 3
    }

    try {

        var columnTracker = 0;
        var messageRecordLine = { ...defaultMessageRecordLine };

        worksheet.eachRow(function (row, rowNumber) {

            if (rowNumber > 1) {

                row.values.forEach(function (value, index) {

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
                            if (messageRecordLine.message === "") {
                                messageRecordLine.message += `${value}`;
                            }
                            else {
                                messageRecordLine.message += `<br/>${value}`;
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

function normalizePhonecalls(worksheet) {

    var phonecallRecordsArray = [];

    var defaultPhonecallRecordLine = {
        call_from: 0, // 0
        call_to: 0, // 1
        initiated_at: "", // 2
        established_at: "", // 3
        ended_at: "" // 4
    }
    try {

        var columnTracker = 0;
        var phonecallRecordLine = { ...defaultPhonecallRecordLine };


        worksheet.eachRow(function (row, rowNumber) {

            if (rowNumber > 1) {

                row.values.forEach(function (value, index) {

                    if (columnTracker == 0) {
                        phonecallRecordLine.call_from = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 1) {
                        phonecallRecordLine.call_to = value;
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
