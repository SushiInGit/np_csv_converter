
/* THIS WHOLE FILE IS TEMP TO RENDER A TABLE WHILE WE DONT HAVE A DESIGN YET */

window.addEventListener("load", (event) => {

    var table = document.querySelector("#bankRecordsTable");
    var data = middleman.bankData.get().records;
    //console.table(data);
    // var data = backend.dataController.getData(backend.helpers.getAllSheetTypes().BANKRECORDS);
    var headers = [
        "ID", "Comment", "Type", "Direction", "From: Account ID", 
        "From: Account Name", "From: Accounttype", "To: Account ID", 
        "To: Account Name", "To: Accounttype", "Amount", "Date", 
        "Tax %", "Tax-Type", "Tax-ID"
    ];
    var headersClass = [
        "id", "comment", "type", "direction", "from_account_id", 
        "from_civ_name", "from_account_name", "to_account_id", 
        "to_civ_name", "to_account_name", "amount", "date", 
        "tax_percentage", "tax_type", "tax_id"
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

    var tbody = document.createElement("tbody");

    data.forEach((row) => {
        var tr = document.createElement("tr");
        var counter = 0;

        Object.values(row).forEach((item) => {
            counter++; 
            if (counter === 16) { // DOWN SHOW CUSTOM INDEX
                return; 
            }
            var headerClassIndex = headersClass[counter - 1];
            var td = document.createElement("td");
            td.textContent = item;
            td.className = headerClassIndex; 
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
});


