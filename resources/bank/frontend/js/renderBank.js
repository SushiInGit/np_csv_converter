var frontend = frontend ?? {};


var bankDirectionFilter = false;
document.querySelector(".output .header .right").addEventListener("click", function (e) {
    if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        bankDirectionFilter = false;
    }
    else {
        if (e.target.parentElement.querySelector(".active")) {
            e.target.parentElement.querySelector(".active").classList.remove("active");
        }

        if (e.target.classList.contains("in")) {
            bankDirectionFilter = "in";
            e.target.classList.add("active");
        }
        else if (e.target.classList.contains("out")) {
            bankDirectionFilter = "out";
            e.target.classList.add("active");
        }
    }

    frontend.renderBank.reopenActiveTransfer();
});


frontend.renderBank = (function () {
    /**
    * Render for Transaction-List
    * @param {*} dbName 
    * @returns html-object
    **/
    async function renderTransactions(dbName) {
        window.dispatchEvent(new Event('load'));
        const data = await indexedDBHelper.loadData(dbName, 'transactions');

        if (!data || Object.keys(data).length === 0) {
            console.error("No data loaded from IndexedDB.");
            window.dispatchEvent(new Event('finishload'));
            return;
        }
        window.dispatchEvent(new Event('finishload'));
        const viewsDiv = document.querySelector(".menu .list.noselect .pov");
        viewsDiv.innerHTML = ``;

        /**
        * ALL TRANSACTIONS POV
        **/
        var divAll = document.createElement("div");
        divAll.classList.add("user");
        divAll.classList.add("all");
        divAll.classList.add("-1");
        divAll.classList.add("id__000");
        divAll.innerHTML = `ALL<br>Transactions`
        divAll.addEventListener("click", function () {
            const removeStatusMessage = document.querySelector(".status-message");
            if (removeStatusMessage) {
                removeStatusMessage.remove();
            }
            const allDivs = document.querySelectorAll('.pov .user');
            allDivs.forEach(div => div.classList.remove('active'));
            this.classList.add('active');

            var table = document.querySelector(".output .bankoutput");
            table.innerHTML = ``;
            window.dispatchEvent(new Event('load'));
            frontend.renderBank.renderHeaderInfo(dbName, (-1), "ALL");
            frontend.renderBank.renderBankByID(dbName, (-1));
        });
        viewsDiv.appendChild(divAll);

        /**
        * SORTED BY BANKID TRANSACTIONS POV
        **/
        Object.entries(data).forEach(([key, entry]) => {
            let divforEach = document.createElement('div');
            divforEach.classList.add("user");
            divforEach.classList.add(entry.bankID || "N/A");
            divforEach.innerHTML = `<hr>${entry.value?.owner || "N/A"}<br>ID: ${entry.bankID || "N/A"}`;

            divforEach.addEventListener("click", function () {
                const removeStatusMessage = document.querySelectorAll(".status-message");
                if (removeStatusMessage) {
                    removeStatusMessage.forEach((element) => element.remove());
                }

                const allDivs = document.querySelectorAll('.pov .user');
                allDivs.forEach(div => div.classList.remove('active'));
                this.classList.add('active');

                var table = document.querySelector(".output .bankoutput");
                table.innerHTML = ``;
                window.dispatchEvent(new Event('load'));
                frontend.renderBank.renderHeaderInfo(dbName, entry.bankID, entry.value?.owner);
                frontend.renderBank.renderBankByID(dbName, entry.bankID);
            });
            window.dispatchEvent(new Event('finishload'));
            viewsDiv.appendChild(divforEach);

        });

    }

    /**
    * Render bank Output with filter
    * Filter data based on bankID
    * @param {*} dbName 
    * @param {*} bankID 
    * @returns 
    **/
    async function renderBankByID(dbName, bankID) {
        const data = await indexedDBHelper.loadData(dbName, 'data');

        if (!data || data.length === 0) {
            console.error("No data loaded from IndexedDB.");
            return;
        }

        const outputContainer = document.querySelector(".output .bankoutput");

        if (!outputContainer) {
            console.error(`Container with selector "${outputSelector}" not found.`);
            return;
        }

        const mFA_bankid = await indexedDBHelper.loadMetadata(dbName, 'mostFrequentAccount_bankID');
        let filteredData = "";

        /**
        * bankID -1 === ALL | if bankID is positive filter by bankID
        **/
        if (bankID === (-1)) {
            filteredData = data;
        } else {
            filteredData = data.filter(row =>
                (row.to_account_id === bankID && row.from_account_id === mFA_bankid) ||
                (row.to_account_id === mFA_bankid && row.from_account_id === bankID)
            );
        }

        if (!!bankDirectionFilter) {
            filteredData = filteredData.filter(x => x.direction == bankDirectionFilter);
        }

        if (filteredData.length === 0) {
            console.warn("No matching data found for the specified filter.");
            outputContainer.innerHTML = "No data matching the criteria.";
            return;
        }

        outputContainer.innerHTML = "";

        const table = document.createElement("table");
        table.id = "bankRecordsTable";
        outputContainer.appendChild(table);

        const thead = document.createElement("thead");
        table.appendChild(thead);

        const headerRow = document.createElement("tr");
        thead.appendChild(headerRow);

        const headerRename = {
            0: `ID`,
            1: `Comment`,
            2: `From: Account ID`,
            3: `From: Account Name`,
            4: `From: Accounttype`,
            5: `To: Account ID`,
            6: `To: Account Name`,
            7: `To: Accounttype`,
            8: `Type`,
            9: `Direction`,
            10: `Amount`,
            11: `Tax Amount`,
            12: `Net Amount`,
            13: `Tax %`,
            14: `Tax-Type`,
            15: `Tax-ID`,
            16: `Date (${middleman.timeConverter.processTimestamp(Date.now()).timeZone})`,
            17: `Databank-ID`
        };

        const tableHeaderMap = new Map();
        Object.keys(filteredData[0]).forEach((key, index) => {
            const th = document.createElement("th");
            th.id = key;
            th.textContent = headerRename[index];
            headerRow.appendChild(th);
            tableHeaderMap.set(index, key);
        });

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        const statusMessage = document.createElement("div");
        statusMessage.className = "status-message";
        document.body.appendChild(statusMessage);

        const totalRows = filteredData.length;
        const chunkSize = Number(middleman.settings.getSettings().chunkSize);
        let loadedRows = 0;
        let previousLoadedRows = loadedRows;
        let resetTimeout;

        async function loadChunk() {
            if (loadedRows >= totalRows) return;
            previousLoadedRows = loadedRows;
            window.dispatchEvent(new Event('load'));

            const chunk = filteredData.slice(loadedRows, loadedRows + chunkSize);

            const dateIndex = Array.from(tableHeaderMap.entries()).find(([index, key]) => key === "date")?.[0];
            const dateValues = Array.from(new Set(chunk.map(row => Object.values(row)[dateIndex])));

            const convertedDates = dateValues.reduce((acc, date) => {
                acc[date] = middleman.timeConverter.convertedTimestamp(date).fullDateAndTime;
                return acc;
            }, {});

            chunk.forEach((row) => {

                const tr = document.createElement("tr");

                Object.values(row).forEach((value, key) => {
                    const td = document.createElement("td");
                    if (key === dateIndex) {
                        td.textContent = convertedDates[value];
                    } else {
                        td.textContent = value;
                    }

                    const dataID = key;
                    const dataIndex = tableHeaderMap.get(dataID);
                    td.id = dataIndex;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);


                if ((loadedRows + chunkSize) > previousLoadedRows) {
                    setTimeout(() => {
                        statusMessage.style.opacity = "1";
                        if (totalRows === 1) {
                            statusMessage.textContent = `Display 1 transaction`;
                        } else if (totalRows <= chunkSize) {
                            statusMessage.textContent = `Display ${loadedRows} transactions`;
                        } else {
                            statusMessage.textContent = `Display ${loadedRows} of ${totalRows} transactions`;
                        }
                        if (resetTimeout) {
                            clearTimeout(resetTimeout);
                        }
                        resetTimeout = setTimeout(() => {
                            statusMessage.style.opacity = "0";
                        }, 3000);
                    }, 10);
                }
            });

            loadedRows += chunk.length;
            frontend.treeselect();
            window.dispatchEvent(new Event('finishload'));

        }

        await loadChunk();
        window.dispatchEvent(new Event('finishload'));

        if (loadedRows > previousLoadedRows) {
            outputContainer.addEventListener('scroll', async () => {
                if (outputContainer.scrollTop + outputContainer.clientHeight >= outputContainer.scrollHeight) {
                    await loadChunk();
                }
            });
        }
    }

    /**
    * Render Head infos for Bank-Render
    * @param {*} dbName 
    * @param {*} transferID 
    * @param {*} transferName 
    **/
    async function renderHeaderInfo(dbName, transferID, transferName) {
        const tableHeaderLeft = document.querySelector(".output .header.noselect .left");
        const tableHeaderRight = document.querySelector(".output .header.noselect .right");
        tableHeaderLeft.innerHTML = ``;
        tableHeaderRight.innerHTML = ``;

        /**
        * ALL POV
        **/
        if (transferID === (-1)) {
            tableHeaderLeft.innerHTML = `All Transactions`;
            const totalIn = await indexedDBHelper.loadMetadata(dbName, 'totalIn');
            const totalOut = await indexedDBHelper.loadMetadata(dbName, 'totalOut');

            tableHeaderRight.innerHTML = `
                [&nbsp;
                    <span class="out ${bankDirectionFilter == "out" ? "active" : ""}">Outgoing: $${totalOut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                &nbsp;|&nbsp; 
                    <span class="in ${bankDirectionFilter == "in" ? "active" : ""}">Incoming: $${totalIn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                &nbsp;]`;

            /**
            * Filtered output by bankID
            **/
        } else {
            tableHeaderLeft.innerHTML = `${transferName} ( ID: ${transferID} )`;
            tableHeaderRight.innerHTML = `
                [ Loading Data ... ] 
            `;
            indexedDBHelper.totalAmountByID(transferID)
                .then(({ totalIn, totalOut }) => {
                    tableHeaderRight.innerHTML = `
                    [&nbsp;
                        <span class="out ${bankDirectionFilter == "out" ? "active" : ""}">Outgoing: $${totalOut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                    &nbsp;|&nbsp;
                        <span class="in ${bankDirectionFilter == "in" ? "active" : ""}">Incoming: $${totalIn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                    &nbsp;]`;
                })
                .catch((err) => {
                    console.error(err);
                });

        }
    };

    /**
    * Render Header Metainformationen
    * @param {*} dbName 
    **/
    async function renderMetadata(dbName) {

        function formatDifference(incomingTotal, outgoingTotal) {
            if (typeof incomingTotal === 'number' && typeof outgoingTotal === 'number') {
                const totalDifference = incomingTotal - outgoingTotal;

                return totalDifference >= 0 ? `+$${totalDifference}` : `-$${Math.abs(totalDifference)}`;
            } else {
                return;
            }
        }

        const totalIn = await indexedDBHelper.loadMetadata(dbName, 'totalIn');
        const totalOut = await indexedDBHelper.loadMetadata(dbName, 'totalOut');
        const bannerRight = document.querySelector(".banner .right.noselect");

        if (bannerRight) {
            const totalDifference = formatDifference(totalIn, totalOut);
            bannerRight.innerHTML = `
                Transactions: ${await indexedDBHelper.loadMetadata(dbName, 'transactions') || "Error"} <br>
                Total Income: ${"$" + totalIn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "Error"} <br> 
                Total Expense: ${"$" + totalOut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "Error"} <br>
                Balance: ${totalDifference.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "Error"}
            `;
        }

        const bannerCenter = document.querySelector(".banner .center.noselect");
        let time = [];
        time.firstTransactions = await indexedDBHelper.loadMetadata(dbName, 'firstTransactions') || "Unknown Date";
        time.lastTransactions = await indexedDBHelper.loadMetadata(dbName, 'lastTransactions') || "Unknown Date";

        time.first = middleman.timeConverter.convertedTimestamp(time.firstTransactions).date;
        time.last = middleman.timeConverter.convertedTimestamp(time.lastTransactions).date;

        if (bannerCenter) {
            bannerCenter.innerHTML = `
            <h2>${await indexedDBHelper.loadMetadata(dbName, 'mostFrequentAccount_owner') || "Unknown Owner"} <br>(${await indexedDBHelper.loadMetadata(dbName, 'mostFrequentAccount_accountType') || "Unknown Account Type"})</h2>
            <h3>ID: ${await indexedDBHelper.loadMetadata(dbName, 'mostFrequentAccount_bankID') || "Unknown"}</h3>
            <b> ${time.first} to ${time.last}</b>
        `;
        }
    }

    /**
    * Clear Metdaten  in Banner (right)
    **/
    function clearMetadata() {
        const bannerRight = document.querySelector(".banner .right.noselect");
        bannerRight.innerHTML = ``;
    }

    /**
    * Reopen last Active Transaction 
    * @returns last active Transaction
    **/
    function reopenActiveTransfer() {
        window.dispatchEvent(new Event('load'));
        const outputContainer = document.querySelector(".output .bankoutput");
        outputContainer.innerHTML = ``;

        const activeIDDIV = document.querySelector('.user.active');
        if (!activeIDDIV) {
            return;
        }

        const activeID = Array.from(activeIDDIV.classList).find(cls => /^-?\d+$/.test(cls));
        if (!activeID) {
            console.warn("No valid ID found in active user's class list. Aborting operation.");
            return;
        }

        const dataDB = localStorage.getItem('lastBankDB');
        if (!dataDB) {
            return;
        }

        const removeStatusMessage = document.querySelectorAll(".status-message");
        removeStatusMessage.forEach((element) => element.remove());

        frontend.renderBank.renderBankByID(dataDB, Number(activeID));
    }

    return {
        renderTransactions,
        renderBankByID,
        renderMetadata,
        renderHeaderInfo,
        clearMetadata,
        reopenActiveTransfer
    }
})();