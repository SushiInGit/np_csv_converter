
var backend = backend ?? {};

backend.phoneRecordsHelper = function () {

    function normalizeTexts(dataArray) {
        var messageRecordsArray = [];
        var defaultMessageRecordLine = {
            number_from: 0, // 0
            number_to: 0,   // 1
            message: "",    // 2
            timestamp: ""   // 3
        }

        try {
            dataArray.forEach(function (row, rowNumber) {
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