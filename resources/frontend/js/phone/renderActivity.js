
/////Chart
function generateActivityChart(text, calls, simowner) {
    let textCount = {};
    let callCount = {};


    text.forEach(entry => {
        if (entry.number_from === simowner) {
            const timestamp = new Date(entry.timestamp);
            const time = `${(processTimestamp(timestamp).time).substring(0, 2)}`;

            if (!textCount[time]) {
                textCount[time] = 0;
            }
            textCount[time]++;
        }
    });

    calls.forEach(entry => {
        if (entry.call_from === simowner) {
            const established_at = new Date(entry.established_at);
            showOnlyHoures = (processTimestamp(established_at).time);
            if (typeof showOnlyHoures === 'string') {
                const time =  showOnlyHoures.substring(0, 2); 

            if (!callCount[time]) {
                callCount[time] = 0;
            }
            callCount[time]++;
        }
        };
    });



    let labelsText = Object.keys(textCount).sort((a, b) => {
        const [aHours, aMinutes] = a.split(':').map(Number);
        const [bHours, bMinutes] = b.split(':').map(Number);

        return aHours - bHours || aMinutes - bMinutes;
    });
    let labelsCall = Object.keys(callCount).sort((a, b) => {
        const [aHours, aMinutes] = a.split(':').map(Number);
        const [bHours, bMinutes] = b.split(':').map(Number);

        return aHours - bHours || aMinutes - bMinutes;
    });

    let FulllabelsText = [];
    for (let i = 0; i <= 24; i++) {
        let hour = i.toString().padStart(2, '0'); // Format hours as 00, 01, 02, ..., 24
        FulllabelsText.push(`${hour}:00`);
    }

    let countsText = labelsText.map(label => textCount[label]);
    let countsCall = labelsCall.map(label => callCount[label]);


    let ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelsText,
            datasets: [{
                label: 'Activity Count by Text',
                data: countsText,
                backgroundColor: 'rgba(106, 13, 173, 0.6)',
                borderColor: 'rgba(106, 13, 173, 1)',
                borderWidth: 1
            },
            {
                label: 'Activity Count by Calls',
                data: countsCall,
                backgroundColor: 'rgba(13, 173, 106, 0.6)',
                borderColor: 'rgba(13, 173, 106, 1)',
                borderWidth: 1
            }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: `Time (Hour) ${processTimestamp(Date.now()).timeZone}`
                    },
                    ticks: {
                        stepSize: 2 
                    }

                },
                y: {
                    title: {
                        display: true,
                        text: 'Activity Count'
                    },
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

const activityDataText = backend.dataController.getData(backend.helpers.getAllSheetTypes().TEXTS);
const activityDataCalls = backend.dataController.getData(backend.helpers.getAllSheetTypes().CALLS);
