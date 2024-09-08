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
    console.log(file);
    readFile();
});
document.querySelector('#sheet').addEventListener('change', readFile);

document.querySelector('#timezone').addEventListener('change', fillTable);
document.querySelector('#use12hClock').addEventListener('change', fillTable);
document.querySelector('#timeFirst').addEventListener('change', fillTable);
document.querySelector('#dateformat').addEventListener('change', fillTable);
document.querySelector('#timezoneOffset').addEventListener('change', fillTable);
document.querySelector('#copyTable').addEventListener('click', copyTableToClipboard);

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
                if (/\.(jpeg|jpg|gif|png|webp|svg)$/.test(link)) {
                    cell.querySelector("a").addEventListener("mouseover", function(event) {
                        showImagePreview(event, link);
                    });
                    cell.querySelector("a").addEventListener("mousemove", function(event) {
                        moveImagePreview(event);
                    });
                    cell.querySelector("a").addEventListener("mouseout", function() {
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

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        document.getElementById("settingsModal").style.display = "none";
        document.getElementById("fileUploadModal").style.display = "none";
    }
});
