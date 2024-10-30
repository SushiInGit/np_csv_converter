var global = global ?? {};

global.fileupload = (function () {

    const popupDiv = document.getElementById("popup");
    const loader = document.querySelector('.loader');


    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            middleman.popupModel.closePopupDiv();
            middleman.popupModel.deactivateLoader();
        }
    });

    function validateFileName(fileName, errorMessage) {
        const validPattern = /^[a-zA-Z0-9.\s-]+$/; 
        
        if (fileName === "") {
            errorMessage.innerHTML = 'Filename cannot be empty.';
            errorMessage.style.display = 'flex';
            return false; 
        } else if (!validPattern.test(fileName)) {
            errorMessage.innerHTML = `
            Filename can only contain: 
            <ul class="errorList">
                <li>letters</li> 
                <li>digits</li> 
                <li>spaces</li>
                <li>periods</li>
            </ul>`;
            errorMessage.style.display = 'flex';
            return false; 
        }
        errorMessage.style.display = 'none';
        return true; 
    }

    function fileUploadPrompt(filename) {
        return new Promise((resolve) => {
            middleman.popupHelp.closeHelp();
            popupDiv.innerHTML = ``;
            const popupDivBody = document.createElement(`upload`);
            const fileName = filename.replace(/\.xlsx$/, '');
            popupDivBody.innerHTML = `
            <div class="model">
                <div class="head">
                    <button class="close" onclick="middleman.popupModel.closePopupDiv(), middleman.popupModel.deactivateLoader()">X</button>
                    <h2>File upload</h2>
                </div>
                <div class="element">
                    <div class="popup">Enter a name for the file: <br>
                    <input id="input" type="text" value="${fileName || ''}"  autocomplete="off" spellcheck="false">
                    <div id="errorMessage" class="error-message">Filename cannot be empty.</div>
                </div>
                <div class="footer">
                    <button id="upload" class="ok">Upload</button>
                </div>
            </div>   
            `;
            popupDiv.appendChild(popupDivBody);

            setTimeout(() => {
                const errorMessage = document.getElementById("errorMessage");
                const input = document.getElementById("input");
                const button = document.getElementById("upload");

                input.addEventListener('input', () => {
                    const fileName = input.value.trim();
                    validateFileName(fileName, errorMessage);
                });

                button.addEventListener('click', () => {                
                    const fileName = input.value.trim();
                    
                    if (validateFileName(fileName, errorMessage)) {
                        middleman.popupModel.closePopupDiv();
                        resolve(fileName);
                    }
                });
            }, 50);
        });
    }



    return {
        fileUploadPrompt
    };
})();

