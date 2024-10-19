var frontend = frontend ?? {};

frontend.popupActivity = (function () {
    function activityEvent() {

        const popupDivName = "activity";
        const content = `
                <center>View is based of Outgoing activity from Sim Owner</center><br>
                <div class="chart-container">
                    <canvas id="activityChart"></canvas>
                </div>
        `;
        const footer = `<div id="time-range-output"></div>`;

        middleman.popupModel.createPopup(popupDivName, 'Activity Chart', content, footer);
        setTimeout(() => { generateActivityChart(activityDataText, activityDataCalls, middleman.simOwner.number()); }, 50);
    }

    return {
        render: activityEvent
    };
})();
