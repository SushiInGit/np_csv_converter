var frontend = frontend ?? {};

frontend.popupRender = (function () {

    function UploadEvent() {

        function del(index, item) {
            console.log(index, item);
            const popupDivName = "confirm-delete";
        
            const content = `
                <div class="confirmation-content">
                    <p>Are you sure you want to delete: <br><b>${item.name.replace(/_/g, ' ')}</b>?</p>
                </div>
            `;
        
            const footer = `
                    <button class="confirmDelete" onclick="middleman.popupModel.delItem('${item.name}')" >Yes</button>
                    <button class="cancelDelete" onclick=" closePopupDiv(), deactivateLoader()">No</button>
            `;

            middleman.popupModel.createPopup(popupDivName, 'Delete Confirmation', content, footer);
        }      

        function swap(index, item) {
            //console.log(`Swap --> ${index} / ${item}`);
            backend.storageShow.saveLastSearchRecord(item.name, true);
            window.location.href = 'phone.html'
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

            const itemList = document.createElement('ul');
            listContainer.appendChild(itemList);

            for (const [simowner, items] of Object.entries(groupedItems)) {
                const simownerLi = document.createElement('li');
                const simownerName = document.createElement('span');
                simownerName.innerHTML = `${middleman.findNames(simowner)} - ${String(simowner).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")} `;
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

                items.forEach((item, index) => {
                    const li = document.createElement('li');
                    const formattedItem = item.name.replace(/_/g, ' ');
                    const itemName = document.createElement('span');

                    itemName.innerHTML = `${formattedItem}`;
                    itemName.style.cursor = 'pointer';
                    itemName.onclick = () => swap(index, item.name);

                    li.appendChild(itemName);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'X';
                    deleteButton.onclick = () => del(item.name, item);

                    li.appendChild(deleteButton);
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
        UploadEvent: UploadEvent
    };
})();
