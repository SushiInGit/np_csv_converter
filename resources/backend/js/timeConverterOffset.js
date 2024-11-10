var backend = backend ?? {};

backend.timeConverterOffset = function () {
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

    return {
        offsetTime: offsetTime
    };
}();
