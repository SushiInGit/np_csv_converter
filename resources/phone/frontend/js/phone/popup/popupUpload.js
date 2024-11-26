var frontend = frontend ?? {};

frontend.popupUpload = (function () {

    function UploadEvent() {

        function del(index, item) {
            const popupDivName = "confirm-delete";

            const content = `
                <div class="confirmation-content noselect ">
                    <p>Are you sure you want to delete this file? <br><br><b>Owner:</b><br>${middleman.findNames(item.simowner)} - ${String(item.simowner).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")} <br><br><b>Filename:</b> <br>${item.name.replace(/_/g, ' ')}</p>
                </div>
            `;

            const footer = `
                    <button class="risk" onclick="middleman.popupModel.delPhone('${item.name}')">Delete</button>
            `;
            // <button class="ok" onclick=" closePopupDiv(), deactivateLoader()">Cancel</button>

            middleman.popupModel.createPopup(popupDivName, 'Delete Confirmation', content, footer);
        }

        function swap(index, item, type, simowner) {
            //console.log(`Swap --> ${index} / ${item} / ${type} / ${simowner}`);
            if (type === "single") {
                middleman.requestData.setDisplay('');
                backend.storageShow.saveLastSearchRecord(item, true);
                window.location.href = 'phone.html'
            }
            if (type === "all") {
                middleman.requestData.setDisplay(simowner);
                backend.storageShow.saveLastSearchRecord(item, true);
                window.location.href = 'phone.html'
            }
        }

        function renderList() {
            items = backend.storageSelector.getGroupedKeys().phoneNames;
            const listContainer = document.querySelector('popup .model .footer');

            listContainer.innerHTML = '';
            listContainer.style.width = 'calc(100% - 20px)';
            listContainer.style.maxWidth = 'calc(100% - 20px)';
            listContainer.style.wordWrap = 'break-word';
            listContainer.style.overflowWrap = 'break-word';


            if (items.length > 0) {
                const br = document.createElement('br');
                const hr = document.createElement('hr');
                const heading = document.createElement('h2');
                heading.textContent = `Uploaded File's`;
                listContainer.appendChild(br);
                listContainer.appendChild(hr);
                listContainer.appendChild(heading);
            }

            const groupedItems = items.reduce((group, item) => {
                (group[item.simowner] = group[item.simowner] || []).push(item);
                return group;
            }, {});

            const storageSpace = document.createElement('div');
            if (items.length > 0) {
                storageSpace.innerHTML = `
                <br><hr><center>
                <small>
                Storage-Space: ${backend.storageManager.getStorageUsage().usedMB}MB of ${backend.storageSize.getMaxStorage()}MB  (${backend.storageManager.getStorageUsage().usedPercentage}% used)
                </small>
                </center>`;
            }

            const uploadList = document.createElement('div');
            uploadList.className = 'uploadList';
            listContainer.appendChild(uploadList);
            listContainer.appendChild(storageSpace);
            
            for (const [simowner, items] of Object.entries(groupedItems)) {
                const simownerDiv = document.createElement('div');
                const simownerNameDiv = document.createElement('div');
                simownerDiv.className = 'simownerDiv';
            
                const simOwnerData = [];
                simOwnerData.name = middleman.findNames(simowner);
                simOwnerData.number = String(simowner).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3");
            
                if (simOwnerData.name === "Unknown Contact") {
                    simownerNameDiv.innerHTML = `#${simOwnerData.number}`;
                } else {
                    simownerNameDiv.innerHTML = `${simOwnerData.name}`;
                }
                simownerNameDiv.className = 'simownerName';
            
                if (sessionStorage.getItem('simOwnerId') === simowner) {
                    simownerNameDiv.classList.add('active');
                }
            
                simownerNameDiv.style.cursor = 'pointer';
                simownerNameDiv.onclick = () => swap(null, items.name, "all", simowner);
                simownerDiv.appendChild(simownerNameDiv);
            
                const ownerItemEntry = document.createElement('div');
                ownerItemEntry.className = 'ownerItemEntry';
            
                const sortedItems = backend.helpers.sortObjectByKey(items, "name");
            
                sortedItems.forEach((item, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'itemDiv';
            
                    const formattedItem = item.name.replace(/_/g, ' ');
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
                    
                    if (backend.storageShow.showLastSearch().showPhone === item.name && (sessionStorage.getItem('simOwnerId') !== simowner)) {
                        itemNameSpan.className = 'fileslist active';
                    } 


                    itemNameSpan.onclick = () => swap(index, item.name, "single", simowner);
 
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
                    ownerItemEntry.appendChild(itemDiv);
                });
            
                simownerDiv.appendChild(ownerItemEntry);
                uploadList.appendChild(simownerDiv);
            }
            
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
        frontend.popupSettings.removeBank(); //Remove old BANKRECORDS 
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
            const maxStorageSize = 5 * 1024 * 1024; 

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
