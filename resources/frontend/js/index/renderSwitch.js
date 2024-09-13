function handleSwitch() {                                           // Init Events about file upload and redirect > case-switch
  const file = fileInput.files[0];
  const selectedOption = document.getElementById('option-select').value;

  showError('');                                                    // Reset error message
 
  if (!file) {                                                      // Check if a file is selected
    showError('Please select a file.');
    return;
  }

  if (!isValidExcelFile(file)) {                                    // Validate the file type against function()
    showError('Invalid file. Please upload an Excel file (.xlsx or .xls).');
    return;
  }

  readExcelFile(file);                                              // Read the file and process it
 
  if (!selectedOption) {                                            // Check selected option
    showError('Please select an option from the dropdown menu.');
    return;
  }

  switch (selectedOption) {                                          // Switch for redirect
    case '0': 
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

function readExcelFile(file) {                                        // Read Excel file
  const reader = new FileReader();
  reader.onload = function (event) {
    const sheetDataArray = processXLSXData(event.target.result);
    if (sheetDataArray) {
      modifyExcelData(sheetDataArray);                                // Create SessionStorage Data  -- function()
    }
  };
  reader.readAsArrayBuffer(file);                                     // Read file as ArrayBuffer
}

const fileInput = document.getElementById('file-input');              // File Upload Grabber -- START
const dropZone = document.getElementById('drop-zone');
const errorMessage = document.getElementById('error-message');
const errorContainer = document.getElementById('dropboxContainer');
const uploadForm = document.getElementById('upload-form');

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
});                                                                     // File Upload Grabber -- END

if(loggerConfig.doDEVMODE){                                             // Create special select-points if devmode === true
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