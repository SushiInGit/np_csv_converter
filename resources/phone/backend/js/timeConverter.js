function saveSettings(newPreferences) {
    const SETTINGS_KEY = 'np_settings';
    const existingSettings = localStorage.getItem(SETTINGS_KEY);
    let settings = existingSettings ? JSON.parse(existingSettings) : {};
    Object.keys(newPreferences).forEach(key => {
        if (key !== 'MAX_STORAGE_MB' || !(key in settings)) {
            settings[key] = newPreferences[key];
        }
    });
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
    const SETTINGS_KEY = 'np_settings';
    const savedPreferences = localStorage.getItem(SETTINGS_KEY);
    // Default settings
    const defaultSettings = {
        timeZone: 'utc',
        timeFormat: '24Hour',
        offsetShow: 'on',
        dateFormat: 'YYYY-MM-DD',
        displayOrder: 'dateAndTime',
        offsetBySettings: '0'

    };

    if (!savedPreferences) {
        return defaultSettings;
    }

    const preferences = JSON.parse(savedPreferences);

    return {
        timeZone: preferences.timeZone || defaultSettings.timeZone,
        timeFormat: preferences.timeFormat || defaultSettings.timeFormat,
        offsetShow: preferences.offsetShow || defaultSettings.offsetShow,
        dateFormat: preferences.dateFormat || defaultSettings.dateFormat,
        displayOrder: preferences.displayOrder || defaultSettings.displayOrder,
        offsetBySettings: preferences.offsetBySettings || defaultSettings.offsetBySettings
    };
}

function processTimestamp(timestamp) {
    const preferences = loadSettings();

    const formats = {
        dateFormats: [
            'MM/DD/YYYY',
            'DD/MM/YYYY',
            'DD.MM.YYYY',
            'YYYY-MM-DD',
            'MMMM DD, YYYY',
            'DD MMMM YYYY'
        ],
        timeZones: {
            utc: 'Etc/UTC',
            gmt: 'Etc/GMT',
            est: 'America/New_York',
            pt: 'America/Los_Angeles',
            ast: 'America/Halifax',
            jst: 'Asia/Tokyo',
            cst: 'America/Chicago',
            ist: 'Asia/Kolkata',
            pst: 'America/Los_Angeles',
            edt: 'America/New_York',
            aest: 'Australia/Sydney',
            cest: 'Europe/Berlin',
            bst: 'Europe/London'
        },
        offsetShow: {
            on: 'ON',
            off: 'OFF'
        }
    };


    const checkValidISO = (timestamp) => {
        const date = new Date(timestamp);
        return !isNaN(date.getTime());
    };

    const formatDate = (date, format) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const monthLong = date.toLocaleString('default', { month: 'long' });

        switch (format) {
            case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
            case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
            case 'DD.MM.YYYY': return `${day}.${month}.${year}`;
            case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
            case 'MMMM DD, YYYY': return `${monthLong} ${day}, ${year}`;     
            case 'DD MMMM YYYY': return `${day} ${monthLong} ${year}`;        
            default: return `${year}-${month}-${day}`;
        }
    };

    const formatTime = (date, is24Hour = true) => {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        let ampm = '';

        if (!is24Hour) {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
        }

        const hoursStr = String(hours).padStart(2, '0');
        return `${hoursStr}:${minutes} ${ampm}`.trim();
    };

    const convertToTimezone = (date, tz) => new Date(date.toLocaleString('en-US', { timeZone: tz }));

    const isDST = (date, tz) => {
        const currentOffset = new Date(date.toLocaleString('en-US', { timeZone: tz })).getTimezoneOffset();
        const winterDate = new Date(date.getFullYear(), 0, 1); // January 1st
        const winterOffset = new Date(winterDate.toLocaleString('en-US', { timeZone: tz })).getTimezoneOffset();
        return currentOffset < winterOffset;
    };

 

    if (!checkValidISO(timestamp)) {
        return 'Invalid ISO timestamp';
    }

    const date = new Date(timestamp);

    const selectedTimeZone = formats.timeZones[(preferences.timeZone).toLowerCase()];

    const localDate = convertToTimezone(date, selectedTimeZone);
    const selectedDateFormat = preferences.dateFormat;
    const use24HourFormat = preferences.timeFormat === '24Hour';
    const isInDST = isDST(date, selectedTimeZone);


    return {
        timeZone: preferences.timeZone.toUpperCase(),
        date: formatDate(localDate, selectedDateFormat),
        time: formatTime(localDate, use24HourFormat),
        //_dateInput: formatDate(date, selectedDateFormat),
        //_timeInput: formatTime(date, use24HourFormat),
        isDaylightSavingTime: isInDST,
        offsetBySettings: parseInt(preferences.offsetBySettings, 10) || 0,
        displayOrder: preferences.displayOrder === 'dateAndTime'
                     ? `${formatDate(localDate, selectedDateFormat)} ${formatTime(localDate, use24HourFormat)}`
                     : `${formatTime(localDate, use24HourFormat)} ${formatDate(localDate, selectedDateFormat)}`
    };
}
//let dateNowTemp = new Date();
/*
let dateNowTemp = new Date("2024-11-10T07:04:10.450Z");
console.log("UTC" ,(dateNowTemp.toLocaleString("en-US", { timeZone: "Etc/UTC", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).replace(",", "").replace(/\//g, "-")));
console.log("PT" ,(dateNowTemp.toLocaleString("en-US", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).replace(",", "").replace(/\//g, "-")));
console.log("Timeconverter", processTimestamp(dateNowTemp))
*/