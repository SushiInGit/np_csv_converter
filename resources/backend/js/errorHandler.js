function showError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.innerText = message;
    if (message) {
        logger.trace(`errorHandler.js: \n\n${message}`);
        errorContainer.classList.add('dropZoneError');
    } else {
        errorContainer.classList.remove('dropZoneError');
    }
}


/// showError();