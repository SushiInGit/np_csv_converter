
var backend = backend ?? {};

backend.phoneRecordsHelper = function () {

    function normalizeTexts(dataArray) {
        var messageRecordsArray = [];
        var defaultMessageRecordLine = {
            number_from: 0,         // 0
            number_to: 0,           // 1
            message: "",            // 2
            timestamp: "",          // 3
            timestampCorrupt: false
        }

        try {
            var messageRecordLine = { ...defaultMessageRecordLine };
            var columnTracker = 0;
            var saveMessageTimestamp = ""; // For bugfix missing timestamp
            //const phoneNumberPattern = /^(420\d{7}|\(420\)\s?\d{3}\s?\d{4}|\d{10})$/;
            const phoneNumberPattern = backend.regex.phoneRecordshelper();

            dataArray.forEach(function (row, rowNumber)
            {

                Object.values(row).forEach(function (value, index)
                {
                    // START bugfix missing timestamp
                    // Some messages dont have a timestamp, so we cant note the end of a message using the timestamp
                    // Instead, when a new line is started with a phonenumber in _from and _to we can assume its a new line
                    // So we end the message, use the timestamp of the previous message and start a new message line

                    // If index == 0 && number_from != 0
                    // AND if row[0] and row[1] are number
                    // Then we know a new row should have been started
                    // So set the timestamp of the current row to same as last message
                    // Set timestampCorrupt to true
                    // And start new empty message

                    if (index == 0 && messageRecordLine.number_from != 0)
                    {
                        // A new line has started, check if its the start of a new record

                        if (
                            (row.number_from !== undefined && phoneNumberPattern.test(row.number_from.toString()))
                            &&
                            (row.number_to !== undefined && phoneNumberPattern.test(row.number_to.toString()))
                        ) {
                            // The new line is the start of a new record
                            // So end the current message line, set timestamp, set corrupt to true
                            // And reset for a new message line

                            messageRecordLine.timestamp = saveMessageTimestamp;
                            messageRecordLine.message = messageRecordLine.message.trim();
                            messageRecordLine.timestampCorrupt = true;
                            messageRecordsArray.push(messageRecordLine);
                            messageRecordLine = { ...defaultMessageRecordLine };
                            columnTracker = 0;
                        }
                    }
                    // END bugfix missing timestamp

                    if (columnTracker == 0) {
                        messageRecordLine.number_from = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 1) {
                        messageRecordLine.number_to = value;
                        columnTracker++;
                    }
                    else if (columnTracker >= 2) {
                        if (!backend.helpers.isValidISODateCheck(value)) {
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
                            saveMessageTimestamp = messageRecordLine.timestamp; // For bugfix missing timestamp
                            messageRecordLine.message = messageRecordLine.message.trim();
                            messageRecordsArray.push(messageRecordLine);
                            messageRecordLine = { ...defaultMessageRecordLine };
                            columnTracker = 0;
                        }
                    }

                });

            });

        } catch (e) {
            alert("Something broke, message a dev. \n\n Function: normalizeTexts(worksheet) \n" + e)
        }

        return messageRecordsArray;
    }

    return {

        normalizeTexts: (dataArray) => { return normalizeTexts(dataArray) }

    }
}();