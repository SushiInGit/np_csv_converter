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

            const uploadList = document.createElement('div');
            uploadList.className = 'uploadList';
            listContainer.appendChild(uploadList);
            listContainer.appendChild(storageSpace);
            const sortItems = backend.helpers.sortObjectByKey(items, null);
            sortItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'itemDiv';

                const formattedItem = item.replace(/_/g, ' ');
                const listEntry = document.createElement('div');
                listEntry.className = 'listEntry';
                const delContainer = document.createElement('div');
                delContainer.className = 'delDiv';
                const nameContainer = document.createElement('div');
                nameContainer.className = 'nameDiv';
                const itemNameSpan = document.createElement('span');
        
                itemNameSpan.innerHTML = `${formattedItem}`;
                itemNameSpan.title = formattedItem;
                itemNameSpan.className = 'itemName';

                if(backend.storageShow.showLastSearch().showBank === (item + "_bankRecords")) {
                    itemNameSpan.classList.add('active');
                    listEntry.classList.add('active');
                }
                
                itemNameSpan.onclick = () => swap(item);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.className = 'del';
                deleteButton.onclick = () => del(item.name, item);

                delContainer.appendChild(deleteButton);
                nameContainer.appendChild(itemNameSpan);
                listEntry.appendChild(delContainer);
                listEntry.appendChild(nameContainer);
                itemDiv.appendChild(listEntry);
                itemDiv.style.scrollSnapAlign = 'end';
                uploadList.appendChild(itemDiv);
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
            const maxStorageSize = 3 * 1024 * 1024; 

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
            //fileInput.addEventListener('change', () => backend.fileProcessor.processFiles(fileInput.files));
            fileInput.addEventListener("change", function (event) {
                const file = event.target.files[0];
                let filesizeLeft = backend.storageSize.getMaxStorage() - backend.storageManager.getStorageUsage().usedMB
                if (file) {
                  const fileSize = file.size; 
                  const fileSizeInMB = fileSize / (1024 * 1024);
                  if (fileSizeInMB > filesizeLeft) {
                    global.alertsystem('warning', 'Storage has reached its limit. Remove old or unnecessary data to free up space.', 7);
                    return;
                }
                  if (fileSize <= maxStorageSize) {
                    backend.fileProcessor.processFiles(fileInput.files)
                  } else {
                    global.alertsystem('warning', 'The file is too large. Only files up to ~3MB are supported.', 7);
                    return;
                  }
                }
              });
        }, 50);
    }

    return {
        render: UploadEvent
    };
})();
