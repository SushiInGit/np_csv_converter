document.addEventListener('DOMContentLoaded', () => {
   
    const fileUploadBtn = document.getElementById('fileUploadPopup');
    const fileUploadModal = document.getElementById('fileUploadModal');
    const closeFileUpload = document.getElementById('closeFileUpload');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');


    fileUploadBtn.addEventListener('click', () => {
        fileUploadModal.style.display = 'flex';
    });

    closeFileUpload.addEventListener('click', () => {
        fileUploadModal.style.display = 'none';
    });

    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#505050';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = '#404040';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#404040';
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    });

    fileInput.addEventListener('change', () => {
        handleFileUpload(fileInput.files);
    });

    function handleFileUpload(files) {
        const file = files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            alert(`Excel-File "${file.name}" uploaded.`);
            console.log(file);
        } else {
            alert('Please upload a Excel-File.');
        }
    }

    document.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    alert(`Excel-File "${file.name}" uploaded from clipboard.`);
                }
            }
        }
    });
});


