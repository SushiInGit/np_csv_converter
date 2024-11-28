var middleman = middleman ?? {};

middleman.bankData = (function () {
    /**
    * Create Bank Object with Batched TimeConvertion
    * @param {*} dbName 
    * @param {*} bankID 
    * @returns {*} object.[header, data]
    **/
    async function bankObject(dbName, bankID) {
        let startTime = performance.now(); 

        const headerRename = {
            id: `ID`,
            comment: `Comment`,
            from_account_id: `From: Account ID`,
            from_civ_name: `From: Account Name`,
            from_account_name: `From: Accounttype`,
            to_account_id: `To: Account ID`,
            to_civ_name: `To: Account Name`,
            to_account_name: `To: Accounttype`,
            type: `Type`,
            direction: `Direction`,
            amount: `Amount`,
            taxAmount: `Tax Amount`,
            netAmount: `Amount without Tax`,
            tax_percentage: `Tax %`,
            tax_type: `Tax-Type`,
            tax_id: `Tax-ID`,
            date: `Date (${middleman.timeConverter.processTimestamp(Date.now()).timeZone})`,
            indexID: `Databank-ID`
        };

        const data = await indexedDBHelper.loadData(dbName, 'data');
        const datatransactions = await indexedDBHelper.loadData(dbName, 'transactions');
        const mFA_bankid = await indexedDBHelper.loadMetadata(dbName, 'mostFrequentAccount_bankID');

        /**
        * Check if bankID existes and data are found
        * bankID -1 === ALL | if bankID is positive filter by bankID
        **/
        const isBankIDFound = datatransactions.some(transaction =>
            (Number(bankID) === -1 || Number(transaction.bankID) === Number(bankID))
        );

        if (!isBankIDFound) {
            console.warn(`No matching data found with bankID ${bankID}.`);
            return null;
        }

        const filteredData = (bankID === -1)
            ? data
            : data.filter(row =>
                (row.to_account_id === bankID && row.from_account_id === mFA_bankid) ||
                (row.to_account_id === mFA_bankid && row.from_account_id === bankID)
            );

        if (!filteredData || filteredData.length === 0) {
            console.warn("No matching data found.");
            return null;
        }

        /**
        * Batch-Send Times to TimeConvertion
        **/
        const dateField = "date";
        const dateValues = [...new Set(filteredData.map(row => row[dateField]))];
        const convertedDates = dateValues.reduce((acc, date) => {
            acc[date] = middleman.timeConverter.convertedTimestamp(date).fullDateAndTime;
            return acc;
        }, {});

        /**
        * Create Object with converted Timestamps
        **/
        const modifiedData = filteredData.map(row => {
            const modifiedRow = {};
            Object.entries(headerRename).forEach(([key]) => {
                modifiedRow[key] = key === "date" ? convertedDates[row[key]] : row[key];
            });
            return modifiedRow;
        });

        /**
        * Construct the output object
        **/ 
        const output = {
            headers: headerRename,
            data: modifiedData
        };

        let endTime = performance.now(); 
        let duration = endTime - startTime; 

        if (duration > 1000) {
            console.log(`Processing time: ${(duration / 1000).toFixed(2)} seconds`);
        } else {
            console.log(`Processing time: ${duration.toFixed(2)} ms`);
        }


        console.log("Processed Data:", output);
        return output;
    }

    return {
        output: bankObject
    };
})();
