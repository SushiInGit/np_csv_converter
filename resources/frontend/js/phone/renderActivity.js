function findActiveTimeRange(data) {
    let timeCount = {};

    data.forEach(entry => {
        const timestamp = new Date(entry.timestamp);
        const time = `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

        if (!timeCount[time]) {
            timeCount[time] = 0;
        }
        timeCount[time]++;
    });

    let sortedTimes = Object.entries(timeCount).sort((a, b) => b[1] - a[1]);
    let highestCount = sortedTimes[0][1];
    let mostActiveTimes = sortedTimes.filter(time => time[1] === highestCount);

    let startTime = mostActiveTimes[mostActiveTimes.length - 1][0];
    let endTime = mostActiveTimes[0][0];

    document.getElementById('time-range-output').textContent = `Most active time range: From ${startTime} to ${endTime}`;
}

function generateActivityChart(data) {
    let timeCount = {};


    data.forEach(entry => {
        const timestamp = new Date(entry.timestamp);
        const time = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

        if (!timeCount[time]) {
            timeCount[time] = 0;
        }
        timeCount[time]++;
    });


    let labels = Object.keys(timeCount).sort((a, b) => {
        const [aHours, aMinutes] = a.split(':').map(Number);
        const [bHours, bMinutes] = b.split(':').map(Number);

        return aHours - bHours || aMinutes - bMinutes;
    });


    let counts = labels.map(label => timeCount[label]);

    let ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Activity Count by Time',
                data: counts,  
                backgroundColor: 'rgba(106, 13, 173, 0.6)',
                borderColor: 'rgba(106, 13, 173, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (Hour:Minute)'
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



const activityDataText = texts;
const activityDataCalls = calls;
/*
console.log(texts);
console.log(calls);
*/