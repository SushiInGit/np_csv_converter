

document.addEventListener('DOMContentLoaded', function () {
    const chatBox = document.getElementById('chat-box');




    const messages = [
        { number_from: 4209479995, number_to: 4200843991, message: 'Dont give up on me future ex wifey. been busy. hope your doing well', timestamp: '2024-08-02T04:51:30.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: "aww HELLO I've been very busy too", timestamp: '2024-08-02T04:51:46.000Z' },
        { number_from: 420084399333, number_to: 4209479995, message: "aww HELLO I've been very busy too", timestamp: '2024-08-02T04:51:46.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: 'Hi Test', timestamp: '2024-08-02T07:14:07.000Z' }
    ];
    // Assuming your messages look like this
    const messageData = [
        { number_from: 4209479995, number_to: 4200843991, message: 'Dont give up on me future ex wifey. been busy.', timestamp: '2024-08-02T04:51:30.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: "aww HELLO I've been very busy too", timestamp: '2024-08-02T04:51:46.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: 'how have you been?', timestamp: '2024-08-02T07:14:07.000Z' },
        { number_from: 4209479995, number_to: 4200843991, message: 'Dont give up on me future ex wifey. been busy.', timestamp: '2024-08-02T04:51:30.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: "aww HELLO I've been very busy too", timestamp: '2024-08-02T04:51:46.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: 'how have you been?', timestamp: '2024-08-02T07:14:07.000Z' },

        { number_from: 4209479995, number_to: 4200843991, message: 'Dont give up on me future ex wifey. been busy.', timestamp: '2024-08-02T14:51:30.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: "aww HELLO I've been very busy too", timestamp: '2024-08-02T04:51:46.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: 'how have you been?', timestamp: '2024-08-02T07:14:07.000Z' },
        { number_from: 4209479995, number_to: 4200843991, message: 'Dont give up on me future ex wifey. been busy.', timestamp: '2024-08-02T14:51:30.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: "aww HELLO I've been very busy too", timestamp: '2024-08-02T04:51:46.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: 'how have you been?', timestamp: '2024-08-02T07:14:07.000Z' },
        { number_from: 4209479995, number_to: 4200843991, message: 'Dont give up on me future ex wifey. been busy.', timestamp: '2024-08-02T14:51:30.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: "aww HELLO I've been very busy too", timestamp: '2024-08-02T04:51:46.000Z' },
        { number_from: 4200843991, number_to: 4209479995, message: 'how have you been?', timestamp: '2024-03-12T23:54:07.000Z' },
        // Add more data
    ];


    // Clear the div content and display the charts
    chatBox.innerHTML = '';
    createSimpleCount(rawData);
    // createHeatmap(groupMessagesForGrid(messageData));    // WIP maybe 
    //createPieChart(resultsNormalizedMessages);




    // Function to parse and group messages by hour   ---- regex [0-2]\d:[0-5]\d:[0-5]\d     ==  time
    function groupMessagesForGrid(messages) {
        const pad = num => ("0" + num).slice(-2); // or use padStart

        const getTimeFromDate = timestamp => {
            const date = new Date(timestamp * 1000);
            let hours = date.getHours(),
                minutes = date.getMinutes(),
                seconds = date.getSeconds();
            return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds)
        }
        const gridMap = new Array(100).fill(0);
        const timestamps = messages.map(msg => getTimeFromDate((new Date(msg.timestamp).getTime())));
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);

        const timeRange = maxTime - minTime;
        const binSize = timeRange / 100;

        messages.forEach((msg) => {
            const msgTime = new Date(msg.timestamp).getTime();
            const binIndex = Math.floor((msgTime - minTime) / binSize);

            if (binIndex >= 0 && binIndex < 100) {
                gridMap[binIndex]++;
            }
        });

        return gridMap;
    }




    function createPieChart(messages) {
        const messageGroups = {};

        // Group messages based on number_from -> number_to, and exclude "[-=-=-=-!!CALL!!-=-=-=-]"
        messages.forEach(msg => {
            const key = `${msg.filtered_number_to}`;
            if (!messageGroups[key]) {
                messageGroups[key] = { textCount: 0, callCount: 0, overallCount: 0 };
            }
            if (msg.message === '[-=-=-=-!!CALL!!-=-=-=-]') {
                messageGroups[key].callCount++;
                messageGroups[key].overallCount++;
            } else {
                messageGroups[key].textCount++;
                messageGroups[key].overallCount++;
            }
        });

        const alllabel = [];
        const labelsoverallCount = [];
        const labelstextCount = [];
        const labelscallCount = [];
        const dataoverallCount = [];
        const datatextCount = [];
        const datacallCount = [];


        Object.keys(messageGroups).forEach(key => {
            const group = messageGroups[key];
            if (group.overallCount > 0) {
                labelsoverallCount.push(`Overall with ${key}`);
                dataoverallCount.push(group.overallCount);
                alllabel.push(`Overall with ${key}`);
            }
            if (group.callCount > 0) {
                labelstextCount.push(`Texts with ${key}`);
                datatextCount.push(group.textCount);
                alllabel.push(`Texts with ${key}`);
            }

            if (group.callCount > 0) {
                labelscallCount.push(`Calls with ${key}`);
                datacallCount.push(group.callCount);
                alllabel.push(`Calls with ${key}`);
            }
        });

        const wrapper = document.getElementById('chart-container-wrapper') || document.createElement('div');
        wrapper.id = 'chart-container-wrapper';
        document.getElementById('chat-box').appendChild(wrapper);

        const container = document.createElement('div');
        container.className = 'chart-container';
        wrapper.appendChild(container);

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        console.log('Chart pie data: ', labelsoverallCount);

        new Chart(canvas, {
            type: 'doughnut',
            data: {
                //labels: [labelsoverallCount,labelstextCount, labelscallCount],
                datasets: [
                    {   
                        labels: labelsoverallCount,
                        backgroundColor: ['#AAA', '#777'],
                        data: dataoverallCount
                      },
                      {
                        labels: labelstextCount,
                        backgroundColor: ['hsl(0, 100%, 60%)', 'hsl(0, 100%, 35%)'],
                        data: datatextCount
                      },
                      {
                        labels: labelscallCount,
                        backgroundColor: ['hsl(100, 100%, 60%)', 'hsl(100, 100%, 35%)'],
                        data: datacallCount
                      }
            ],
            },
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var index = tooltipItem.index;
                            return dataset.labels[index] + ': ' + dataset.data[index];
                        }
                    }
                },
                /*responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: 'white',
                            verticalAlign: "bottom",
                            horizontalAlign: "center",
                        }
                    }
                }*/
            }
        });
    }

    function createHeatmap(interactionsData) {
        const wrapper = document.getElementById('heatmap-container-wrapper') || document.createElement('div');
        wrapper.id = 'heatmap-container-wrapper';
        document.getElementById('chat-box').appendChild(wrapper);

        const heatmapGrid = document.createElement('div');
        heatmapGrid.className = 'heatmap-grid';
        wrapper.appendChild(heatmapGrid);

        const maxInteractionCount = Math.max(...interactionsData);

        const lowThreshold = maxInteractionCount * 0.25;
        const mediumThreshold = maxInteractionCount * 0.5;
        const highThreshold = maxInteractionCount * 0.75;

        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';

            const interactionCount = interactionsData[i] || 0;

            if (interactionCount >= highThreshold) {
                cell.classList.add('very-high-interaction');
            } else if (interactionCount >= mediumThreshold) {
                cell.classList.add('high-interaction');
            } else if (interactionCount >= lowThreshold) {
                cell.classList.add('medium-interaction');
            } else {
                cell.classList.add('low-interaction');
            }

            cell.innerText = interactionCount;
            heatmapGrid.appendChild(cell);
        }
    }


    function createSimpleCount(messages) {
        let overallMessages = 0;
        let totalCalls = 0;
        messages.forEach(msg => {
            overallMessages++;
            if (msg.message === '[-=-=-=-!!CALL!!-=-=-=-]') {
                totalCalls++;
            }
        });
        const totalMessages = overallMessages - totalCalls;
        const countDiv = document.createElement('div');
        countDiv.style.color = 'white';
        countDiv.innerHTML = `
        <p>Contact to ${countContacts(resultsNormalizedMessages)} people.</p>
        <p>Total Messages: ${totalMessages}</p>
        <p>Total Calls: ${totalCalls}</p>
        `;
        chatBox.appendChild(countDiv);
    }
});



function countContacts(records) {
    const seenNumbers = new Set();
    let seenNumbersCount = 0;

    for (let i = 0; i < records.length; i++) {
        const record = records[i]
        const numbers = Array.isArray(record.filtered_number_to) ? record.filtered_number_to : [record.filtered_number_to];

        for (const number of numbers) {
            if (!seenNumbers.has(number)) {
                seenNumbers.add(number);
                seenNumbersCount++;
            }
        }
    }
    return seenNumbersCount;
}

