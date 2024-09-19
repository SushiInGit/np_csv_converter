
var backend = backend ?? {};

backend.bankRecordsHelper = function () {

    const enumType = Object.freeze({
        PURCHASE: "purchase",
        PAYSLIP: "payslip",
        TRANSFER: "transfer",
        WITHDRAW: "withdraw",
        FORFEITURE: "forfeiture",
        DEPOSIT: "deposit",
        OTHER: ""
    });

    function isEnumType(value) {
        return Object.values(enumType).includes(value);
    }

    function normalizeBankRecords(dataArray) {
        var bankRecordsArray = [];
        var defaultBankRecordLine = {
            id: "",
            comment: "",
            type: enumType.OTHER,
            direction: "",
            from_account_id: 0,
            from_civ_name: "",
            from_account_name: "",
            to_account_id: 0,
            to_civ_name: "",
            to_account_name: "",
            amount: 0,
            date: "",
            tax_percentage: 0,
            tax_type: null,
            tax_id: null
        }

        try {
            var bankRecordLine = { ...defaultBankRecordLine };
            var columnTracker = 0;

            dataArray.forEach(function (row, rowNumber) {
                Object.values(row).forEach(function (value, index) {
                    var reset = false;

                    // if (value === "null")
                    //     value = null;

                    if (columnTracker == 0) {
                        bankRecordLine.id = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 1) {
                        if (isEnumType(value)) {
                            bankRecordLine.type = value;
                            columnTracker++;
                        }
                        else {
                            bankRecordLine.comment += value + " ";
                        }
                    }
                    else if (columnTracker == 2) {
                        bankRecordLine.direction = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 3) {
                        bankRecordLine.from_account_id = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 4) {
                        bankRecordLine.from_civ_name = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 5) {
                        bankRecordLine.from_account_name = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 6) {
                        bankRecordLine.to_account_id = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 7) {
                        bankRecordLine.to_civ_name = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 8) {
                        bankRecordLine.to_account_name = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 9) {
                        bankRecordLine.amount = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 10) {
                        bankRecordLine.date = value; // Todo format date to ISO
                        columnTracker++;
                    }
                    else if (columnTracker == 11) {
                        bankRecordLine.tax_percentage = value;
                        columnTracker++;

                        if (!Object.hasOwn(row, "tax_type") && !Object.hasOwn(row, "tax_id")) {
                            // Workaround for 1 specific record that for some reason doesnt have a tax type nor id. Idk why
                            reset = true;
                        }
                    }
                    else if (columnTracker == 12) {
                        bankRecordLine.tax_type = value;
                        columnTracker++;
                    }
                    else if (columnTracker == 13) {
                        bankRecordLine.tax_id = value;
                        columnTracker++;
                        reset = true;
                    }

                    if (!!reset) {
                        bankRecordsArray.push(bankRecordLine);
                        bankRecordLine = { ...defaultBankRecordLine };
                        columnTracker = 0;
                    }

                });

            });

        } catch (e) {
            alert("Something broke, message a dev. \n\n Function: normalizeBankRecords(worksheet) \n" + e)
        }

        return bankRecordsArray;
    }

    return {

        normalizeBankRecords: (dataArray) => { return normalizeBankRecords(dataArray) }

    }

}();
