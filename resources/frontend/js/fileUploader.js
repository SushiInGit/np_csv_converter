const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const errorMessage = document.getElementById('error-message');
const errorContainer = document.getElementById('dropboxContainer');
const uploadForm = document.getElementById('upload-form');


function showError(message) {
  errorMessage.textContent = message;
  errorContainer.classList.add('dropZoneError');
}

// check what the file is
function isValidExcelFile(file) {
  const validExtensions = ['.xlsx', '.xls'];
  const fileExtension = file.name.slice(file.name.lastIndexOf('.'));
  return validExtensions.includes(fileExtension);
}

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', handleFile);

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');
  const files = event.dataTransfer.files;
  if (files.length) {
    fileInput.files = files; 
    handleFile(); 
  }
});

function handleFile() {
  const file = fileInput.files[0];
  const selectedOption = document.getElementById('option-select').value;

  // reset error message
  showError('');
  errorContainer.classList.remove('dropZoneError');

  // check if a file is selected
  if (!file) {
    showError('Please select a file.');
    return;
  }

  // check if its a valid excel-file
  if (!isValidExcelFile(file)) {
    showError('Invalid file. Please upload an Excel file (.xlsx or .xls).');
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // convert excel-sheet to JSON <--- just first need to fix

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
 
      // Save daten to sessionStorage
      sessionStorage.setItem('excelData', JSON.stringify(jsonData));
      
      if (!selectedOption) {
        showError('Please select an option from the dropdown menu.');
        return;
      }

      // Switch for redirect
      switch (selectedOption) {
        case '0':                 // GO-TO: Phonerecords
          window.location.href = 'phone.html';
          break;
        case '1':
          window.location.href = 'index2.html';
          break;
        case '69':
          window.location.href = 'table.html';
          break;
        case '1337':
          window.location.href = '__dev.html';
          break;
        case '42069':
          break;
        default:
          showError('Invalid option.');
      }
    } catch (error) {
      showError('Error reading the file. Please check if the file is valid."');
    }
  };

  // read file ArrayBuffer
  reader.readAsArrayBuffer(file);
}



uploadForm.addEventListener('submit', function (event) {
  event.preventDefault();
  handleFile(); 
});
