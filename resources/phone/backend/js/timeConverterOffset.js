var backend = backend ?? {};

backend.timeConverterOffset = function () {

    /**
    * Offset Time based on Settings
    * @param {*} timestemp in UTC-Format
    * @returns offsetTime in UTC
    **/
    function offsetTime(timestemp) {
        const date = new Date(timestemp);
        let useOffset = "";
        const npSettings = loadSettings();

        if (npSettings) {
            offset = parseInt(npSettings.offsetBySettings, 10) || 0;
        }
        date.setHours(date.getHours() + offset);

        return date.toISOString();
    }
    
/**  OLD OFFSET TIME 
    function offsetTime(utcDate) {
        const date = new Date(utcDate);

        let useOffset = "";
        const npSettings = localStorage.getItem('np_settings');
        if (npSettings) {
            const settings = JSON.parse(npSettings);
            useOffset = (settings.isDaylightSavingTime);
        } else {
            useOffset = "auto";
        }

        if (useOffset === 'true') {
            date.setHours(date.getHours() + 1); 
        } else if (useOffset === 'false') {
            date.setHours(date.getHours() - 1);
        } else if (useOffset === 'auto') {
            date.setHours(date.getHours() + 0);
        }
        return date.toISOString();
    }
*/
    return {
        offsetTime: offsetTime
    };
}();
