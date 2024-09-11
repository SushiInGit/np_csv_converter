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

      // Save daten to sessionStorage
      const sheetNames = workbook.SheetNames;
      for (let i = 0; i < sheetNames.length; i++) {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[i]]);
        // Phoneboook Stuff need to filter between other stuff 
        const normalizedData = normalizeTexts(sheetData);

        const storageKey = `excelSheet${i + 1}`;
        //sessionStorage.removeItem(storageKey);
        sessionStorage.setItem(storageKey, JSON.stringify(normalizedData));
        const storedData = JSON.parse(sessionStorage.getItem(storageKey));
        logger.log(`SessionStorage: (${sheetNames[i]}):`, storedData);
      }



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
      showError('Error reading the file. Please check if the file is valid.');
      logger.warn(error);
    }
  };

  // read file ArrayBuffer
  reader.readAsArrayBuffer(file);
}



uploadForm.addEventListener('submit', function (event) {
  event.preventDefault();
  handleFile();
});



function normalizeTexts(worksheet) {

  var messageRecordsArray = [];

  var defaultMessageRecordLine = {
    number_from: 0, // 0
    number_to: 0, // 1
    message: "", // 2
    timestamp: "" // 3
  }

  try {

    var columnTracker = 0;
    var messageRecordLine = { ...defaultMessageRecordLine };

    worksheet.eachRow(function (row, rowNumber) {

      if (rowNumber > 1) {

        row.values.forEach(function (value, index) {

          if (columnTracker == 0) {
            messageRecordLine.number_from = value;
            columnTracker++;
          }
          else if (columnTracker == 1) {
            messageRecordLine.number_to = value;
            columnTracker++;
          }
          else if (columnTracker >= 2) {
            if (!isValidISODate(value)) {
              if (typeof value === 'object' && value !== null) {
                value = value.text;
              }

              if (messageRecordLine.message === "") {
                messageRecordLine.message += `${value}`;
              }
              else {
                messageRecordLine.message += `<br/>${value}`;
              }
            }
            else {
              messageRecordLine.timestamp = new Date(value).toISOString();
              messageRecordLine.message = messageRecordLine.message.trim();
              messageRecordsArray.push(messageRecordLine);
              messageRecordLine = { ...defaultMessageRecordLine };
              columnTracker = 0;
            }
          }

        });

      }

    });

  } catch (e) {
    alert("Something broke, message a dev. \n\n Function: normalizeTexts(worksheet) \n" + e)
  }

  return messageRecordsArray;
}

function normalizeTexts(dataArray) {

  var messageRecordsArray = [];

  var defaultMessageRecordLine = {
    number_from: 0, // 0
    number_to: 0, // 1
    message: "", // 2
    timestamp: "" // 3
  }

  try {

    dataArray.forEach(function (row, rowNumber) {
      if (rowNumber > 0) { // Skipping header row

        var messageRecordLine = { ...defaultMessageRecordLine };
        var columnTracker = 0;

        Object.values(row).forEach(function (value, index) {
          if (columnTracker == 0) {
            messageRecordLine.number_from = value;
            columnTracker++;
          }
          else if (columnTracker == 1) {
            messageRecordLine.number_to = value;
            columnTracker++;
          }
          else if (columnTracker >= 2) {
            if (!isValidISODate(value)) {
              if (typeof value === 'object' && value !== null) {
                value = value.text;
              }

              if (messageRecordLine.message === "") {
                messageRecordLine.message += `${value}`;
              }
              else {
                messageRecordLine.message += `<br/>${value}`;
              }
            }
            else {
              messageRecordLine.timestamp = new Date(value).toISOString();
              messageRecordLine.message = messageRecordLine.message.trim();
              messageRecordsArray.push(messageRecordLine);
              messageRecordLine = { ...defaultMessageRecordLine };
              columnTracker = 0;
            }
          }
        });
      }
    });

  } catch (e) {
    alert("Something broke, message a dev. \n\n Function: normalizeTexts(worksheet) \n" + e)
  }

  return messageRecordsArray;
}
function isValidISODate(dateString) {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
  return isoDateRegex.test(dateString);
}
