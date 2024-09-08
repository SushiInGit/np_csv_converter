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


    // Enable/Disable Console Debug logging
    debugSettings = false;

    // Base Value firsttime loading
    var fttimezone = "UTC";
    var ftdateformat = "en-US";
    var fttimezoneOffset = "0";
    var ftuse12hClock = "false";
    var fttimeFirst = "false";

    // Init Settings
    loadSettings();
    
    // Loading Settings
    function loadSettings() {
        const savedtimezone = localStorage.getItem('timezone');
        const saveddateformat= localStorage.getItem('dateformat');
        const saveduse12hClock = localStorage.getItem('use12hClock') === 'true';
        const savedtimeFirst = localStorage.getItem('timeFirst') === 'true';
        const savedtimezoneOffset = localStorage.getItem('timezoneOffset');
        
        if(debugSettings === true){console.log(`## Settings Loading ##`);}

        // First Boot
        if(savedtimezone === null){savedtimezoneLoading = fttimezone; if(debugSettings === true){console.log('Default-Setting: Timezone ' + fttimezone);}}else{savedtimezoneLoading = savedtimezone;}
        if(saveddateformat === null){saveddateformatLoading = ftdateformat; if(debugSettings === true){console.log('Default-Setting: Dataformat ' + ftdateformat);}}else{saveddateformatLoading = saveddateformat;}
        if(savedtimezoneOffset === null){savedtimezoneOffsetLoading = fttimezoneOffset; if(debugSettings === true){console.log('Default-Setting: Offset ' + fttimezoneOffset);}}else{savedtimezoneOffsetLoading = savedtimezoneOffset;}
        
        // Pulldown
        timezoneSelect.value = savedtimezoneLoading
        dateformatSelect.value = saveddateformatLoading;
        timezoneOffsetSelect.value = savedtimezoneOffsetLoading;

        // Checkbox
        use12hClockSelect.checked  = saveduse12hClock;
        timeFirstSelect.checked  = savedtimeFirst;

        // Console.Log - DEV output //
        if(debugSettings === true){
            console.log(`## ---------------- ##`);
            console.log(`Timezone: ${timezoneSelect.value}`);
            console.log(`Dateformat: ${dateformatSelect.value}`);
            console.log(`Use 12h Clock: ${use12hClockSelect.checked}`);
            console.log(`Time First: ${timeFirstSelect.checked}`);
            console.log(`Timezone Offset: ${timezoneOffsetSelect.value}`);  
            console.log(`## ---------------- ##`);
        }
    }


    // Save Settings
    saveSettings.addEventListener('click', () => {
        localStorage.setItem('timezone', timezoneSelect.value);
        localStorage.setItem('dateformat', dateformatSelect.value);
        localStorage.setItem('use12hClock', use12hClockSelect.checked );
        localStorage.setItem('timeFirst', timeFirstSelect.checked );
        localStorage.setItem('timezoneOffset', timezoneOffsetSelect.value);

        // Console.Log - DEV output // 
        if(debugSettings === true){
            console.log(`## Settings Saved ##`);
            console.log(`Timezone: ${timezoneSelect.value}`);
            console.log(`Dateformat: ${dateformatSelect.value}`);
            console.log(`Use 12h Clock: ${use12hClockSelect.checked }`);
            console.log(`Time First: ${timeFirstSelect.checked }`);
            console.log(`Timezone Offset: ${timezoneOffsetSelect.value}`);
            console.log(use12hClockSelect.checked);
            console.log(timeFirstSelect.checked);
        }
        settingsModal.style.display = 'none';
    });

    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
});