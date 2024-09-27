const popupDiv = document.getElementById("popup");
const errorDiv = document.getElementById("error");
const loader = document.querySelector('.loader');

document.addEventListener("keydown", function (event) {   // Close Popups
    if (event.key === "Escape") {
        errorDiv.classList.remove("show");
        popupDiv.classList.remove("show");
        errorDiv.classList.add("hide");
        popupDiv.classList.add("hide");
        loader.classList.remove("active");
        loader.classList.add("inactive");
    }
});
function showPopup() {
    errorDiv.classList.remove("hide");
    popupDiv.classList.remove("hide");
    errorDiv.classList.add("show");
    popupDiv.classList.add("show");
    loader.classList.add("active"); 
    loader.classList.remove("inactive");
}

function clearPopupDiv() {
    errorDiv.innerHTML = '';
    popupDiv.innerHTML = '';
    errorDiv.classList.remove("show");
    popupDiv.classList.remove("show");
    errorDiv.classList.add("hide");
    popupDiv.classList.add("hide");
    loader.classList.remove("active"); 
    loader.classList.add("inactive");
}
function UploadEvent() {
    clearPopupDiv(); // Clear Event-DIV
    showPopup();
    loader.classList.add("active");
    popupDiv.innerHTML = `
    <button class="close" onclick="UploadEvent(), clearPopupDiv(), deactivateLoader()">X</button>
    <h2>File upload</h2><br>
    <form id="upload-form">
    <div class="drop-zone" id="drop-zone">
        Drag & Drop or click to Upload an Excel-File
        <input type="file" id="file-input" accept=".xlsx, .xls" style="display: none;" required>
    </div>
    <div id="error-message" class="error-message"></div>
    </form>
    `;


    const fileInput = document.querySelector('#file-input');
    const dropZone = document.querySelector('#drop-zone');

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        var files = event.dataTransfer.files;
        if (files.length) {
            var type = backend.fileProcessor.processFiles(files);
        }
    });
    fileInput.addEventListener('change', () => backend.fileProcessor.processFiles(fileInput.files));
}

