var frontend = frontend ?? {};

frontend.alert = (function () {
    function checkUploadedFiles() {
        if(backend.storageSelector.searchRecord('', true, 'last') === false) {
            global.alertsystem('warning', `It looks like you haven't uploaded an XLSX file yet. You can update it later by clicking on the cloud icon in the top left.`, 15);
            document.addEventListener('DOMContentLoaded', function() { setTimeout(() => { frontend.popupHelp.render(); }, 500); });
        }
    }

    // Function to check and alert about missing settings
    function checkSettings() {
        const SETTINGS_KEY = 'np_settings';
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        const settingsData = savedSettings ? JSON.parse(savedSettings) : {};

        if (!settingsData.timeZone || !settingsData.timeFormat || !settingsData.offsetShow ||
            !settingsData.dateFormat || !settingsData.displayOrder) {
            
            global.alertsystem('info', 
                `It seems you haven't set up your time settings yet. You can do so by clicking the gear icon in the top right.`,
                15);
        }
    }
    function checkTimeOffset(){
        const npSettings = localStorage.getItem('np_settings');
        if (npSettings) {
            const settings = JSON.parse(npSettings);
            useOffset = (settings.isDaylightSavingTime); 
        } else {
            useOffset = "auto";
        }
        if(useOffset === "false") {
            global.alertsystem('info', `Remember:<br> It appears that you've manually set the time-offset to 'Winter Time' in the settings.`, 15);

        }
        if(useOffset === "true") {
            global.alertsystem('info', `Remember:<br> It appears that you've manually set the time-offset to 'Summer Time' in the settings.`, 15);
        }
       
    }

    return {
        checkUploadedFiles: checkUploadedFiles,
        checkSettings: checkSettings,
        checkTimeOffset: checkTimeOffset
    };

})();

frontend.alert.checkUploadedFiles();
frontend.alert.checkSettings();
frontend.alert.checkTimeOffset();
