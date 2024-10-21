var frontend = frontend ?? {};

frontend.popupUpload= (function () {

    function UploadEvent() {

        function del(index, item) {
            const popupDivName = "confirm-delete";
            const content = `
                <div class="confirmation-content noselect ">
                    <p>Are you sure you want to delete this file? <br><br><b>Filename:</b> <br>${item.replace(/_/g, ' ')}</p>
                </div>
            `;

            const footer = `
                    <button class="risk" onclick="middleman.popupModel.delBank('${item}')">Delete</button>
            `;
                // <button class="ok" onclick=" closePopupDiv(), deactivateLoader()">Cancel</button>
                // <button class="risk" onclick="middleman.popupModel.delItem('${item}')">Delete</button>

            middleman.popupModel.createPopup(popupDivName, 'Delete Confirmation', content, footer);
        }

        function swap(item) {
                backend.storageShow.saveLastSearchRecord(item + "_bankRecords", true);
                window.location.href = 'bank.html'
        }

        function renderList() {
            items = backend.storageSelector.getGroupedKeys().banksNames;
            const listContainer = document.querySelector('popup .model .footer');

            listContainer.innerHTML = '';
            listContainer.style.width = 'calc(100% - 20px)';
            listContainer.style.maxWidth = 'calc(100% - 20px)';

            if (items.length > 0) {
                const br = document.createElement('br');
                const hr = document.createElement('hr');
                const heading = document.createElement('h2');
                heading.textContent = `Uploaded File's`;
                listContainer.appendChild(br);
                listContainer.appendChild(hr);
                listContainer.appendChild(heading);
            }

            const storageSpace = document.createElement('div');
            if (items.length > 0) {
                storageSpace.innerHTML = `
                <br><hr><center>
                <small>
                Storage-Space: ${backend.storageManager.getStorageUsage().usedMB}MB of ${backend.storageSize.getMaxStorage()}MB  (${backend.storageManager.getStorageUsage().usedPercentage}% used)
                </small><br>
                <p style="font-size: 10px;">
                Notice: Storage-Space is shared between phone and bank subpoenas.
                </p>
                </center>`;
            }

            const itemList = document.createElement('ul');
            itemList.className = 'ulfileslist';
            listContainer.appendChild(itemList);
            listContainer.appendChild(storageSpace);
            const sortItems = backend.helpers.sortObjectByKey(items, null);
            sortItems.forEach(item => {
                const li = document.createElement('li');
                li.style.listStyleType = "none";

                const formattedItem = item.replace(/_/g, ' ');
                const liDiv = document.createElement('div');
                liDiv.className = 'li div';
                const buttonDiv = document.createElement('div');
                buttonDiv.className = 'li button';
                const spanDiv = document.createElement('div');
                spanDiv.className = 'li span';
                const itemName = document.createElement('span');

                itemName.innerHTML = `${formattedItem}`;
                itemName.title = formattedItem;
                itemName.className = 'fileslist';

                if(backend.storageShow.showLastSearch().showBank === (item + "_bankRecords")) {
                    itemName.className = 'fileslist active';
                }
                
                itemName.onclick = () => swap(item);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.className = 'del';
                deleteButton.onclick = () => del(item.name, item);

                buttonDiv.appendChild(deleteButton);
                spanDiv.appendChild(itemName);
                liDiv.appendChild(buttonDiv);
                liDiv.appendChild(spanDiv);
                li.appendChild(liDiv);
                li.style.scrollSnapAlign = 'end';
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
        render: UploadEvent
    };
})();
