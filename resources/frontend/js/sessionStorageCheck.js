// Check if any sessionStorage:excelData found and calc used data size

const excelData = sessionStorage.getItem('excelData');
var limit = 1024 * 1024 * 5; // 5 MB
var limitMB = 5
var usedMb = sessionStorage.getItem('excelData').length / 1024 / 1024
var remSpace = (limit - sessionStorage.getItem('excelData').length) / 1024 / 1024;

if (!excelData) {
  alert('No Excel file found. Redirecting to upload page.');
  logger.warn('No Excel file found. Redirecting to upload page.');
  window.location.href = 'index.html'; // redirect back to index.html if session data not found
} else {
  const parsedData = JSON.parse(excelData);
  logger.files(`SessionStorage Info`);
  logger.files(`Free: ${remSpace.toFixed(2)} MB | Max: ${limitMB.toFixed(2)} MB || Used: ${usedMb.toFixed(2)} MB`);
  logger.files('Loaded Excel data:', parsedData); // output object into console
}

