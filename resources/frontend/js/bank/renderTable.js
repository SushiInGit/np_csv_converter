var frontend = frontend ?? {};

frontend.renderTable = function (data) {
    return new Promise((resolve, reject) => {
        var table = document.querySelector("#bankRecordsTable");
        if (typeof data !== 'object' || Object.keys(data).length === 0) {
            return;
        }

        setTimeout(() => {
            window.dispatchEvent(new Event('beforeunload'));
            var progressbar = document.getElementById("progressbar");
            progressbar.style.display = "flex";
            var totalRecords = Object.keys(data).length || 100;  
            var currentProgress = 0;

            function updateProgress(value) {
                var percentage = Math.round((value / totalRecords) * 100);
                const progressText = document.querySelector('.percent .num h2');
                progressText.innerHTML = `${percentage}<span>%</span>`;
              
                const circle = document.querySelector('.percent svg circle:nth-child(2)');
                const radius = 70; 
                const circumference = 2 * Math.PI * radius; 
                const offset = circumference - (percentage / 100) * circumference; 
                
                circle.style.strokeDashoffset = offset;
            }

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
                "to_account_id", "to_civ_name", "to_account_name",
                "type", "direction",
                "amount", "original_amount",
                "tax_percentage", "tax_amount",
                "tax_type", "tax_id",
                "date"
            ];

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
            frontend.treeselect();

            var tbody = document.createElement("tbody");
            function populateTableChunk(index = 0, chunkSize = 50) {
                var keys = Object.keys(data);
                var end = Math.min(index + chunkSize, data.length);
                for (let i = index; i < end; i++) {
                    var row = data[i];
                    var tr = document.createElement("tr");

                    headersClass.forEach((headerClass, counter) => {
                        var td = document.createElement("td");
                        var item = row[headerClass];

                        if (headers[counter] === "To: Account Name") {
                            item = middleman.stateAccounts(row.to_account_id, row.to_civ_name);
                        }

                        if (headers[counter] === "From: Account Name") {
                            item = middleman.stateAccounts(row.from_account_id, row.from_civ_name);
                        }

                        if (headers[counter].includes("Date")) {
                            var date = new Date(item);
                            td.textContent = `${processTimestamp(backend.timeConverterOffset.offsetTime(date)).date} ${processTimestamp(backend.timeConverterOffset.offsetTime(date)).time}`;
                        } else {
                            td.textContent = item ?? "";
                        }

                        td.className = headerClass;
                        tr.appendChild(td);
                    });

                    tbody.appendChild(tr);
                }

                currentProgress = end;
                updateProgress(currentProgress);

                if (end < keys.length) {
                    setTimeout(() => populateTableChunk(end, chunkSize), 0);
                } else {
                    progressbar.style.display = "none";
                    table.appendChild(tbody);
                    resolve(table); 
                    frontend.treeselect();
                    window.dispatchEvent(new Event('load'));
                }
            }

            populateTableChunk();
        }, 0);
    });
};