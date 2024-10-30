var frontend = frontend ?? {};

frontend.popupBug = (function () {
    function bugEvent() {

        const popupDivName = "bug";
        const content = `
        <p><small>Found a bug? Report it here! <br>If you'd like to provide more details, feel free to join our Discord server using the link at the bottom of the page.</small></p>
            <textarea id="message" rows="10" cols="48" placeholder="Enter your message...."></textarea>
        `;
        const footer = `<button class="ok" onclick="frontend.popupBug.sendToDiscord()">Send Bugreport</button>`;

        middleman.popupModel.createPopup(popupDivName, 'Bug Report', content, footer);

    }

    function sendToDiscord() {
        const message = document.getElementById("message").value;
        const browserInfo = middleman.popupModel.getBrowserInfo();
        frontend.popupBug.sendDiscordMessage(message, browserInfo);
    }

    function sendDiscordMessage(message, browserInfo) {
        const webhookUrl = "https://discord.com/api/webhooks/1284930571440750602/mZyS4CHamGlq_AUw1CambBH5s0010rLi_6A37vR5sJoPL3liAQSkM_qDR9HeJ3YGyNHp";
        const payload = {
            embeds: [
                {
                    color: 5763719,
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
                    middleman.popupModel.closePopupDiv();
                    global.alertsystem('success', 'Bug report has been sent.', 4);
    
                } else {
                    middleman.popupModel.closePopupDiv();
                    global.alertsystem('warning', 'Error: Bugreport cant be send. Try again later.', 7);
                }
            })
            .catch(error => {
                middleman.popupModel.closePopupDiv();
                global.alertsystem('warning', 'Error: Bugreport cant be send. Try again later.', 7);
            });
    

    }
    return {
        sendToDiscord: sendToDiscord,
        sendDiscordMessage: sendDiscordMessage,
        render: bugEvent
    };


})();
