var _file;
var _columnNames = [];
var _itemsArr = [];

document.querySelector('#timezone').addEventListener('change', fillTable);
document.querySelector('#use12hClock').addEventListener('change', fillTable);
document.querySelector('#timeFirst').addEventListener('change', fillTable);
document.querySelector('#dateformat').addEventListener('change', fillTable);
document.querySelector('#timezoneOffset').addEventListener('change', fillTable);
document.querySelector('#showUTC').addEventListener('change', fillTable);

document.addEventListener('DOMContentLoaded', () => {
    const fileUploadBtn = document.getElementById('fileUploadPopup');
    const fileUploadModal = document.getElementById('fileUploadModal');
    const closeFileUpload = document.getElementById('closeFileUpload');
    const dropZoneError = document.getElementById('dropZoneError');
    // const dropZone = document.getElementById('dropZone');
    const dropZones = document.querySelectorAll("#dropZone");
    const fileInput = document.getElementById('fileInput');

    document.querySelector('#sheet').addEventListener('change', readFile);

    fileUploadBtn.addEventListener('click', () => {
        fileUploadModal.style.display = 'flex';
        dropZoneError.style.display = 'none';
    });

    closeFileUpload.addEventListener('click', () => {
        fileUploadModal.style.display = 'none';
    });

    dropZones.forEach((_dropZone) => {
        _dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        _dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            _dropZone.style.backgroundColor = '#505050';
        });

        _dropZone.addEventListener('dragleave', () => {
            _dropZone.style.backgroundColor = '#404040';
        });

        _dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            _dropZone.style.backgroundColor = '#404040';
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });
    });

    fileInput.addEventListener('change', () => {
        handleFileUpload(fileInput.files);
    });

    document.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    // alert(`Excel-File "${file.name}" uploaded from clipboard.`);
                    handleFileUpload(file);
                }
            }
        }
    });
});

function handleFileUpload(files) {    
    var file = !!files[0] ? files[0] : files;

    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        _file = file;

        readFile();
        fileUploadModal.style.display = 'none';
        document.getElementById("welcomeDIVcontainer").style.display = "none";
        document.getElementById("head-container").style.display = "flex";
        document.querySelector("#headTable").style.display = "flex";
        document.getElementById('searchInput').value = '';

    }else{
        dropZoneError.style.display = 'flex';
        modalcontent.style.border = '1px solid #ff1a1a';
        modalcontent.style.boxShadow = '0 0 15px 5px rgba(252, 20, 20, 0.7)';
    }
}

function readFile() {

    var reader = new FileReader();
    var selectedSheet = parseInt(document.querySelector("#sheet").value);

    reader.onload = function (e) {
        var workbook = new ExcelJS.Workbook();
        _itemsArr = [];

        workbook.xlsx.load(_file).then(function () {
            var maxSheets = workbook.worksheets.length;
            document.querySelector('#sheet').max = maxSheets;

            if (selectedSheet > maxSheets) {
                document.querySelector('#sheet').value = maxSheets;
                selectedSheet = maxSheets;
            }
            var worksheet = workbook.getWorksheet(selectedSheet);
            worksheet.eachRow(function (row, rowNumber) {
                if (rowNumber == 1) {
                    _columnNames = row.values;
                }
                else {
                    var createArray = [];

                    row.values.forEach(function (value, index) {
                        createArray.push(value);
                    });
                    _itemsArr.push(createArray);
                }
            })
            fillTable();
        })
            .catch(function (error) {
                alert('File is not a valid Excel file');
                _file = undefined;
            });
    }
    reader.readAsArrayBuffer(_file)
}

