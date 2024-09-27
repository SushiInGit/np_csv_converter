
/* THIS WHOLE FILE IS TEMP TO RENDER A TABLE WHILE WE DONT HAVE A DESIGN YET */

window.addEventListener("load", (event) => {

    var table = document.querySelector("#bankRecordsTable");
    var data = middleman.bankData.get().records;
    // var data = backend.dataController.getData(backend.helpers.getAllSheetTypes().BANKRECORDS);

    data.forEach((row) => {
        var tr = document.createElement("tr");

        Object.values(row).forEach((item) => {
            var td = document.createElement("td");

            td.textContent = item;

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
});
