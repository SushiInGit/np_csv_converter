const popupDiv = document.getElementById("popupDiv");
const popupOverlay = document.getElementById("popupOverlay");

document.addEventListener("keydown", function (event) {   // Close Popups
    if (event.key === "Escape") {
        document.getElementById("popupDiv").style.display = "none";
        document.getElementById("popupOverlay").style.display = "none";
        popupDiv.innerHTML = ''; // Clear Event-DIV
    }
});


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
////////////////////////////////////////////////// Capture if Chat-box is empty and trigger Uploader===true
document.addEventListener("DOMContentLoaded", function () {
    var messageBox = document.getElementById("chat-box");
    var conversationList = document.getElementById("conversation-list");
    function containsOnlyCommentsOrEmptyTextNodes(element) {
        var onlyComments = true;

        element.childNodes.forEach(function (node) {
            if (node.nodeType !== Node.COMMENT_NODE &&
                !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === "")) {
                onlyComments = false;
            }
        });
        return onlyComments;
    }

    var chatBoxResult = containsOnlyCommentsOrEmptyTextNodes(messageBox);
    var conversationListResult = containsOnlyCommentsOrEmptyTextNodes(conversationList);

    if (chatBoxResult && conversationListResult) {
        UploadEvent();
        //console.log("('chat-box' & 'conversation-list') is empty");
    }
    /*else if (chatBoxResult) {
        console.log("'chat-box' is empty");
    } else if (conversationListResult) {
        console.log("'conversation-list' is empty");
    } else {
        console.log("('chat-box' & 'conversation-list') have data in it");
    } */
});

function clearPopupDiv() {
    popupDiv.innerHTML = '';
}
////////////////////////////////////////////////// Bug Reporter
function BugReportEvent() {
    clearPopupDiv(); // Clear Event-DIV
    const bugtracker = document.createElement('bugtracker');

    bugtracker.innerHTML = `
            <button class="close" onclick="BugReportEvent()">X</button>
            <h2>Send Bugreport</h2>
            <textarea id="message" rows="4" cols="60" placeholder="Enter your message...."></textarea>
            <br>
            <button class="ok" onclick="sendToDiscord()">Send Bugreport</button>
    `;
    popupDiv.appendChild(bugtracker);

    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
    }
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
                        name: "Bugreport",
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
                clearPopupDiv();  // Clear Event-DIV
                alert('Bugreport message is send!');

            } else {
                clearPopupDiv();  // Clear Event-DIV
                alert('Error: Bugreport cant be send. Try again later.');
            }
        })
        .catch(error => {
            clearPopupDiv();  // Clear Event-DIV
            console.error('Error:', error);
            alert('Error: Bugreport cant be send. Try again later.');
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
    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
    }
    clearPopupDiv(); // Clear Event-DIV
    saveSettings(newSettingsData);


    const chatBox = document.getElementById('chat-box');
    const chatboxIndex = parseInt(getLastOpenConversation(chatBox).Index);
    const chatboxFrom = parseInt(getLastOpenConversation(chatBox).From);
    renderConversations(groupedCommunications, chatboxIndex, chatboxFrom);
}
function setSettingSelectedValue(selectId, value) {
    const selectElement = document.getElementById(selectId);
    selectElement.value = value;
}
function SettingsEvent() {
    popupDiv.innerHTML = ''; // Clear Event-DIV
    const settings = document.createElement('settings');
    

    settings.innerHTML = `
            <button class="close" onclick="SettingsEvent(), clearPopupDiv()">X</button>
            <h2>Settings</h2>
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
            <br>
            <button class="ok" onclick="saveSettingsTrigger(), clearPopupDiv()">Save</button>
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

    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
    }
}

////////////////////////////////////////////////// File uploader
function UploadEvent() {
    clearPopupDiv(); // Clear Event-DIV
    const uploader = document.createElement('upload');

    uploader.innerHTML = `
            <button class="close" onclick="UploadEvent(), clearPopupDiv()">X</button>
        <h2>File upload</h2>
        <form id="upload-form">
        <div class="drop-zone" id="drop-zone">
            Drag & Drop or click to Upload an Excel-File
            <input type="file" id="file-input" accept=".xlsx, .xls" style="display: none;" required>
        </div>
        <div id="error-message" class="error-message"></div>
        </form>

    `;
    popupDiv.appendChild(uploader);

    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
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
        }
    });
    fileInput.addEventListener('change', () => backend.fileProcessor.processFiles(fileInput.files));
}

////////////////////////////////////////////////// Phone contacts uploader
function PhonebookImportEvent() {
    clearPopupDiv(); // Clear Event-DIV
    const phonebook = document.createElement('phonebook');

    phonebook.innerHTML = `
            <button class="close" onclick="PhonebookImportEvent(), clearPopupDiv()">X</button>
            <h2>Import Phone contacts</h2>
            <textarea rows="7" cols="60" placeholder="Paste your Phonedata here....\n\nFormat: \n4200000000 Firstname Lastname\n4200000001 Firstname Lastname\n4200000002 Firstname Lastname"></textarea>
            <br>
            <button class="ok" onclick="backend.phonebookHelper.uploadPhonebookData(document.querySelector('phonebook textarea').value); clearPopupDiv(); window.location.reload();">Integrate Phonedata</button>
    `;
    popupDiv.appendChild(phonebook);

    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
    }
}
////////////////////////////////////////////////// Phone contacts show
function PhonebookShowEvent() {
    clearPopupDiv(); // Clear Event-DIV
    const contacts = document.createElement('contacts');

    contacts.innerHTML = `
            <button class="close" onclick="PhonebookShowEvent(), clearPopupDiv()">X</button>
            <h2>Phone Directory</h2>
            <div class="contacts" id="contacts"></div>
`;
    popupDiv.appendChild(contacts);
    renderPhonebook(backend.dataController.getPhonenumbers());
    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
    }
}
////////////////////////////////////////////////// Phone contacts show
function WIPShowEvent(name) {
    clearPopupDiv(); // Clear Event-DIV
    const wip = document.createElement('wip');

    wip.innerHTML = `
            <button class="close" onclick="WIPShowEvent(''), clearPopupDiv()">X</button>
            <h2><center>Work in Progress </h2><b></center><center>Feature "${name.toUpperCase()}" not found.  </b></center><br>
            <div>This feature is currently a work in progress and will be added at a later time. <br>We apologize for the inconvenience and appreciate your understanding.<br><br></div>
`;
    popupDiv.appendChild(wip);
    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
    }
}
