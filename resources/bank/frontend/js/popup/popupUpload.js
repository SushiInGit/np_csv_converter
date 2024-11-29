var frontend = frontend ?? {};

frontend.popupUpload = (function () {

    /**
    * Swap to other Databank
    * @param {*} `databank` 
    **/
    function swap(databank) {
        localStorage.setItem('lastBankDB', "BANK_" + databank);
        frontend.renderModel.clear();
        indexedDBHelper.loadLastDB();
        frontend.renderModel.closePopupDiv();
        /* UMAMI */
        try {
            middleman.helperUserinfo.trackSwap("BANK", databank);
        } catch (error) {
            console.error("An error occurred while tracking changes:", error.message);
        }
    }

    /**
    * Remove Databank
    * @param {*} databank 
    **/
    function del(databank) {
        const popupDivName = "confirm-delete";
        const content = `
                <div class="confirmation-content noselect ">
                    <p>Are you sure you want to delete this file? <br><br><b>Filename:</b> <br>${databank}</p>
                </div>
            `;

        const footer = `
                    <button class="risk" onclick="frontend.renderModel.delBank('${databank}')">Delete</button>
            `;
        frontend.renderModel.createPopup(popupDivName, 'Delete Confirmation', content, footer);
    }
    
    /**
    * Render Upload-Popup
    **/
    function UploadEvent() {
        const popupDivName = "upload";
        const content = `
            <form id="upload-form">
                <div class="drop-zone" id="drop-zone"></div>
            </form>
        `;
        const footer = ``;
        frontend.renderModel.createPopup(popupDivName, 'File upload', content, footer);

        setTimeout(() => {
            backend.fileUploader.initUploader()
            let databanks = [];
            let getActiveName = localStorage.getItem('lastBankDB')

            indexedDBHelper.listBankDB().then(names => {
                databanks.push(...names);
                const listContainer = document.querySelector('popup .model .footer');
                listContainer.innerHTML = '';
                listContainer.style.width = 'calc(100% - 20px)';
                listContainer.style.maxWidth = 'calc(100% - 20px)';

                if (databanks.length > 0) {
                    const br = document.createElement('br');
                    const hr = document.createElement('hr');
                    const heading = document.createElement('h2');
                    heading.textContent = `Uploaded File's`;
                    listContainer.appendChild(br);
                    listContainer.appendChild(hr);
                    listContainer.appendChild(heading);
                }

                const uploadList = document.createElement('div');
                uploadList.className = 'uploadList';
                listContainer.appendChild(uploadList);

                databanks.forEach(item => {
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
                    itemNameSpan.onclick = () => swap(item);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'X';
                    deleteButton.className = 'del';
                    deleteButton.onclick = () => del(item);

                    if(getActiveName === ("BANK_" + item)) {
                        itemDiv.id = "active";
                        nameContainer.id  = "active";
                    }

                    delContainer.appendChild(deleteButton);
                    nameContainer.appendChild(itemNameSpan);
                    listEntry.appendChild(delContainer);
                    listEntry.appendChild(nameContainer);
                    itemDiv.appendChild(listEntry);
                    itemDiv.style.scrollSnapAlign = 'end';
                    uploadList.appendChild(itemDiv);
                });
            }).catch(err => {
                console.error('Error fetching bank databases:', err);
            });
        }, 50);
    }


    return {
        render: UploadEvent
    };
})();





