
var middleman = middleman ?? {};

middleman.bankData = function () {

    function getFormattedData() {

        var rawBankData = backend.dataController.getData(backend.helpers.getAllSheetTypes().BANKRECORDS);

        return {
            records: rawBankData,
            recordsOwner: findBankRecordsOwner(rawBankData),
            count: rawBankData.length
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

    return {

        get: () => { return getFormattedData() }

    }

}();