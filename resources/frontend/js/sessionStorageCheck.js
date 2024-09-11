

// Check if any sessionStorage:excelData found and calc used data size
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  const value = sessionStorage.getItem(key);
  logger.files(`SessionStorage: ${key}`, JSON.parse(value));
  if (!key) {
    alert('No Excel file found. Redirecting to upload page.');
    logger.warn('No Excel file found. Redirecting to upload page.');
    window.location.href = 'index.html'; // redirect back to index.html if session data not found
  }
}

