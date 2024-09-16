function saveSettings(preferences) {
    localStorage.setItem('timestampPreferences', JSON.stringify(preferences));
}

function loadSettings() {
    const savedPreferences = localStorage.getItem('timestampPreferences');   
    // Fallback Settings
    if (!savedPreferences) {
        return {
            timeZone: 'gmt',
            timeFormat: '24Hour', 
            dateFormat: 'YYYY-MM-DD', 
            displayOrder: 'timeAndDate' 
        };
    }
    return JSON.parse(savedPreferences);
}

function processTimestamp(timestamp) {
    const preferences = loadSettings();  
    
    const formats = {
        dateFormats: [
            'MM/DD/YYYY',
            'DD/MM/YYYY',
            'DD.MM.YYYY',
            'YYYY-MM-DD'
        ],
        timeZones: {
            gmt: 'GMT',
            utc: 'UTC',
            pst: 'America/Los_Angeles',
            cest: 'Europe/Berlin'
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

        switch (format) {
            case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
            case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
            case 'DD.MM.YYYY': return `${day}.${month}.${year}`;
            case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
            default: return `${year}-${month}-${day}`;
        }
    };

    const formatTime = (date, is24Hour = true) => {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        let ampm = '';

        if (!is24Hour) {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // 12h Format
        }

        const hoursStr = String(hours).padStart(2, '0');
        return `${hoursStr}:${minutes} ${ampm}`.trim();
    };

    const convertToTimezone = (date, tz) => new Date(date.toLocaleString('en-US', { timeZone: tz }));

    if (!checkValidISO(timestamp)) {
        return 'Invalid ISO timestamp';
    }

    const date = new Date(timestamp);
    const selectedTimeZone = formats.timeZones[preferences.timeZone.toLowerCase()];
    const localDate = convertToTimezone(date, selectedTimeZone);
    const selectedDateFormat = preferences.dateFormat;
    const use24HourFormat = preferences.timeFormat === '24Hour';

    return {
        timeZone: preferences.timeZone.toUpperCase(),
        date: formatDate(localDate, selectedDateFormat),
        time: formatTime(localDate, use24HourFormat),
        displayOrder: preferences.displayOrder === 'dateAndTime' 
                     ? `${formatDate(localDate, selectedDateFormat)} ${formatTime(localDate, use24HourFormat)}`
                     : `${formatTime(localDate, use24HourFormat)} ${formatDate(localDate, selectedDateFormat)}`
    };
}

/*
const preferences = {
    timeZone: 'GMT',
    timeFormat: '12Hour', 
    dateFormat: 'YYYY-MM-DD',
    displayOrder: 'a' 
};

saveSettings(preferences);
*/
/////////////////////////////////////////////////////////////////////
// Test
// const timestamp = '2024-08-02T04:51:30.000Z';
// console.log(processTimestamp(timestamp));
// console.log(processTimestamp(timestamp).displayOrder);