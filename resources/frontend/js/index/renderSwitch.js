function handleSwitch() {
  const file = fileInput.files[0];
  const selectedOption = document.getElementById('option-select').value;

  // Reset error message
  showError('');

  // Check if a file is selected
  if (!file) {
    showError('Please select a file.');
    return;
  }

  // Validate the file type
  if (!isValidExcelFile(file)) {
    showError('Invalid file. Please upload an Excel file (.xlsx or .xls).');
    return;
  }

  // Read the file and process it
  readExcelFile(file);

  // Check selected option
  if (!selectedOption) {
    showError('Please select an option from the dropdown menu.');
    return;
  }

  // Switch for redirect
  switch (selectedOption) {
    case '0': // GO-TO: Phonerecords
      window.location.href = 'phone.html';
      break;
    case '1337':
      window.location.href = 'consoledump.html';
      break;
    case '42069':
      break;
    default:
      showError('Invalid option.');
  }
}

function readExcelFile(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const sheetDataArray = processXLSXData(event.target.result);
    if (sheetDataArray) {
      storeDataInSessionStorage(sheetDataArray);
    }
  };

  // Read file as ArrayBuffer
  reader.readAsArrayBuffer(file);
}



const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const errorMessage = document.getElementById('error-message');
const errorContainer = document.getElementById('dropboxContainer');
const uploadForm = document.getElementById('upload-form');



// check what the file is
function isValidExcelFile(file) {
  const validExtensions = ['.xlsx', '.xls'];
  const fileExtension = file.name.slice(file.name.lastIndexOf('.'));
  return validExtensions.includes(fileExtension);
}

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', handleSwitch);

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
    handleSwitch();
  }
});
uploadForm.addEventListener('submit', function (event) {
  event.preventDefault();
  handleSwitch();
});


if(loggerConfig.doDEVMODE){
  const selectPicker = document.getElementById('option-select');
  const addOption2 = document.createElement("option");
  const addOption3 = document.createElement("option");
  addOption2.value = "1337";
  addOption2.text = "DEV MODE  [Render all sessionStorage Tables on a Page]";
  addOption3.value = "42069";
  addOption3.text = "Breakpoint /---/ no redirect";
  selectPicker.add(addOption2, null);
  selectPicker.add(addOption3, null);
}