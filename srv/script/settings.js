document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingsPopup');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const timezoneSelect = document.getElementById('timezone');
    const dateformatSelect = document.getElementById('dateformat');
    const use12hClockSelect = document.getElementById('use12hClock');
    const timeFirstSelect = document.getElementById('timeFirst');
    const timezoneOffsetSelect = document.getElementById('timezoneOffset');

    
    function loadSettings() {
        const savedtimezone = localStorage.getItem('timezone');
        const saveddateformat= localStorage.getItem('dateformat');
        const saveduse12hClock = localStorage.getItem('use12hClock');
        const savedtimeFirst = localStorage.getItem('timeFirst');
        const savedtimezoneOffset = localStorage.getItem('timezoneOffset');
        if (savedtimezone && saveddateformat && saveduse12hClock && savedtimeFirst && savedtimezoneOffset) {
            timezoneSelect.value = savedtimezone;
            dateformatSelect.value = saveddateformat;
            use12hClockSelect.value = saveduse12hClock;
            timeFirstSelect.value = savedtimeFirst;
            timezoneOffsetSelect.value = savedtimezoneOffset;
            // Console.Log - DEV output //
            console.log(`## Settings Loading ##`);
            console.log(`Timezone: ${savedtimezone}`);
            console.log(`Dateformat: ${saveddateformat}`);
            console.log(`Use 12h Clock: ${saveduse12hClock}`);
            console.log(`Time First: ${savedtimeFirst}`);
            console.log(`Timezone Offset: ${savedtimezoneOffset}`);
        }
    }

    loadSettings();

    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    saveSettings.addEventListener('click', () => {
        localStorage.setItem('timezone', timezoneSelect.value);
        localStorage.setItem('dateformat', dateformatSelect.value);
        localStorage.setItem('use12hClock', use12hClockSelect.value);
        localStorage.setItem('timeFirst', timeFirstSelect.value);
        localStorage.setItem('timezoneOffset', timezoneOffsetSelect.value);
        // Console.Log - DEV output //
        console.log(`## Settings Saved ##`);
        console.log(`Timezone: ${timezoneSelect.value}`);
        console.log(`Dateformat: ${dateformatSelect.value}`);
        console.log(`Use 12h Clock: ${use12hClockSelect.value}`);
        console.log(`Time First: ${timeFirstSelect.value}`);
        console.log(`Timezone Offset: ${timezoneOffsetSelect.value}`);
        // alert('Settings saved');
        settingsModal.style.display = 'none';
    });
});