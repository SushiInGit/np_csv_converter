var file;
var columnNames = [];
var itemsArr = [];
function resetTable() {
    var table = document.querySelector("#phoneRecords");
    table.innerHTML = '';
    columnNames = [];
    itemsArr = [];
}
document.querySelector('#excelFile').addEventListener('change', function (event) {
    file = event.target.files[0];
    readFile();
});
document.querySelector('#sheet').addEventListener('change', readFile);

document.querySelector('#timezone').addEventListener('change', fillTable);
document.querySelector('#use12hClock').addEventListener('change', fillTable);
document.querySelector('#timeFirst').addEventListener('change', fillTable);
document.querySelector('#dateformat').addEventListener('change', fillTable);
document.querySelector('#timezoneOffset').addEventListener('change', fillTable);
document.querySelector('#copyTable').addEventListener('click', copyTableToClipboard);

function readFile() {
    if (!file) return;
    var reader = new FileReader();
    var selectedSheet = parseInt(document.querySelector("#sheet").value);

    reader.onload = function (e) {
        var workbook = new ExcelJS.Workbook();
        itemsArr = [];
        workbook.xlsx.load(e.target.result).then(function () {
            var maxSheets = workbook.worksheets.length;
            document.querySelector('#sheet').max = maxSheets;

            if (selectedSheet > maxSheets) {
                document.querySelector('#sheet').value = maxSheets;
                selectedSheet = maxSheets;
            }
            var worksheet = workbook.getWorksheet(selectedSheet);
            worksheet.eachRow(function (row, rowNumber) {
                if (rowNumber == 1) {
                    columnNames = row.values;
                }
                else {
                    var createArray = [];

                    row.values.forEach(function (value, index) {
                        createArray.push(value);
                    });
                    itemsArr.push(createArray);
                }
            })
            fillTable();
        })
            .catch(function (error) {
                alert('File is not a valid Excel file');
                file = undefined;
            });
    }
    reader.readAsArrayBuffer(file)
}

function fillTable() {
    if (!file) return;
    var table = document.querySelector("#phoneRecords");
    table.innerHTML = '';
    var row = document.createElement("tr");
    row.appendChild(Object.assign(document.createElement("th"), { innerHTML: '' }));
    columnNames.forEach((header, i) => {
        let th = document.createElement("th");
        th.innerHTML = `${String.fromCharCode(65 + i - 1)}<br>${header}`;
        row.appendChild(th);
    });
    table.append(row);
    itemsArr.forEach((itemRow, index) => {
        row = document.createElement("tr");
        row.appendChild(Object.assign(document.createElement("td"), { innerHTML: index + 1 }));

        itemRow.forEach((item) => {
            if (isValidISODateString(item)) {
                var date = new Date(item);
                var timezone = document.querySelector("#timezone").value;
                var dateformat = document.querySelector("#dateformat").value;
                var hour12 = document.querySelector("#use12hClock").checked;
                var timeFirst = document.querySelector("#timeFirst").checked;
                var timezoneOffset = document.querySelector("#timezoneOffset").value;
                date.setHours(date.getHours() + (1 * timezoneOffset));
                var dateOptions = { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' };
                var timeOptions = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: hour12 };
                var dateFormatter = new Intl.DateTimeFormat(dateformat, dateOptions);
                var timeFormatter = new Intl.DateTimeFormat([], timeOptions);
                var formattedDate = dateFormatter.format(date);
                var formattedTime = timeFormatter.format(date);
                item = timeFirst ? `${formattedTime} ${formattedDate}` : `${formattedDate} ${formattedTime}`;
            }
            row.appendChild(Object.assign(document.createElement("td"), { innerHTML: item }));
        });
        table.append(row);
    });
    checkFileSelected();
    makeLinksClickable();
}

function isValidISODateString(dateString) {
    var iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
    if (!iso8601Regex.test(dateString)) return false;
    var date = new Date(dateString);
    return !isNaN(date.getTime());
}

function searchTable() {
    var input = document.querySelector("#searchInput").value.toLowerCase();
    var rows = document.querySelectorAll("#phoneRecords tr");
    var visibleRowIndex = 0;
    rows.forEach(function(row, index) {
        if (index === 0) return;
        var rowText = row.innerText.toLowerCase();
        if (rowText.includes(input)) {
            row.style.display = ""; e
            if (visibleRowIndex % 2 === 0) {
                row.style.backgroundColor = "#2a2a2a"; 
            } else {
                row.style.backgroundColor = "#1e1e1e"; 
            }
            visibleRowIndex++;
        } else {
            row.style.display = "none"; 
        }
    });
}

function copyTableToClipboard() {
    if (!file) {
        alert("Nothing to copy");
        return;
    }
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
        var msg = successful ? "successful" : "unsuccessful"
        alert("Copy table command was " + msg)
    } catch (err) {
        alert("Unable to copy", err)
    }
    document.body.removeChild(tempTextArea);
}

function checkFileSelected() {
    var fileInput = document.getElementById("excelFile");
    var inputMask = document.getElementById("inputMask");
    var fileControl = document.getElementById("fileControl");
    var copyTable = document.getElementById("copyTable");
    var toggleButton = document.getElementById("toggleButton");

    if (fileInput.files.length > 0) {
        inputMask.style.display = "none";
        fileControl.style.display = "grid";
        copyTable.style.display = "block";
        toggleButton.style.display = "block";
    } else {
        inputMask.style.display = "block";
        fileControl.style.display = "none";
        copyTable.style.display = "none";
        toggleButton.style.display = "none";
    }
}
function toggleInputMask() {
    var inputMask = document.getElementById("inputMask");
    var button = document.getElementById("toggleButton");

    if (inputMask.style.display === "none") {
        inputMask.style.display = "block";
        button.innerHTML = "Hide Input Mask";
    } else {
        inputMask.style.display = "none";
        button.innerHTML = "Show Input Mask";
    }
}
checkFileSelected();

function makeLinksClickable() {
    var rows = document.querySelectorAll("#phoneRecords tr");
    rows.forEach(function(row, index) {
        if (index === 0) return;
        row.querySelectorAll("td").forEach(function(cell) {
            var cellText = cell.innerText;
            var urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
            if (urlPattern.test(cellText)) {
                var link = cellText.match(urlPattern)[0]; 
                if (!link.startsWith("http")) {
                    link = "http://" + link;
                }
                cell.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
            }
        });
    });
}
