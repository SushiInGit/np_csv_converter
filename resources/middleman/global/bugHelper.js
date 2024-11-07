var global = global ?? {};

global.bugHelper = (function () {


    function getBrowserEngine() {
        const userAgent = navigator.userAgent;
        let browser, version;
        if (userAgent.includes("Firefox")) {
            browser = "Firefox";
            version = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
        } else if (userAgent.includes("Edg")) {
            browser = "Edge";
            version = userAgent.match(/Edg\/(\d+\.\d+)/)[1];
        } else if (userAgent.includes("Chrome")) {
            browser = "Chrome";
            version = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
        } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
            browser = "Safari";
            version = userAgent.match(/Version\/(\d+\.\d+)/)[1];
        } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
            browser = "Opera";
            version = userAgent.match(/(Opera|OPR)\/(\d+\.\d+)/)[2];
        } else {
            browser = "Unknown Browser";
            version = "Unknown Version";
        }
        return `${browser} ${version}`;
    }

    const screenResolution = `${window.screen.width}x${window.screen.height}`;

    function getLocalStorageSize() {
        let totalSize = 0;
        for (let item in localStorage) {
            if (localStorage.hasOwnProperty(item)) {
                const itemSize = ((localStorage[item].length + item.length) * 2);
                totalSize += itemSize;
            }
        }
        return (totalSize / (1024 * 1024)).toFixed(2);
    }

    function getSessionStorageSize() {
        let totalSize = 0;
        for (let item in sessionStorage) {
            if (sessionStorage.hasOwnProperty(item)) {
                const itemSize = ((sessionStorage[item].length + item.length) * 2);
                totalSize += itemSize;
            }
        }
        return (totalSize / (1024 * 1024)).toFixed(2);
    }

    function browserInfoOutput() {
        return output = [
            `Browser Engine: ${getBrowserEngine()}`,
            `Screen Resolution: ${screenResolution}`,
            `Local Storage Size: ${getLocalStorageSize()} MB`,
            `Session Storage Size: ${getSessionStorageSize()} MB`
        ].join("\n");
    }

    ////////////////// Discord Part
    function sendToDiscord(formData, browserInfo, toolsite) {
        const webhookUrl = "https://discord.com/api/webhooks/1284930571440750602/mZyS4CHamGlq_AUw1CambBH5s0010rLi_6A37vR5sJoPL3liAQSkM_qDR9HeJ3YGyNHp";
        const payload = {
            embeds: [
                {
                    color: 5763719,
                    title: `${toolsite}`,
                    fields: [
                        {
                            name: "Tags",
                            value: `${formData.tags}`,
                            inline: false
                        },
                        {
                            name: "Titel",
                            value: `${formData.topic}`,
                            inline: false
                        },
                        {
                            name: "User",
                            value: `${formData.discordUser}`,
                            inline: false
                        },
                        {
                            name: "Description",
                            value: `${formData.description}`,
                            inline: false
                        },
                        {
                            name: "Url",
                            value: `${formData.screenshot}`,
                            inline: false
                        },
                        {
                            name: "Browser Information",
                            value: `${browserInfo}`,
                            inline: false
                        }
                    ],
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
                    global.alertsystem('success', `Report has been sent successfully.`, 5);
                    middleman.popupModel.closePopupDiv();
                } else {
                    global.alertsystem('warning', `Error: Report could not be sent. Try again later.`, 5);
                }
            })
            .catch(error => {
                global.alertsystem('warning', `Error: Report could not be sent. Try again later.`, 5);
            });
    }

    ////////////////// Send Form
    function send(source) {
        const tagContainer = document.getElementById('tagContainer');
        let selectedTags = [];

        tagContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('tag')) {
                const tagValue = target.dataset.value;
                if (target.classList.contains('selected')) {
                    target.classList.remove('selected');
                    selectedTags = selectedTags.filter(tag => tag !== tagValue);
                } else {
                    if (selectedTags.length < 2) {
                        target.classList.add('selected');
                        selectedTags.push(tagValue);
                    } else {
                        errorMessage.textContent = "You can select a maximum of 2 tags.";
                        errorMessage.style.display = 'flex';
                    }
                }
            }
        })

        function isValidURL(url) {
            const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
            return pattern.test(url);
        }

        document.getElementById('issueForm').addEventListener('submit', (e) => {
            e.preventDefault(); 
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.style.display = 'none'; 

            if (selectedTags.length === 0) {
                errorMessage.textContent = "Please select at least one tag.";
                errorMessage.style.display = 'flex';
                return;
            }

            const screenshotInput = document.getElementById('screenshot').value;
            if (screenshotInput && !isValidURL(screenshotInput)) {
                errorMessage.textContent = "Please enter a valid URL.";
                errorMessage.style.display = 'flex';
                return;
            }

            const formData = {
                topic: document.getElementById('topic').value,
                tags: selectedTags || null,
                description: document.getElementById('description').value,
                screenshot: screenshotInput || null,
                discordUser: document.getElementById('discordUser').value || null
            };

            //console.log(formData, source);
            global.bugHelper.sendToDiscord(formData, global.bugHelper.output(), source);
        });
    }

    return {
        output: browserInfoOutput,
        sendToDiscord: sendToDiscord,
        send: send
    };
})()