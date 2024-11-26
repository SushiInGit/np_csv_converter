var middleman = middleman ?? {};

middleman.settings = (function () {
    /**
    * defaultSettings => used in localStorage
    **/
    const defaultSettings = {
        chunkSize: '50',
        timeZone: 'utc',
        timeFormat: '24Hour',
        dateFormat: 'YYYY-MM-DD',
        displayOrder: 'dateAndTime',
        offsetBySettings: '0'
    };

    const storageDB = 'settings';

    /**
    * Sync settings to localStorage.
    **/
    function syncSettings(storageDB, settings) {
        try {
            localStorage.setItem(storageDB, JSON.stringify(settings)); 
        } catch (error) {
            console.error("Error syncing settings to localStorage:", error);
        }
    }

    /**
    * Get settings from localStorage.
    * @returns {object} object:settings
    **/
    function getSettings(storageDB) {
        try {
            const settings = localStorage.getItem(storageDB);
            return settings ? JSON.parse(settings) : defaultSettings;  
        } catch (error) {
            console.error("Error loading settings from localStorage:", error);
            return defaultSettings; 
        }
    }

    /**
    * Update multiple settings from an object and overwrite existing ones or create new ones.
    * @param {Object} newSettings - An object containing the new settings to update.
    * @returns {Promise<void>}
    **/
    async function updateSettings(storageDB, newSettings) {
        try {
            let currentSettings = getSettings();
             currentSettings = { ...currentSettings, ...newSettings };

             syncSettings(storageDB, currentSettings);

            middleman.alertsystem('success', `Settings updated successfully.`, 4);
        } catch (error) {
            middleman.alertsystem('warning', `Error updating settings.`, 4);
            console.error("Error updating settings:", error);
        }
    }

    return {
        settings: () => { return defaultSettings; },
        getSettings: () => { return getSettings(storageDB); },
        updateSettings: (newSettings) => { return updateSettings(storageDB, newSettings); }
    }
})();
