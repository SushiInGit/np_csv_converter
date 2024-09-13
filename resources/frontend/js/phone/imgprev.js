
// Funktion, die den Link anklickbar macht und Bildervorschau hinzufügt
function makeLinksClickable() {
    const messages = document.querySelectorAll('.message');
  
    messages.forEach(message => {
      const linkDiv = message.querySelector('div:nth-child(2)');
      if (linkDiv && !linkDiv.querySelector('a')) {
        const url = linkDiv.textContent.trim();
        if (url.startsWith('http')) {
          const anchorTag = document.createElement('a');
          anchorTag.href = url;
          anchorTag.textContent = url;
          anchorTag.target = '_blank';
  
          // Ersetze den Text durch den Link
          linkDiv.textContent = '';
          linkDiv.appendChild(anchorTag);
  
          // Wenn der Link auf ein Bild verweist (mit oder ohne Parameter), füge Mouseover-Ereignisse hinzu
          if (/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/.test(url)) {
            anchorTag.addEventListener("mouseover", function(event) {
              showImagePreview(event, url);
            });
            anchorTag.addEventListener("mousemove", function(event) {
              moveImagePreview(event);
            });
            anchorTag.addEventListener("mouseout", function() {
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
    preview.onerror = function() {
      preview.style.display = 'none'; // Bildvorschau verstecken
      showErrorMessage(event); // Fehlermeldung anzeigen
    }
  }
  
  // Bildvorschau und Fehlermeldung bewegen
  function moveImagePreview(event) {
    const preview = document.getElementById('imagePreview');
    preview.style.top = `${event.pageY + 15}px`; // 15px Offset zur Maus
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