var frontend = frontend ?? {};

frontend.popupActivity = (function () {
    
    function loadChartScript(callback) {
        const script = document.createElement('script');
        script.src = 'resources/phone/backend/vendors/chart.js';
        script.onload = () => {
            if (callback) {
                callback(); 
            }
        };
        script.onerror = () => {
            console.error('Error loading Chart.js');
        };
        document.head.appendChild(script);
    }

    function activityEvent() {
        const popupDivName = "activity";
        const content = `
            <div id="chart-info"></div>
            <div class="chart-container" id="chart-container">
                <p class="loading-message" id="loading-message"><b>Loading chart... </b><br>Please wait a moment. <br><br><small>The time required may vary depending on the amount of data being processed.</small></p>
            </div>
        `;
        const footer = `<div id="time-range-output"></div>`;
        
        middleman.popupModel.createPopup(popupDivName, 'Activity Chart', content, footer);

        setTimeout(() => {

            const infoContainer = document.getElementById('chart-info');
            const chartContainer = document.getElementById('chart-container');

            setTimeout(async () => {
                loadChartScript(async () => {
                try {
                    //chartContainer.innerHTML = `<canvas id="activityChart"></canvas>`;
                    await generateActivityChart(activityDataText, activityDataCalls, middleman.simOwner.number());

                } catch (error) {
                    chartContainer.innerHTML = `<p>Error loading chart. <br>Please try again.</p>`;

                } finally {
                    chartContainer.style.height = '250px';
                    infoContainer.innerHTML = `<center>View is based of Outgoing activity from Sim Owner</center><br>`;
                    chartContainer.innerHTML = `<canvas id="activityChart"></canvas>`;
                    generateActivityChart(activityDataText, activityDataCalls, middleman.simOwner.number())
                }
            });
            }, 10);
        }, 50);
        
    }

    return {
        render: activityEvent
    };
})();
