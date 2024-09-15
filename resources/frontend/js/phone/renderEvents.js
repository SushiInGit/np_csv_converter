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

function BugReport() {
    popupDiv.innerHTML = ''; // Clear Event-DIV
    const bugtracker = document.createElement('bugtracker');

    bugtracker.innerHTML = `
            <button class="close" onclick="BugReport()">X</button>
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
    const webhookUrl = "https://discord.com/api/webhooks/1284815742348431390/YdX3tZLW7uGzCnvpcnqGFeUhXJGxqtbc_vpQzqfA0MJuSDBy7_kpMD0gAFu54JpEs4T2"; 

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

    BugReport();
    
}


function Settings() {
    popupDiv.innerHTML = ''; // Clear Event-DIV
    const settings = document.createElement('settings');

    settings.innerHTML = `
            <button class="close" onclick="Settings()">X</button>
            <h2>Settings</h2>


    `;
    popupDiv.appendChild(settings);
    if (popupDiv.style.display === "none") {
        popupDiv.style.display = "block";
        popupOverlay.style.display = "block";
    } else {
        popupDiv.style.display = "none";
        popupOverlay.style.display = "none";
    }
}