var frontend = frontend ?? {};

const popupDiv = document.getElementById("popup");
const errorDiv = document.getElementById("error");
const loader = document.querySelector('.loader');

function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    const browserInfo = `
        User Agent: ${userAgent}
        Plattform: ${navigator.platform}
        App Name: ${navigator.appName}
        App Version: ${navigator.appVersion}
    `;
    return browserInfo;
}
////////////////////////////////////////

if (!localStorage.bankRecords || localStorage.bankRecords === '[]' || localStorage.bankRecords === '') {
    console.error("localStorage.bankRecords.Empty");
    UploadEvent();
}

////////////////////////////////////////



document.addEventListener("keydown", function (event) {   // Close Popups
    if (event.key === "Escape") {
        errorDiv.classList.remove("show");
        errorDiv.classList.add("hide");
        closePopupDiv();
    }
});
function showPopup() {
    popupDiv.classList.remove("hide");
    popupDiv.classList.add("show");
    loader.classList.add("active"); 
    loader.classList.remove("inactive");
}

function clearPopupDiv() {
    popupDiv.innerHTML = '';
    popupDiv.classList.remove("show");
    popupDiv.classList.add("hide");
}

function closePopupDiv() {
    popupDiv.innerHTML = '';
    loader.classList.remove("active"); 
    loader.classList.add("inactive");
    popupDiv.classList.add("hide");
    popupDiv.classList.remove("show");
    popupDiv.classList.remove("upload");
    popupDiv.classList.remove("bug");
    popupDiv.classList.remove("settings");
}

function UploadEvent() {
    popupDiv.classList.add("upload");
    clearPopupDiv(); // Clear Event-DIV
    showPopup();
    loader.classList.add("active");
    popupDiv.innerHTML = `
    <div class="head">
    <button class="close" onclick="UploadEvent(), closePopupDiv(), deactivateLoader()">X</button>
    <h2>File upload</h2>
    </div>
    <div class="element">
        <form id="upload-form">
            <div class="drop-zone" id="drop-zone">
                Drag & Drop or click to Upload an Excel-File
                <input type="file" id="file-input" accept=".xlsx, .xls" style="display: none;" required>
            </div>
        <div id="error-message" class="error-message"></div>
        </form>
    </div>
    `;
    const excelMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // .xlsx
        'application/vnd.ms-excel'                                            // .xls
    ];
    function isExcelFile(file) {
        return excelMimeTypes.includes(file.type);
    }
    const fileInput = document.querySelector('#file-input');
    const dropZone = document.querySelector('#drop-zone');

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
            if (!isExcelFile(type)) {
                //alert('Error: Unsupported file type. Please upload an Excel file.');
                frontend.showalert('warning','Warning: Unsupported file type. Please upload an Excel file.', 7);
                return;  
            }
        }
    });
    fileInput.addEventListener('change', () => backend.fileProcessor.processFiles(fileInput.files));
}

////////////////////////////////////////////////// Bug Reporter
function BugReportEvent() {
    clearPopupDiv(); // Clear Event-DIV
    const bugtracker = document.createElement('bugtracker');
    popupDiv.classList.add("bug");
    showPopup();
    loader.classList.add("active");
    bugtracker.innerHTML = `
            <div class="head">
            <button class="close" onclick="UploadEvent(), closePopupDiv(), deactivateLoader()">X</button>
            <h2>Send Bugreport</h2>
            </div>
            <div class="element">
            <textarea id="message" rows="10" cols="48" placeholder="Enter your message...."></textarea>
            <br>
            <button class="ok" onclick="sendToDiscord()">Send Bugreport</button>
            </div>
    `;
    popupDiv.appendChild(bugtracker);

}

function sendToDiscord() {
    const message = document.getElementById("message").value;
    const browserInfo = getBrowserInfo();
    sendDiscordMessage(message, browserInfo);
}


function sendDiscordMessage(message, browserInfo) {
    const webhookUrl = "https://discord.com/api/webhooks/1284930571440750602/mZyS4CHamGlq_AUw1CambBH5s0010rLi_6A37vR5sJoPL3liAQSkM_qDR9HeJ3YGyNHp";
    const payload = {
        embeds: [
            {
                color: 5763719, // bluecolor
                fields: [
                    {
                        name: "Bugreport - Bank",
                        value: `\`\`\`${message}\`\`\``,
                        inline: false
                    },
                    {
                        name: "Browser Information",
                        value: `\`\`\`${browserInfo}\`\`\``,
                        inline: false
                    }
                ],
                footer: {
                    text: "Send from GitHub host."
                },
                timestamp: new Date().toISOString()
            }
        ]
    };
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (response.ok) {
                closePopupDiv();  // Clear Event-DIV
                //alert('Bugreport message is send!')
                frontend.showalert('success','Bugreport message is send.', 4);

            } else {
                closePopupDiv();  // Clear Event-DIV
                frontend.showalert('warning','Error: Bugreport cant be send. Try again later.', 7);
               // alert('Error: Bugreport cant be send. Try again later.');
            }
        })
        .catch(error => {
            closePopupDiv();  // Clear Event-DIV
            frontend.showalert('warning','Error: Bugreport cant be send. Try again later.', 7);
        });

    BugReportEvent();
}


