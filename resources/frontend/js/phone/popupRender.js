var frontend = frontend ?? {};

frontend.popupRender = (function () {

    function UploadEvent() {
        const popupDivName = "upload";

        const content = `
            <form id="upload-form">
                <div class="drop-zone" id="drop-zone">
                    Drag & Drop or click to Upload an Excel-File
                    <input type="file" id="file-input" accept=".xlsx, .xls" style="display: none;" required>
                </div>
            </form>
        `;
        const footer = `
        `;
        
        middleman.popupModel.createPopup(popupDivName, 'File upload', content, footer);

        setTimeout(() => {
            const excelMimeTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // .xlsx
                'application/vnd.ms-excel'                                            // .xls
            ];
            function isExcelFile(file) {
                return excelMimeTypes.includes(file.type);
            }
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
                    if (!isExcelFile(type)) {
                        global.alertsystem('warning', 'Warning: Unsupported file type. Please upload an Excel file.', 7);
                        return;
                    }
                }
            });
            fileInput.addEventListener('change', () => backend.fileProcessor.processFiles(fileInput.files));
        }, 50);
    }

    return {
        UploadEvent: UploadEvent
    };
})();
