var frontend = frontend ?? {};

frontend.popupUpload= (function () {

    function UploadEvent() {

        function del(index, item) {
            const popupDivName = "confirm-delete";

            const content = `
                <div class="confirmation-content noselect ">
                    <p>Are you sure you want to delete this file? <br><br><b>Owner:</b><br>${middleman.findNames(item.simowner)} - ${String(item.simowner).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")} <br><br><b>Filename:</b> <br>${item.name.replace(/_/g, ' ')}</p>
                </div>
            `;

            const footer = `
                    <button class="risk" onclick="middleman.popupModel.delItem('${item.name}')">Delete</button>
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
                storageSpace.innerHTML = `<br><hr><center><small>Storage-Space: ${backend.storageManager.getStorageUsage().usedMB}MB of ${backend.storageSize.getMaxStorage()}MB  (${backend.storageManager.getStorageUsage().usedPercentage}% used)</small></center>`;
            }

            const itemList = document.createElement('ul');
            listContainer.appendChild(itemList);
            listContainer.appendChild(storageSpace);

            for (const [simowner, items] of Object.entries(groupedItems)) {
                const simownerLi = document.createElement('li');
                const simownerName = document.createElement('span');
                simownerName.innerHTML = `${middleman.findNames(simowner)} - ${String(simowner).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")} `;
                simownerName.className = 'fileslist';
                simownerName.style.cursor = 'pointer';
                simownerName.onclick = () => swap(null, items.name, "all", simowner);
                simownerLi.appendChild(simownerName);

                const ownerItemList = document.createElement('ul');
                itemList.style.maxHeight = '150px';
                itemList.style.overflowY = 'auto';
                itemList.style.overflowX = 'hidden';
                itemList.style.listStyleType = 'none';
                itemList.style.padding = '0';
                itemList.style.margin = '0';
                itemList.style.scrollBehavior = 'smooth';
                itemList.style.scrollSnapType = 'y mandatory';
                ownerItemList.style.paddingTop = '10px';
                ownerItemList.style.paddingLeft = '10px';
                ownerItemList.style.marginLeft = '0px';

                items.forEach((item, index) => {
                    const li = document.createElement('li');
                    li.style.listStyleType = "none";

                    const formattedItem = item.name.replace(/_/g, ' ');
                    const itemName = document.createElement('span');

                    itemName.innerHTML = `${formattedItem}`;
                    itemName.style.cursor = 'pointer';
                    itemName.className = 'fileslist';
                    itemName.onclick = () => swap(index, item.name, "single", simowner);

                    

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'X';
                    deleteButton.className = 'del';
                    deleteButton.onclick = () => del(item.name, item);

                    li.appendChild(deleteButton);
                    li.appendChild(itemName);
                    li.style.scrollSnapAlign = 'end';
                    ownerItemList.appendChild(li);
                });

                simownerLi.appendChild(ownerItemList);
                itemList.appendChild(simownerLi);
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
