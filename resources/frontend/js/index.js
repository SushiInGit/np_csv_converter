
window.addEventListener('load', function () {
    const fileInput = document.querySelector('#file-input');
    const dropZone = document.querySelector('#drop-zone');
    const errorMessage = document.querySelector('#error-message');
    const errorContainer = document.querySelector('#dropboxContainer');
    const uploadForm = document.querySelector('#upload-form');

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
        }
    });

    fileInput.addEventListener('change', () => backend.fileProcessor.processFiles(fileInput.files));
});