////////////////////////////////////////////////// Settings changer
// Save Settings to Storage
function saveSettingsTrigger() {
    const newSettingsData = {
        timeZone: timezone.value,
        dateFormat: dateformat.value,
        timeFormat: use12hClock.value,
        offsetShow: showoffset.value,
        displayOrder: timeFirst.value 
    };

    clearPopupDiv(); // Clear Event-DIV
    saveSettings(newSettingsData);
    window.location.reload();

}
function setSettingSelectedValue(selectId, value) {
    const selectElement = document.getElementById(selectId);
    selectElement.value = value;
}
function SettingsEvent() {
    clearPopupDiv(); // Clear Event-DIV
    popupDiv.classList.add("settings");
    showPopup();
    loader.classList.add("active");
    const settings = document.createElement('settings');
    

    settings.innerHTML = `
               <div class="head">
    <button class="close" onclick="UploadEvent(), closePopupDiv(), deactivateLoader()">X</button>
    <h2>Settings</h2>
    </div>
    <div class="element">
            <div id="timezoneDiv">
                <label for="timezone">Timezone:</label>
                <select id="timezone">
                    <option value="utc">Coordinated Universal Time (UTC)</option>
                    <option value="gmt">Greenwich Mean Time (GMT)</option>
                    <option value="est">Eastern Standard Time (EST)</option>
                    <option value="pt">Pacific Time (PT)</option>
                    <option value="ast">Arabia Standard Time (AST)</option>
                    <option value="jst">Japan Standard Time (JST)</option>
                    <option value="cst">China Standart Time (CST)</option>
                    <option value="ist">Indian Standard Time (IST)</option>
                    <option value="pst">America/Los_Angeles (PST/PDT)</option>
                    <option value="edt">America/New_York (EDT)</option>
                    <option value="aest">Australia/Sydney (AEST/AEDT)</option>
                    <option value="cest">Europe/Berlin (CEST)</option>
                    <option value="bst">Europe/London (BST)</option>
                </select>
            </div>
            <div id="dateformatDiv">
                <label for="dateformat">Dateformat:</label>
                <select id="dateformat">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MMMM DD, YYYY">MMMM DD, YYYY</option>
                    <option value="DD MMMM YYYY">DD MMMM YYYY</option>
                    
                </select>
            </div>
            <div id="use12hClockDiv">
                <label for="use12hClock">12h or 24h clock:</label>
                <select id="use12hClock">
                    <option value="12Hour">12Hour</option>
                    <option value="24Hour">24Hour</option>
                </select>
            </div>
            <div id="offsetDiv" style="display: none">
                <label for="showoffset">Use Time Offset (${processTimestamp(Date.now()).offsettimeZoneHours}):</label>
                <select id="showoffset">
                    <option value="on">Yes</option>
                    <option value="off">No</option>
                </select>
            </div>  
                <div id="timeFirstDiv" style="display: none">
                    <label for="timeFirst">Date/Time order</label>
                    <select id="timeFirst">
                        <option value="dateAndTime">Date then Time</option>
                        <option value="timeAndDate">Time then Date</option>
                    </select>
                </div>          
            <button class="ok" onclick="saveSettingsTrigger(), clearPopupDiv()">Save</button>
            </div>
    `;

    popupDiv.appendChild(settings);

    // Get Setting information from sessionStorage
    const timezone = document.getElementById('timezone').value;
    const dateformat = (document.getElementById('dateformat').value);
    const use12hClock = document.getElementById('use12hClock').value;
    const showoffset = document.getElementById('showoffset').value;
    const timeFirst = document.getElementById('timeFirst').value;

    setSettingSelectedValue('timezone', `${(loadSettings().timeZone)}`);
    setSettingSelectedValue('dateformat', `${(loadSettings().dateFormat)}`);
    setSettingSelectedValue('use12hClock', `${(loadSettings().timeFormat)}`);
    setSettingSelectedValue('showoffset', `${(loadSettings().offsetShow)}`);
    setSettingSelectedValue('timeFirst', `${(loadSettings().displayOrder)}`);

}
