document.querySelector("#headTable").style.display = "none";
document.querySelector('#copyTable').addEventListener('click', copyTableToClipboard);

function copyTableToClipboard() {
    // Set ShowUTC to false so it doesnt get copied
    const showUTC = document.querySelector('#showUTC');
    var _showUTCValue = showUTC.checked;
    showUTC.checked = false;
    showUTC.dispatchEvent(new Event('change'));

    var table = document.querySelector("#phoneRecords");
    var rows = table.querySelectorAll("tr");
    var tableText = "";

    rows.forEach(function (row, rowIndex) {
        if (rowIndex === 0) return;
        var cells = row.querySelectorAll("td");
        var rowText = [];
        cells.forEach(function (cell, cellIndex) {
            if (cellIndex === 0) return;
            rowText.push(cell.innerText);
        });

        if (rowText.length > 0) {
            tableText += rowText.join("\t") + "\n";
        }
    });

    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = tableText.trim();
    document.body.appendChild(tempTextArea);
    tempTextArea.select();

    try {
        var successful = document.execCommand("copy")
        var msg = successful ? "successful" : "unsuccessful";

        // Reset value
        showUTC.checked = _showUTCValue;
        showUTC.dispatchEvent(new Event('change'));

        alert("Copy table command was " + msg)
    } catch (err) {
        alert("Unable to copy", err)
    }
    document.body.removeChild(tempTextArea);
}
