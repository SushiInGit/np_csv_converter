var backend = backend ?? {};

backend.storageSelector = function () {

    function getLocalStorageKeys() {
        return Object.keys(localStorage);
    }

    function groupStorageKeys() {
        const keys = getLocalStorageKeys();
        const groupedRecords = {};

        keys.forEach(key => {
            if (key.endsWith('_texts') || key.endsWith('_calls') || key.endsWith('_bank')) {
                const baseName = key.replace(/(_texts|_calls|_bank)$/, '');

                if (!groupedRecords[baseName]) {
                    groupedRecords[baseName] = [];
                }

                if (key.endsWith('_texts')) {
                    groupedRecords[baseName].texts = JSON.parse(localStorage.getItem(key));
                } else if (key.endsWith('_calls')) {
                    groupedRecords[baseName].calls = JSON.parse(localStorage.getItem(key));
                } else if (key.endsWith('_bank')) {
                    groupedRecords[baseName].bank = JSON.parse(localStorage.getItem(key));
                }
            }
        });
        return groupedRecords;
    }

    function listGroupedStorageKeys() {
        const groupedKeys = groupStorageKeys();
        console.log('Grouped Base Names:', groupedKeys);
        return groupedKeys;
    }

    function searchRecord(baseName) { // search for records with name (baseName) or fallback to first dataset in getGroupedKeys()
        const keys = getLocalStorageKeys();
        const record = {};
        const groupedData = groupStorageKeys();

        keys.forEach(key => {
            if (key.startsWith(baseName) && (key.endsWith('_texts') || key.endsWith('_calls') || key.endsWith('_bank'))) {
                if (key.endsWith('_texts')) {
                    record.texts = JSON.parse(localStorage.getItem(key));
                } else if (key.endsWith('_calls')) {
                    record.calls = JSON.parse(localStorage.getItem(key));
                } else if (key.endsWith('_bank')) {
                    record.bank = JSON.parse(localStorage.getItem(key));
                }
            }
        });

        if (Object.keys(record).length === 0) {
            const firstKey = Object.keys(groupedData)[0]; // Get the first base name
            if (firstKey) {
                console.log(`No data found for ${baseName}. Using data for ${firstKey} instead.`);
                return groupedData[firstKey]; // Return the first record's data
            }
            console.log(`No records found at all.`);
            return `No records found at all.`;
        }

        // Log and return the result
        console.log(`Data for ${baseName}:`, record);
        return record;
    }

    function deleteTextsAndCallsByBaseName(baseName) {
        const keys = getLocalStorageKeys();
        keys.forEach(key => {
            if (key.startsWith(baseName) && (key.endsWith('_texts') || key.endsWith('_calls'))) {
                localStorage.removeItem(key);
            }
        });
        console.log(`All _texts and _calls records for ${baseName} have been deleted.`);
    }

    function deleteBankByBaseName(baseName) {
        const keys = getLocalStorageKeys();
        keys.forEach(key => {
            if (key.startsWith(baseName) && key.endsWith('_bank')) {
                localStorage.removeItem(key);
            }
        });
        console.log(`All _bank records for ${baseName} have been deleted.`);
    }

    return {
        getGroupedKeys: listGroupedStorageKeys,
        searchRecord: searchRecord,
        deleteTextsAndCalls: deleteTextsAndCallsByBaseName,
        deleteBank: deleteBankByBaseName
    };
}();

backend.storageSelector.getGroupedKeys();
//backend.storageSelector.deleteTextsAndCalls('record1');
//backend.storageSelector.deleteBank('record1');
backend.storageSelector.searchRecord('ab');