function fillTable() {
    var table = document.querySelector("#phoneRecords");
    table.innerHTML = '';

    _itemsArr.forEach((itemRow, index) => {
        var row = document.createElement("tr");
        row.appendChild(Object.assign(document.createElement("td"), { innerHTML: index + 1 }));

        var itemIndex = 0;

        itemRow.forEach((item) => {

            itemIndex++;

            if (isValidISODateString(item)) {
                var date = new Date(item);

                var timezone = document.querySelector("#timezone").value;
                var dateformat = document.querySelector("#dateformat").value;
                var hour12 = document.querySelector("#use12hClock").checked;
                var timeFirst = document.querySelector("#timeFirst").checked;
                var timezoneOffset = document.querySelector("#timezoneOffset").value;
                var showUTC = document.querySelector("#showUTC").checked;

                var formattedUTC = date.toISOString();

                date.setHours(date.getHours() + (1 * timezoneOffset));

                var dateOptions = { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' };
                var timeOptions = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: hour12 };

                var dateFormatter = new Intl.DateTimeFormat(dateformat, dateOptions);
                var timeFormatter = new Intl.DateTimeFormat([], timeOptions);

                var formattedDate = dateFormatter.format(date);
                var formattedTime = timeFormatter.format(date);

                item = timeFirst ? `${formattedTime} ${formattedDate}` : `${formattedDate} ${formattedTime}`;

                if (showUTC)
                    item += " <br/> <i style=\"font-size: 65%;\">(UTC: " + formattedUTC + ")</i>";



                // Add dateformat to 
                if (_columnNames[itemIndex].includes(`<i name="dateFormat"`)) {
                    _columnNames[itemIndex] = _columnNames[itemIndex].split(`<br/><i name="dateFormat"`)[0];
                }

                _columnNames[itemIndex] = timeFirst
                    ? _columnNames[itemIndex] + `<br/><i name="dateFormat" style="font-size: 75%;">HH:MM:SS ${document.querySelector("#dateformat option:checked").innerHTML}</i>`
                    : _columnNames[itemIndex] + `<br/><i name="dateFormat" style="font-size: 75%;">${document.querySelector("#dateformat option:checked").innerHTML} HH:MM:SS</i>`;
            }

            row.appendChild(Object.assign(document.createElement("td"), { innerHTML: item }));
        });

        table.append(row);
    });

    var headerRow = document.createElement("tr");
    headerRow.appendChild(Object.assign(document.createElement("th"), { innerHTML: '' }));

    _columnNames.forEach((header, i) => {
        let th = document.createElement("th");
        th.innerHTML = `${String.fromCharCode(65 + i - 1)}<br>${header}`;
        headerRow.appendChild(th);
    });

    table.prepend(headerRow);

    makeLinksClickable();
}

function resetTable() {
    var table = document.querySelector("#phoneRecords");
    table.innerHTML = '';
    columnNames = [];
    itemsArr = [];
}

function isValidISODateString(dateString) {
    var iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
    if (!iso8601Regex.test(dateString)) return false;
    var date = new Date(dateString);
    return !isNaN(date.getTime());
}


function makeLinksClickable() {
    var rows = document.querySelectorAll("#phoneRecords tr");
    rows.forEach(function (row, index) {
        if (index === 0) return;
        row.querySelectorAll("td").forEach(function (cell) {
            var cellText = cell.innerText;
            var urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
            if (urlPattern.test(cellText)) {
                var link = cellText.match(urlPattern)[0];
                if (!link.startsWith("http")) {
                    link = "http://" + link;
                }
                cell.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
                if (/\.(jpeg|jpg|gif|png|webp|svg)$/.test(link)) {
                    cell.querySelector("a").addEventListener("mouseover", function (event) {
                        showImagePreview(event, link);
                    });
                    cell.querySelector("a").addEventListener("mousemove", function (event) {
                        moveImagePreview(event);
                    });
                    cell.querySelector("a").addEventListener("mouseout", function () {
                        hideImagePreview();
                    });
                }
            }
        });
    });
}

function showImagePreview(event, imageUrl) {
    var preview = document.createElement("div");
    preview.id = "imagePreview";
    preview.style.position = "absolute";
    preview.style.border = "1px solid #ccc";
    preview.style.backgroundColor = "#222";
    preview.style.padding = "5px";
    preview.style.zIndex = "1000";

    var img = document.createElement("img");
    img.src = imageUrl;
    img.style.maxWidth = "200px";
    img.style.maxHeight = "200px";

    preview.appendChild(img);
    document.body.appendChild(preview);
    moveImagePreview(event);
}

function moveImagePreview(event) {
    var preview = document.getElementById("imagePreview");
    if (preview) {
        preview.style.left = event.pageX + 15 + "px";
        preview.style.top = event.pageY + 15 + "px";
    }
}

function hideImagePreview() {
    var preview = document.getElementById("imagePreview");
    if (preview) {
        preview.remove();
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        document.getElementById("fileUploadModal").style.display = "none";
    }
});
