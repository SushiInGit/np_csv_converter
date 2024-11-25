var indexedDBHelper = indexedDBHelper ?? {};

indexedDBHelper = {
    dbName: '',

    /**
     * Ensures max two decimal places
     * @param {*} amount 
     * @returns Amount with max two decimals
     */
    formatAmount(amount) {
        return Math.round(amount * 100) / 100;
    },

    /**
    * DB-Name normilzer
    * @param {*} dbName Inputs xlsx filename
    * @returns Normalized Filename
    **/
    normalizeFilename(dbName) {
        // Remove the ".xlsx" extension if it exists
        const dbNameWithoutExtension = dbName.endsWith('.xlsx')
            ? dbName.slice(0, -5)
            : dbName;

        // Now normalize the dbName
        return "BANK_" + dbNameWithoutExtension.replace(/[^a-zA-Z0-9]/g, " ");
    },
    /**
    * Open the database and create an object store if it doesn't exist
    **/
    openDB: function () {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 2);

            request.onerror = function (e) {
                console.error("Error opening DB:", e.target.error);
                reject(e.target.error);
            };

            request.onsuccess = function (e) {
                resolve(e.target.result);
            };

            request.onupgradeneeded = function (e) {
                const db = e.target.result;

                // Dynamically create object stores if they don't exist
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data', { keyPath: 'indexID', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'key' });
                }
                if (!db.objectStoreNames.contains('transactions')) {
                    db.createObjectStore('transactions', { keyPath: 'bankID' });
                }
            };
        });
    },


    /**
    * Save Array to IndexedDB
    * @param {*} dbName Set the DB name
    * @param {*} dataArray Values
    * @returns 
    **/
    saveData: async function (dbName, dataArray) {
        try {
            this.dbName = this.normalizeFilename(dbName);
            if (!this.dbName) {
                console.error("Invalid database name.");
                return;
            }

            const db = await this.openDB();

            const transaction = db.transaction(['data', 'metadata', 'transactions'], 'readwrite');

            const bankStore = transaction.objectStore('data');
            const metadataStore = transaction.objectStore('metadata');
            const transactionsStore = transaction.objectStore('transactions');

            // Override old Data
            bankStore.clear();
            metadataStore.clear();
            transactionsStore.clear();

            let totalIn = 0;
            let totalOut = 0;

            let firstTransactions = null;
            let lastTransactions = null;

            const totalEntries = dataArray.length;
            const accountCounts = {};
            const accountDetailsMap = new Map();


            dataArray.forEach(record => {
                // Use stateAccounts to set account_name and civ_name instead of "null"
                record.from_civ_name = backend.stateAccounts.CivName(record.from_account_id, record.from_civ_name);
                record.to_civ_name = backend.stateAccounts.CivName(record.to_account_id, record.to_civ_name);
                record.from_account_name = backend.stateAccounts.AccountName(record.from_account_id, record.from_account_name);
                record.to_account_name = backend.stateAccounts.AccountName(record.to_account_id, record.to_account_name);

                // Calculate tax and net amounts + add two decimals
                if (record.amount !== undefined && record.tax_percentage !== undefined) {
                    const taxAmount = (record.amount * record.tax_percentage) / 100;
                    const netAmount = record.amount - taxAmount;
                    record.taxAmount = this.formatAmount(taxAmount);
                    record.netAmount = this.formatAmount(netAmount);
                    record.amount = this.formatAmount(record.amount);
                }

                /**
                * Hardcoded sorting of Databank
                **/
                bankStore.put({
                    id: record.id || null,
                    comment: record.comment || null,
                    from_account_id: record.from_account_id || null,
                    from_civ_name: record.from_civ_name || null,
                    from_account_name: record.from_account_name || null,
                    to_account_id: record.to_account_id || null,
                    to_civ_name: record.to_civ_name || null,
                    to_account_name: record.to_account_name || null,
                    type: record.type || null,
                    direction: record.direction || null,
                    amount: record.amount || null,
                    taxAmount: record.taxAmount || null,
                    netAmount: record.netAmount || null,
                    tax_percentage: record.tax_percentage || null,
                    tax_type: record.tax_type || null,
                    tax_id: record.tax_id || null,
                    date: record.date || null,
                    ...record
                });

                [record.from_account_id, record.to_account_id].forEach((accountId, index) => {
                    if (accountId) {
                        accountCounts[accountId] = (accountCounts[accountId] || 0) + 1;

                        const accountName = index === 0 ? record.from_account_name : record.to_account_name;
                        const civName = index === 0 ? record.from_civ_name : record.to_civ_name;

                        if (accountName || civName) {
                            accountDetailsMap.set(accountId, {
                                owner: civName,
                                accountType: accountName
                            });
                        }
                    }
                });

                if (record.direction === "in" && typeof record.amount === "number") {
                    totalIn += record.amount;
                }

                if (record.direction === "out" && typeof record.amount === "number") {
                    totalOut += record.amount;
                }

                if (record.date) {
                    const currentTimestamp = new Date(record.date).toISOString();
                    if (firstTransactions === null || currentTimestamp < firstTransactions) {
                        firstTransactions = currentTimestamp;
                    }
                    if (lastTransactions === null || currentTimestamp > lastTransactions) {
                        lastTransactions = currentTimestamp;
                    }
                }

                if (firstTransactions !== null) {
                    firstTransactions = new Date(firstTransactions).toISOString();
                }
                if (lastTransactions !== null) {
                    lastTransactions = new Date(lastTransactions).toISOString();
                }
            });

            // Determine the most frequent account
            const mostFrequentAccountId = Object.keys(accountCounts)
                .reduce((a, b) => accountCounts[a] > accountCounts[b] ? a : b, null);
            const mostFrequentAccountDetails = accountDetailsMap.get(Number(mostFrequentAccountId)) || {};

            const transactionsObject = {};
            accountDetailsMap.forEach((value, key) => {
                transactionsObject[key] = value;
            });

            // Save metadata
            metadataStore.put({ key: 'firstTransactions', value: firstTransactions });
            metadataStore.put({ key: 'lastTransactions', value: lastTransactions });

            metadataStore.put({ key: 'transactions', value: totalEntries });
            metadataStore.put({ key: 'totalIn', value: this.formatAmount(totalIn) });
            metadataStore.put({ key: 'totalOut', value: this.formatAmount(totalOut) });
            metadataStore.put({ key: 'balance', value: this.formatAmount((totalIn - totalOut)) });
            metadataStore.put({ key: 'bankAccounts', value: Object.keys(transactionsObject).length });

            metadataStore.put({ key: 'mostFrequentAccount_bankID', value: Number(mostFrequentAccountId) });
            metadataStore.put({ key: 'mostFrequentAccount_accountType', value: backend.stateAccounts.AccountName(mostFrequentAccountId, mostFrequentAccountDetails.accountType) || null });
            metadataStore.put({ key: 'mostFrequentAccount_owner', value: backend.stateAccounts.CivName(mostFrequentAccountId, mostFrequentAccountDetails.owner) || null });

            for (const key in transactionsObject) {
                if (transactionsObject.hasOwnProperty(key)) {
                    transactionsStore.put({
                        bankID: Number(key),
                        value: transactionsObject[key]
                    });
                }
            }

            transaction.oncomplete = () => {
                console.log(`Data "${this.normalizeFilename(dbName)}" successfully saved to IndexedDB.`);
                global.alertsystem('success', `Uploaded Databank: ${this.normalizeFilename(dbName).slice(5)}`, 5);
                frontend.renderModel.clear();
                this.saveLastDB(dbName);
            };

            transaction.onerror = (e) => {
                console.error("Error saving data:", e.target.error);
            };
        } catch (error) {
            console.error("saveData Error:", error);
        }
    },

    /**
    *  Load Data from IndexedDB
    **/
    loadData: async function (dbName, objectname) {
        this.dbName = dbName;
        if (!this.dbName) return [];

        const db = await this.openDB();
        const transaction = db.transaction([objectname], 'readonly');
        const store = transaction.objectStore(objectname);
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = function (e) {
                resolve(e.target.result);
            };
            request.onerror = function (e) {
                reject("Error loading data from IndexedDB: " + e.target.error);
            };
        });
    },

    /**
    * Removes DB 
    **/
    // Clear all data from IndexedDB
    clearData: async function () {
        const db = await this.openDB();
        const transaction = db.transaction(['data', 'metadata', 'transactions'], 'readwrite');
        const data = transaction.objectStore('data');
        const metadata = transaction.objectStore('metadata');
        const transactions = transaction.objectStore('transactions');
        data.clear();
        metadata.clear();
        transactions.clear();

        transaction.oncomplete = function () {
            console.log("Data cleared from IndexedDB.");
        };
        transaction.onerror = function (e) {
            console.error("Error clearing data from IndexedDB: ", e.target.error);
        };
    },

    removeDatabank: async function (dbname) {
        if (dbname && dbname.startsWith('BANK_')) {
            const request = indexedDB.deleteDatabase(dbname);  // Delete the database by name

            request.onsuccess = function () {
                console.log(`Database "${dbname}" deleted successfully.`);
            };

            request.onerror = function (event) {
                console.error(`Error deleting database "${dbname}":`, event.target.error);
            };

            request.onblocked = function () {
                console.log(`Deletion of database "${dbname}" is blocked. Close all tabs using the database.`);
            };
        } else {
            console.log('Invalid database name or name does not start with "BANK_".');
        }
    },
    /**
    * Saves last Upload to localStorage
    **/
    saveLastDB: async function () {
        const normalizedFilename = this.dbName;
        localStorage.setItem('lastBankDB', normalizedFilename);
        global.progressbar.resetProgress();
        this.loadLastDB(normalizedFilename);
    },

    /**
    * Loads last created DB
    **/
    loadLastDB: function () {
        const dbname = localStorage.getItem('lastBankDB');
        frontend.renderBank.clearMetadata();
        if (dbname) {

            indexedDBHelper.loadData(dbname, 'data')
                .then(data => {
                    //console.log(`Loaded data from IndexedDB: "${dbname}" Total entries: ${data.length}`);
                    global.alertsystem('info', `Loading Databank: ${dbname.slice(5)} ...`, 5);
                    frontend.renderBank.renderMetadata(dbname).then(data => {

                        frontend.renderBank.renderTransactions(dbname)

                    })
                })
                .catch(err => {
                    console.error('Error loading data from IndexedDB:', err);
                });
        } else {
            console.log('No file has been selected before.');
        }
    },

    loadMetadata: async function (dbName, fieldName) {
        const data = await this.loadData(dbName, 'metadata');
        if (data) {
            for (const item of data) {
                if (item.key === fieldName) {
                    return item.value;
                }
            }
        } else {
            console.log('No file has been selected before.');
        }
    },

    listBankDB: async function () {
        if ('databases' in indexedDB) {
            try {
                const dbs = await indexedDB.databases();
                const bankDatabases = dbs
                    .filter(db => db.name && db.name.startsWith('BANK_'))
                    .map(db => {
                        const data = db.name.slice(5);
                        if (data) {
                            return data;
                        }
                    })
                    .filter(Boolean);
                return bankDatabases;
            } catch (err) {
                console.error('Error accessing databases:', err);
                return [];
            }
        } else {
            console.error('`indexedDB.databases()` is not supported in this browser.');
            return [];
        }
    },
    totalAmountByID: async function (bankID) {
        const dbname = localStorage.getItem('lastBankDB');
        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open(dbname);
            dbRequest.onerror = (event) => {
                reject(`Failed to open database "${dbName}": ${event.target.error}`);
            };

            dbRequest.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction('data', 'readonly'); 
                const objectStore = transaction.objectStore('data');   

                let totalIn = 0;
                let totalOut = 0;

                objectStore.openCursor().onsuccess = (event) => {
                    const cursor = event.target.result;

                    if (cursor) {
                        const record = cursor.value;

                        if (record.from_account_id === bankID) {
                            if (record.direction === 'in') {
                                totalIn += record.amount;
                            }
                        }
                        if (record.to_account_id === bankID) {
                            if (record.direction === 'out') {
                                totalOut += record.amount;
                            }
                        }
                        cursor.continue(); 
                    } else {
                        resolve({ totalIn, totalOut });
                    }
                };

                objectStore.openCursor().onerror = (event) => {
                    reject(`Failed to read records: ${event.target.error}`);
                };
            };
        });
    }
};
