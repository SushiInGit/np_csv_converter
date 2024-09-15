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

function BugReportEvent() {
    popupDiv.innerHTML = ''; // Clear Event-DIV
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
                popupDiv.innerHTML = '';  // Clear Event-DIV
                alert('Bugreport message is send!');

            } else {
                popupDiv.innerHTML = '';  // Clear Event-DIV
                alert('Error: Bugreport cant be send. Try again later.');
            }
        })
        .catch(error => {
            popupDiv.innerHTML = '';  // Clear Event-DIV
            console.error('Error:', error);
            alert('Error: Bugreport cant be send. Try again later.');
        });

    BugReportEvent();
}


function SettingsEvent() {
    popupDiv.innerHTML = ''; // Clear Event-DIV
    const settings = document.createElement('settings');

    settings.innerHTML = `
            <button class="close" onclick="SettingsEvent()">X</button>
            <h2>Settings</h2>
            <div id="timezoneDiv">
                <label for="timezone">Timezone:</label>
                <select id="timezone">
                    <option value="gmt">GMT</option>
                    <option value="utc">UTC</option>
                    <option value="psts">America/Los_Angeles (PST/PDT)</option>
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
                </select>
            </div>
            <div id="use12hClockDiv">
                <label for="use12hClock">12h clock</label>
                <input type="checkbox" id="use12hClock" />
            </div>
            <div id="timeFirstDiv">
                <label for="timeFirst">Time first</label>
                <input type="checkbox" id="timeFirst" />
            </div>
            <br>
            <button class="ok" onclick="">Save</button>

    `;
    popupDiv.appendChild(settings);

    // Get Setting information from sessionStorage
    const timezoneSelect = document.getElementById('timezone');
    const dateformatSelect = document.getElementById('dateformat');
    const use12hClockSelect = document.getElementById('use12hClock');
    const timeFirstSelect = document.getElementById('timeFirst');
    const showUTCSelect = document.getElementById('showUTC');
    loadSettings();





    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
    }





}


function UploadEvent() {
    popupDiv.innerHTML = ''; // Clear Event-DIV
    const uploader = document.createElement('upload');

    uploader.innerHTML = `
            <button class="close" onclick="UploadEvent()">X</button>
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



