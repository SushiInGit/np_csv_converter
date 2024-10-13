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
        timeZone: 'gmt',
        timeFormat: '24Hour',
        offsetShow: 'on',
        dateFormat: 'YYYY-MM-DD',
        displayOrder: 'dateAndTime'
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
        displayOrder: preferences.displayOrder || defaultSettings.displayOrder
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
            'MMMM DD, YYYY'
        ],
        timeZones: {
            utc: 'UTC',
            gmt: 'GMT',
            est: 'EST',
            pt: 'America/Los_Angeles',
            ast: 'AST',
            jst: 'JST',
            cst: 'CST',
            ist: 'IST',
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

    const getTimeOffset = (date, tz, isInDST) => {
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
        const utcDate = new Date(date.toISOString());
        const diffInMinutes = (tzDate - utcDate) / 60000;
        const offsetMinutes = isInDST ? diffInMinutes - 60 : diffInMinutes;
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const minutes = Math.abs(offsetMinutes % 60);
        const sign = offsetMinutes >= 0 ? '+' : '-';

        return {
            hours: `${sign}${String(offsetHours).padStart(2, '0')}`,
            minutes: `${String(minutes).padStart(2, '0')}`,
            totalMinutes: diffInMinutes
        };
    };

    if (!checkValidISO(timestamp)) {
        return 'Invalid ISO timestamp';
    }

    const date = new Date(timestamp);

    // Safely access timeZone with a default fallback to 'gmt'
    const selectedTimeZone = formats.timeZones[(preferences.timeZone).toLowerCase()];

    const localDate = convertToTimezone(date, selectedTimeZone);
    const selectedDateFormat = preferences.dateFormat;
    const use24HourFormat = preferences.timeFormat === '24Hour';
    const isInDST = isDST(date, selectedTimeZone);
    const { hours, minutes, totalMinutes } = getTimeOffset(date, selectedTimeZone, isInDST);
    const offsetDate = new Date(date.getTime() + (totalMinutes * 60000));
    const showOffset = preferences.offsetShow === 'on';

    const finalDate = showOffset ? formatDate(offsetDate, selectedDateFormat) : formatDate(date, selectedDateFormat);
    const finalTime = showOffset ? formatTime(offsetDate, use24HourFormat) : formatTime(date, use24HourFormat);

    return {
        timeZone: preferences.timeZone.toUpperCase(),
        date: formatDate(localDate, selectedDateFormat),
        time: formatTime(localDate, use24HourFormat),
        _dateInput: formatDate(date, selectedDateFormat),
        _timeInput: formatTime(date, use24HourFormat),
        offsettimeZoneHours: hours,
        offsetTimeZoneMinutes: minutes,
        dateShowOffset: finalDate,
        timeShowOffset: finalTime,
        isDaylightSavingTime: isInDST,
        isOffsetShow: preferences.offsetShow === 'on',
        displayOrder: preferences.displayOrder === 'dateAndTime'
                     ? `${formatDate(localDate, selectedDateFormat)} ${formatTime(localDate, use24HourFormat)}`
                     : `${formatTime(localDate, use24HourFormat)} ${formatDate(localDate, selectedDateFormat)}`
    };
}
