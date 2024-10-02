var frontend = frontend ?? {};

frontend.renderTable = function (data) {
    window.dispatchEvent(new Event('beforeunload'));
    return new Promise((resolve, reject) => {
        var table = document.querySelector("#bankRecordsTable");

        // Check if thead already exists, and remove it if needed
        var existingThead = table.querySelector("thead");
        if (existingThead) {
            table.removeChild(existingThead);
        }

        var headers = [
            "ID", "Comment", 
            "From: Account ID", "From: Account Name", "From: Accounttype", 
            "To: Account ID", "To: Account Name", "To: Accounttype", 
            "Type", "Direction", 
            "Amount", "Amount without Tax",
            "Tax %", "Tax Amount", 
            "Tax-Type", "Tax-ID", 
            `Date (${processTimestamp(Date.now()).timeZone})`
        ];

        var headersClass = [
            "id", "comment", 
            "from_account_id", "from_civ_name", "from_account_name", 
            "to_account_id","to_civ_name", "to_account_name",
            "type", "direction",
            "amount", "original_amount",
            "tax_percentage", "tax_amount", 
            "tax_type", "tax_id", 
            "date"
        ];

        // Create thead
        var thead = document.createElement("thead");
        var headerRow = document.createElement("tr");
        var headerCount = 0;
        
        headers.forEach((header) => {
            var th = document.createElement("th");
            th.textContent = header;
            th.className = headersClass[headerCount];

            headerRow.appendChild(th);
            headerCount++;
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create tbody only once
        var tbody = document.createElement("tbody");
        table.appendChild(tbody); // Append tbody to the table initially

        // Function to process rows in chunks or all at once
        function processRows(chunkSize = 100, startIndex = 0) {
            return new Promise((resolve) => {
                let endIndex = Math.min(startIndex + chunkSize, data.length);

                for (let i = startIndex; i < endIndex; i++) {
                    var row = data[i];
                    var tr = document.createElement("tr");
                    Object.values(row).forEach((item, counter) => {
                        var td = document.createElement("td");
                        var headerClass = headers[counter];
                        var headerClassIndex = headersClass[counter];

                        if (headerClass === "To: Account Name") {
                            item = middleman.stateAccounts(row.to_account_id, row.to_civ_name);
                        }

                        if (headerClass === "From: Account Name") {
                            item = middleman.stateAccounts(row.from_account_id, row.from_civ_name);
                        }

                        if (headerClass === `Date (${processTimestamp(Date.now()).timeZone})`) {
                            var date = new Date(item); // Convert to Date object
                            td.textContent = `${processTimestamp(date).displayOrder}`
                        } else {
                            td.textContent = item;
                        }

                        td.className = headerClassIndex;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                }

                if (endIndex < data.length) {
                    setTimeout(() => processRows(chunkSize, endIndex).then(resolve), 0);
                } else {
                    resolve(); // Resolve when all rows are processed
                }
                frontend.treeselect();
            });
        }

        // Check if there are less than or equal to 100 rows
        if (data.length <= 100) {
            data.forEach((row) => {
                var tr = document.createElement("tr");
                Object.values(row).forEach((item, counter) => {
                    var td = document.createElement("td");
                    var headerClass = headers[counter];
                    var headerClassIndex = headersClass[counter];

                    if (headerClass === "To: Account Name") {
                        item = middleman.stateAccounts(row.to_account_id, row.to_civ_name);
                    }

                    if (headerClass === "From: Account Name") {
                        item = middleman.stateAccounts(row.from_account_id, row.from_civ_name);
                    }

                    if (headerClass === `Date (${processTimestamp(Date.now()).timeZone})`) {
                        var date = new Date(item); // Convert to Date object
                        td.textContent = `${processTimestamp(date).displayOrder}`
                    } else {
                        td.textContent = item;
                    }

                    td.className = headerClassIndex;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            resolve(table); // Return the fully constructed table
            window.dispatchEvent(new Event('load'));
        } else {
            // Start processing rows in chunks
            processRows(100).then(() => {
                frontend.treeselect();
                resolve(table); // Return the fully constructed table
                window.dispatchEvent(new Event('load'));
            }).catch(reject);
        }
    });
};


