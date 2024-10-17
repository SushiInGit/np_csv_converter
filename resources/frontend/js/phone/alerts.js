var frontend = frontend ?? {};

frontend.alert = (function () {
    function checkUploadedFiles() {
        if ((!localStorage.calls || localStorage.calls === '[]' || localStorage.calls === '') &&
            (!localStorage.texts || localStorage.texts === '[]' || localStorage.texts === '')) {
            global.alertsystem('warning', `It looks like you haven't uploaded an XLSX file yet. You can update it later by clicking on the cloud icon in the top left.`, 15);
            helpEvent(); // Assuming helpEvent is defined elsewhere
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


    return {
        checkUploadedFiles: checkUploadedFiles,
        checkSettings: checkSettings,
    };

})();

frontend.alert.checkUploadedFiles();
frontend.alert.checkSettings();