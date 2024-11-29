var backend = backend ?? {};

backend.fileUploader = (function () {
    const dropinSelector = ".drop-zone";

    /**
    * Initializes the drag-and-drop file uploader with a progress bar.
    * @param {Function} onFileUploaded - Callback executed when valid files are uploaded.
    **/
    function initUploader(onFileUploaded) {
        const dropinContainer = document.querySelector(dropinSelector);

        if (!dropinContainer) {
            console.error(`Container with selector "${dropinSelector}" not found.`);
            return;
        }

        // Create drag-and-drop area dynamically
        const dropArea = document.createElement("div");
        dropArea.className = "drop-area";
        dropArea.innerHTML = `
            <p>Drag & drop a .xlsx file here, or click to upload</p>
            <input type="file" class="file-input" accept=".xlsx" multiple style="display: none;" />
        `;
        
        dropinContainer.appendChild(dropArea);

        const fileInput = dropArea.querySelector(".file-input");

        dropArea.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropArea.classList.add("drag-over");
        });

        dropArea.addEventListener("dragleave", () => {
            dropArea.classList.remove("drag-over");
        });

        dropArea.addEventListener("drop", (event) => {
            event.preventDefault();
            dropArea.classList.remove("drag-over");

            const files = Array.from(event.dataTransfer.files);
            handleFiles(files, onFileUploaded);
        });

        dropArea.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (event) => {
            const files = Array.from(event.target.files);
            handleFiles(files, onFileUploaded);
        });
    }

    /**
    * Processes valid files and parses their content into arrays with a progress bar.
    * @param {File[]} files - The files to process.
    * @param {Function} onFileUploaded - Callback executed with parsed data.
    **/
    async function handleFiles(files, onFileUploaded) {
        const validFiles = files.filter((file) =>
            /\.(xlsx)$/i.test(file.name)
        );

        if (validFiles.length === 0) {
            alert("Only .xlsx files are allowed.");
            return;
        }

        frontend.renderModel.closePopupDiv();

        for (const file of validFiles) {
            let progressBarName = file.name.toLowerCase().replace(".xlsx", "");

            await middleman.progressbar.createProgress(`Reading File: ${progressBarName}`);
            await middleman.progressbar.createProgress(`Normalizing: ${progressBarName}`);
            await middleman.progressbar.updateProgress(`Normalizing: ${progressBarName}`, 0);
            await middleman.progressbar.updateProgress(`Reading File: ${progressBarName}`, 10);

            let parsedData = [];

            if (file.name.endsWith(".xlsx")) {
                await middleman.progressbar.updateProgress(`Reading File: ${progressBarName}`, 30);
                parsedData = await parseXLSX(file);
            }

            await middleman.progressbar.updateProgress(`Reading File: ${progressBarName}`, 100);
            const normalizedData = await normalizeData(file.name, parsedData, progressBarName);

            if(normalizeData) {
                await middleman.progressbar.updateProgress(`Normalizing: ${progressBarName}`, 100);
            }

            if (typeof onFileUploaded === "function") {
                await middleman.progressbar.updateProgress(`Normalizing: ${progressBarName}`, 100);
                setTimeout(() => {
                    onFileUploaded(normalizedData, progressBarName);
                }, 10);
            }
        }
        middleman.progressbar.resetProgress();
    }

    /**
    * Parses an XLSX file into an array of objects.
    * @param {File} file - The XLSX file to parse.
    * @returns {Promise<Object[]>}
    **/
    async function parseXLSX(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                resolve(XLSX.utils.sheet_to_json(sheet));
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    }

    /**
    * Normalizes parsed data using the provided backend helper function.
    * @param {Object[]} data - The parsed data array.
    * @returns {Promise<Object[]>}
    **/
    async function normalizeData(filename, data, progressBarName) {
        await middleman.progressbar.updateProgress(`Normalizing: ${progressBarName}`, 30);
        const normalizedData = backend.bankRecordsHelper.normalizeBankRecords(filename, data);
        await middleman.progressbar.updateProgress(`Normalizing: ${progressBarName}`, 75);
        return normalizedData;
    }

    function lastfilename(filename) {
        return filename;
    }

    return {
        initUploader,
        lastfilename
    };
})();



