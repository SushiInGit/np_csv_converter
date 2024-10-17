var frontend = frontend ?? {};

frontend.popupRender = (function () {

    function UploadEvent() {

        function del(index, item) {
            backend.storageSelector.deleteTextsAndCalls(item);
            //console.log(`Del --> ${index} / ${item}`);
            renderList();
            if(backend.storageSelector.searchRecord(item, true, 'last') === false){
                window.location.href = 'phone.html'; //Force-Reload becouse empty and no fallback data
            }
        }

        function swap(index, item) {
            //console.log(`Swap --> ${index} / ${item}`);
            backend.storageShow.saveLastSearchRecord(item, true);
            window.location.href = 'phone.html'
        }
        
        function renderList() {
            items = backend.storageSelector.getGroupedKeys().phoneNames;

            const listContainer = document.querySelector('popup .model .footer');

            listContainer.innerHTML = ''; 

            if (items.length > 0) {
                const br = document.createElement('br'); 
                const hr = document.createElement('hr'); 
                listContainer.appendChild(br);
                listContainer.appendChild(hr); 
            }
            const itemList = document.createElement('ul'); 
            listContainer.appendChild(itemList);

            items.forEach((item, index) => {
                const li = document.createElement('li');
                const formattedItem = item.replace(/_/g, ' ');
                const itemName = document.createElement('span');

                itemName.innerHTML =  `${formattedItem} `; 
                itemName.style.cursor = 'pointer'; 
                itemName.onclick = () => swap(index, item); 
        
                li.appendChild(itemName); 
        

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.onclick = () => del(index, item); 
        
                li.appendChild(deleteButton); 
                itemList.appendChild(li); 
            });
        }

        const popupDivName = "upload";

        const content = `
            <form id="upload-form">
                <div class="drop-zone" id="drop-zone">
                    Drag & Drop or click to Upload an Excel-File
                    <input type="file" id="file-input" accept=".xlsx, .xls" style="display: none;" required>
                </div>
            </form>
        `;

        const footer = ``;

        middleman.popupModel.createPopup(popupDivName, 'File upload', content, footer);

        setTimeout(() => {
            renderList();
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
