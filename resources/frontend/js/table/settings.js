document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingsPopup');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const timezoneSelect = document.getElementById('timezone');
    const dateformatSelect = document.getElementById('dateformat');
    const use12hClockSelect = document.getElementById('use12hClock');
    const timeFirstSelect = document.getElementById('timeFirst');
    const showUTCSelect = document.getElementById('showUTC');
    const timezoneOffsetSelect = document.getElementById('timezoneOffset');



    // Base Value firsttime loading
    var fttimezone = "UTC";
    var ftdateformat = "en-US";
    var fttimezoneOffset = "0";
    var ftuse12hClock = "false"; // Unused
    var fttimeFirst = "false"; // Unused
    var ftShowUTC = "false"; // Unused

    // Init Settings
    loadSettings();
    
    // Loading Settings
    function loadSettings() {
        const savedtimezone = localStorage.getItem('timezone');
        const saveddateformat= localStorage.getItem('dateformat');
        const saveduse12hClock = localStorage.getItem('use12hClock') === 'true';
        const savedtimeFirst = localStorage.getItem('timeFirst') === 'true';
        const savedShowUTC = localStorage.getItem('showUTC') === 'true';
        const savedtimezoneOffset = localStorage.getItem('timezoneOffset');

        // Console.Log - DEV output //
        
        logger.settings(`## Settings Loading ##`);
        logger.settings('Default-Setting: Timezone ' + fttimezone);
        logger.settings('Default-Setting: Dataformat ' + ftdateformat);
        logger.settings('Default-Setting: Offset ' + fttimezoneOffset);
        logger.settings(`## ---------------- ##`);
        

        // First Boot use ft*** otherwise use saved setting
        savedtimezoneLoading = savedtimezone === null ? fttimezone : savedtimezone
        saveddateformatLoading = saveddateformat === null ? ftdateformat : saveddateformat;
        savedtimezoneOffsetLoading = savedtimezoneOffset === null ? fttimezoneOffset : savedtimezoneOffset;

        // Pulldown
        timezoneSelect.value = savedtimezoneLoading
        dateformatSelect.value = saveddateformatLoading;
        timezoneOffsetSelect.value = savedtimezoneOffsetLoading;

        // Checkbox
        use12hClockSelect.checked  = saveduse12hClock;
        timeFirstSelect.checked  = savedtimeFirst;
        showUTCSelect.checked = savedShowUTC;

        // Console.Log - DEV output //
        
        logger.settings(`## ---------------- ##`);
        logger.settings(`Timezone: ${timezoneSelect.value}`);
        logger.settings(`Dateformat: ${dateformatSelect.value}`);
        logger.settings(`Use 12h Clock: ${use12hClockSelect.checked}`);
        logger.settings(`Time First: ${timeFirstSelect.checked}`);
        logger.settings(`Timezone Offset: ${timezoneOffsetSelect.value}`);  
        logger.settings(`## ---------------- ##`);
        
    }


    // Save Settings
    saveSettings.addEventListener('click', () => {
        localStorage.setItem('timezone', timezoneSelect.value);
        localStorage.setItem('dateformat', dateformatSelect.value);
        localStorage.setItem('use12hClock', use12hClockSelect.checked );
        localStorage.setItem('timeFirst', timeFirstSelect.checked );
        localStorage.setItem('timezoneOffset', timezoneOffsetSelect.value);
        localStorage.setItem('showUTC', showUTCSelect.checked);

        // Console.Log - DEV output // 
        
        logger.settings(`## Settings Saved ##`);
        logger.settings(`Timezone: ${timezoneSelect.value}`);
        logger.settings(`Dateformat: ${dateformatSelect.value}`);
        logger.settings(`Use 12h Clock: ${use12hClockSelect.checked }`);
        logger.settings(`Time First: ${timeFirstSelect.checked }`);
        logger.settings(`Timezone Offset: ${timezoneOffsetSelect.value}`);
        logger.settings(use12hClockSelect.checked);
        logger.settings(timeFirstSelect.checked);
        
        settingsModal.classList.remove("shown");
    });

    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add("shown");
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove("shown");
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        settingsModal.classList.remove("shown");
    }
});
