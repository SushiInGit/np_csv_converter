
// Funktion, die den Link anklickbar macht und Bildervorschau hinzufügt
function makeLinksClickable() {
    const messages = document.querySelectorAll('.message');

    messages.forEach(message => {

        var messageText = message.querySelector(".text");
        if (!!messageText && !messageText.querySelector('a')) {
            // If message is not empty and does not contain a link

            if (messageText.textContent.trim().startsWith('http')) {
                // Convert message to link
                var url = messageText.textContent.trim();

                const anchorTag = document.createElement('a');
                anchorTag.href = url;
                anchorTag.textContent = url;
                anchorTag.target = '_blank';

                // Ersetze den Text durch den Link
                messageText.textContent = '';
                messageText.appendChild(anchorTag);

                // Wenn der Link auf ein Bild verweist (mit oder ohne Parameter), füge Mouseover-Ereignisse hinzu
                if (/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/.test(url)) {
                    anchorTag.addEventListener("mouseover", function (event) {
                        showImagePreview(event, url);
                    });
                    anchorTag.addEventListener("mousemove", function (event) {
                        moveImagePreview(event);
                    });
                    anchorTag.addEventListener("mouseout", function () {
                        hideImagePreview();
                        hideErrorMessage(); // Fehlermeldung verstecken
                    });
                }
            }
        }
    });
}

// Bildvorschau anzeigen
function showImagePreview(event, link) {
    const preview = document.getElementById('imagePreview');
    preview.src = link;
    preview.style.display = 'block';
    moveImagePreview(event); // Stelle sicher, dass das Bild sofort korrekt positioniert ist

    // Falls das Bild nicht geladen werden kann, zeige die Fehlermeldung an
    preview.onerror = function () {
        preview.style.display = 'none'; // Bildvorschau verstecken
        showErrorMessage(event); // Fehlermeldung anzeigen
    }
}

// Bildvorschau und Fehlermeldung bewegen
function moveImagePreview(event) {

    const preview = document.getElementById('imagePreview');
    preview.style.top = `${event.pageY + 15}px`;
    preview.style.left = `${event.pageX + 15}px`;

    // Fehlernachricht mit der Maus bewegen
    const error = document.getElementById('errorMessagePIC');
    error.style.top = `${event.pageY + 15}px`;
    error.style.left = `${event.pageX + 15}px`;
}

// Bildvorschau verstecken
function hideImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.style.display = 'none';
}

// Fehlermeldung anzeigen
function showErrorMessage(event) {
    const error = document.getElementById('errorMessagePIC');
    error.style.display = 'block';
    error.style.top = `${event.pageY + 15}px`; // 15px Offset zur Maus
    error.style.left = `${event.pageX + 15}px`;
}

// Fehlermeldung verstecken
function hideErrorMessage() {
    const error = document.getElementById('errorMessagePIC');
    error.style.display = 'none';
}

// MutationObserver für dynamische Änderungen
const observer = new MutationObserver(makeLinksClickable);
observer.observe(document.body, { childList: true, subtree: true });

// Initiale Links anklickbar machen
makeLinksClickable();