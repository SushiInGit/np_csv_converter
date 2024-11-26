var backend = backend ?? {};

backend.storageSelector = function () {

    function getLocalStorageKeys() {
        return Object.keys(localStorage);
    }

    function groupStorageKeys() {
        const keys = getLocalStorageKeys();
        const groupedRecords = {};

        keys.forEach(key => {
            if (key.endsWith('_texts') || key.endsWith('_calls') || key.endsWith('_bankRecords')) {
                const baseName = key.replace(/(_texts|_calls|_bankRecords)$/, '');

                if (!groupedRecords[baseName]) {
                    groupedRecords[baseName] = [];
                }

                if (key.endsWith('_texts')) {
                    groupedRecords[baseName].texts = JSON.parse(localStorage.getItem(key));
                } else if (key.endsWith('_calls')) {
                    groupedRecords[baseName].calls = JSON.parse(localStorage.getItem(key));
                } else if (key.endsWith('_bankRecords')) {
                    groupedRecords[baseName].bank = JSON.parse(localStorage.getItem(key));
                }
            }
        });
        return groupedRecords;
    }

    function subpoenaUser(records) {
        const numberCounts = {};
        if (records.texts) {
            records.texts.forEach(text => {
                numberCounts[text.number_to] = (numberCounts[text.number_to] || 0) + 1;
                numberCounts[text.number_from] = (numberCounts[text.number_from] || 0) + 1;
            });
        }
        if (records.calls) {
            records.calls.forEach(call => {
                numberCounts[call.call_to] = (numberCounts[call.call_to] || 0) + 1;
                numberCounts[call.call_from] = (numberCounts[call.call_from] || 0) + 1;
            });
        }
        const mostFrequentNumber = Object.keys(numberCounts).reduce((a, b) => numberCounts[a] > numberCounts[b] ? a : b, null);
        return mostFrequentNumber;
    }


    function listGroupedStorageKeys() {
        const groupedKeys = groupStorageKeys();
        const uniquePhones = new Set();
        const uniqueBanks = new Set();
        const combinedRecords = [];
    
    
        for (const baseName in groupedKeys) {
            if (groupedKeys.hasOwnProperty(baseName)) {
                const record = groupedKeys[baseName];
                const simowner = subpoenaUser(record);
                const existingRecord = combinedRecords.find(r => r.owner === simowner);
    
                if (!existingRecord) {
                    combinedRecords.push({
                        name: simowner,
                        texts: record.texts || [],
                        calls: record.calls || [],
                    });
                } else {
                    if (record.texts) {
                        existingRecord.texts = existingRecord.texts.concat(record.texts);
                    }
                    if (record.calls) {
                        existingRecord.calls = existingRecord.calls.concat(record.calls);
                    }
                }
                // Add unique base names for texts and calls
                if (record.texts || record.calls) {
                    const simowner = subpoenaUser(record);
                    const name = baseName;
                    uniquePhones.add({ name, simowner });
                    groupedKeys[baseName]["owner"] = simowner;
                }
    
                // Add unique base names for banks
                if (record.bank) {
                    uniqueBanks.add(baseName); 
                }
            }
        }
    
        const phoneNames = Array.from(uniquePhones);
        const banksNames = Array.from(uniqueBanks);
   
        return {
            groupedKeys,
            phoneNames,
            banksNames
        };
    }

    function searchRecord(baseName, useFallback, fallbackOrder = 'first') { // search for records with name (baseName) or useFallback===true to first dataset in getGroupedKeys()
        const keys = getLocalStorageKeys();
        const record = {};
        const groupedData = groupStorageKeys();

        keys.forEach(key => {
            if (key.startsWith(baseName) && (key.endsWith('_texts') || key.endsWith('_calls') || key.endsWith('_bankRecords'))) {
                if (key.endsWith('_texts')) {
                    record.texts = JSON.parse(localStorage.getItem(key));
                } else if (key.endsWith('_calls')) {
                    record.calls = JSON.parse(localStorage.getItem(key));
                } else if (key.endsWith('_bankRecords')) {
                    record.bank = JSON.parse(localStorage.getItem(key));
                }
            }
        });

        if (Object.keys(record).length === 0 && useFallback) {
            const baseNames = Object.keys(groupedData);
            if (baseNames.length > 0) {
                const fallbackBaseName = fallbackOrder === 'last' ? baseNames[baseNames.length - 1] : baseNames[0];
                //console.log(`No data found for ${baseName}. Showing ${fallbackOrder} record: ${fallbackBaseName}.`);
                return groupedData[fallbackBaseName];
            }
            //console.log(`No records found at all.`);
            return false;
        }

        if (Object.keys(record).length === 0) {
            //console.log(`No data found for ${baseName}.`);
            return false;
        }

        return record;
    }

    function lastRecordName() {
        const groupedRecords = listGroupedStorageKeys();
        const lastPhone = Object.values(groupedRecords.phoneNames);
        const lastBanks = Object.values(groupedRecords.banksNames);

        return {
            lastPhone,
            lastBanks
        };
    }

    function deleteTextsAndCallsByBaseName(baseName) {
        const keys = getLocalStorageKeys();
        keys.forEach(key => {
            if (key.startsWith(baseName) && (key.endsWith('_texts') || key.endsWith('_calls'))) {
                localStorage.removeItem(key);
            }
        });
        //console.log(`All _texts and _calls records for ${baseName} have been deleted.`);
        return;
    }

    function deleteBankByBaseName(baseName) {
        const keys = getLocalStorageKeys();
        keys.forEach(key => {
            if (key.startsWith(baseName) && key.endsWith('_bankRecords')) {
                localStorage.removeItem(key);
            }
        });
        //console.log(`All _bank records for ${baseName} have been deleted.`);
        return;
    }

    function searchRecordBySimOwner(simowner) {
        const groupedKeys = listGroupedStorageKeys(); 
        const groupedRecordsArray = Object.values(groupedKeys.groupedKeys); 
        
        let combinedRecord = { texts: [], calls: [] }; 
        groupedRecordsArray.forEach(record => {
            if (record.owner === simowner) {
                if (record.texts) {
                    combinedRecord.texts = combinedRecord.texts.concat(record.texts); 
                }
                if (record.calls) {
                    combinedRecord.calls = combinedRecord.calls.concat(record.calls); 
                }
            }
        });

        return combinedRecord.texts.length || combinedRecord.calls.length ? combinedRecord : []; 
    }

    return {
        getGroupedKeys: listGroupedStorageKeys,
        searchRecord: searchRecord,
        searchRecordBySimOwner: searchRecordBySimOwner,
        lastRecordName: lastRecordName,
        deleteTextsAndCalls: deleteTextsAndCallsByBaseName,
        deleteBank: deleteBankByBaseName
    };
}();

//console.log(backend.storageSelector.getGroupedKeys());
//backend.storageSelector.deleteTextsAndCalls('record1');
//backend.storageSelector.deleteBank('record1');
//backend.storageSelector.searchRecord('   ', true, 'last')
//console.log(backend.storageSelector.lastRecordName().lastPhone[0]);