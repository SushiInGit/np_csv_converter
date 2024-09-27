
var middleman = middleman ?? {};

middleman.bankData = function () {

    function getFormattedData() {

        let rawBankData = backend.dataController.getData(backend.helpers.getAllSheetTypes().BANKRECORDS).map((transaction, index) => {
            return {
                ...transaction,
                index: index
            };
        });

        var recordsOwner = findBankRecordsOwner(rawBankData);

        var groupedOutgoing = rawBankData.filter(transaction => transaction.from_account_id == recordsOwner.account_id);
        var groupedIncoming = rawBankData.filter(transaction => transaction.from_account_id !== recordsOwner.account_id && transaction.to_account_id == recordsOwner.account_id);

        var groupedOutgoingTotalAmount = groupedOutgoing.reduce((sum, record) => sum + record.amount, 0);
        var groupedIncomingTotalAmount = groupedIncoming.reduce((sum, record) => sum + record.amount, 0);

        return {
            records: rawBankData,
            recordsOwner: recordsOwner,
            count: rawBankData.length,
            groupedOutgoing: groupedOutgoing,
            groupedOutgoingCount: groupedOutgoing.length,
            groupedOutgoingTotalAmount: groupedOutgoingTotalAmount,
            groupedIncoming: groupedIncoming,
            groupedIncomingCount: groupedIncoming.length,
            groupedIncomingTotalAmount: groupedIncomingTotalAmount
        }
    }

    function findBankRecordsOwner(bankRecords) {

        // Count occurrences of each account_id while collecting unique account details
        let accountMap = new Map();
        let maxCount = 0;
        let recurringAccountId = null;

        bankRecords.forEach(transaction => {
            // Function to process each account
            const processAccount = (account_id, account_name, civ_name) => {
                if (!accountMap.has(account_id)) {
                    accountMap.set(account_id, { account_id, account_name, civ_name, count: 0 });
                }
                let account = accountMap.get(account_id);
                account.count++;
                if (account.count > maxCount) {
                    maxCount = account.count;
                    recurringAccountId = account_id;
                }
            };

            processAccount(transaction.from_account_id, transaction.from_account_name, transaction.from_civ_name);
            processAccount(transaction.to_account_id, transaction.to_account_name, transaction.to_civ_name);
        });

        // Get the recurring account details
        let recurringAccount = accountMap.get(recurringAccountId);

        return recurringAccount;
    }

    function getGroupedData() {
        var formattedBankData = getFormattedData();

        var recordsOwner = formattedBankData.recordsOwner;

        var groupedBankData = [];
        var groupIndex = 0;


        // for (var record in formattedBankData.records) {
        formattedBankData.records.forEach((record) => {

            var groupedRecord;
            var to;

            if (record.from_account_id == formattedBankData.recordsOwner.account_id) {
                groupedRecord = groupedBankData.find(transaction => transaction.to.account_id == record.to_account_id);

                to = {
                    account_id: record.to_account_id,
                    account_name: record.to_account_name,
                    civ_name: record.to_civ_name
                }
            }
            else {
                groupedRecord = groupedBankData.find(transaction => transaction.to.account_id == record.from_account_id);

                to = {
                    account_id: record.from_account_id,
                    account_name: record.from_account_name,
                    civ_name: record.from_civ_name
                }
            }

            if (!groupedRecord) {
                groupedRecord = {
                    recordsOwner: formattedBankData.recordsOwner.account_id,
                    groupIndex: groupIndex++,
                    to: to,
                    records: []
                }

                groupedBankData.push(groupedRecord);
            }
            
            groupedRecord.records.push(record);
            
        });

        return groupedBankData;
    }

    return {

        get: () => { return getFormattedData() },

        getGrouped: () => { return getGroupedData() }

    }

}();