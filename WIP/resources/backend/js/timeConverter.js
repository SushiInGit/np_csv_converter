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
            offsetShow: 'on',
            dateFormat: 'YYYY-MM-DD', 
            displayOrder: 'dateAndTime' 
            //displayOrder: 'timeAndDate' 
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
            'YYYY-MM-DD',
            'MMMM DD, YYYY' 
        ],
        timeZones: {
            utc: 'UTC',
            gmt: 'GMT',
            est: 'EST',
            pt: 'PT',
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
            case 'DD MMMM YYYY': return `${day} ${monthLong} ${year}`;
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
            hours = hours % 12 || 12; // 12h Format
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

    const getTimeOffset = (date, tz) => {
        const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
        const utcDate = new Date(date.toISOString());
        const diffInMinutes = (tzDate - utcDate) / 60000;
        const offsetMinutes = isInDST ? diffInMinutes - 60 : diffInMinutes;
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const minutes = Math.abs(offsetMinutes % 60);
        const sign = offsetMinutes >= 0 ? '+' : '-';
    
        return {
            hours: `${sign}${String(offsetHours).padStart(2, '0')}`,
            minutes: `${String(offsetMinutes).padStart(2, '0')}`,
            totalMinutes: diffInMinutes
        };
    };

    if (!checkValidISO(timestamp)) {
        return 'Invalid ISO timestamp';
    }

    const date = new Date(timestamp);
    const selectedTimeZone = formats.timeZones[preferences.timeZone.toLowerCase()];
    const localDate = convertToTimezone(date, selectedTimeZone);
    const selectedDateFormat = preferences.dateFormat;
    const use24HourFormat = preferences.timeFormat === '24Hour';

    const isInDST = isDST(date, selectedTimeZone); 
    const { hours, minutes, totalMinutes } = getTimeOffset(date, selectedTimeZone, isInDST); 
    const offsetDate = new Date(date.getTime() + ((totalMinutes) * 60000)); 
    const dateOffset = formatDate(offsetDate, selectedDateFormat);
    const timeOffset = formatTime(offsetDate, use24HourFormat);
  
    const showOffset = preferences.offsetShow === `on`

    const finalDate = showOffset ? dateOffset : formatDate(date, selectedDateFormat);
    const finalTime = showOffset ? timeOffset : formatTime(date, use24HourFormat);


    return {
        timeZone: preferences.timeZone.toUpperCase(),
        date: formatDate(localDate, selectedDateFormat),
        time: formatTime(localDate, use24HourFormat),
        _dateInput: formatDate(date, selectedDateFormat), // New date with offset applied
        _timeInput: formatTime(date, use24HourFormat), // New time with offset applied
        offsettimeZoneHours: hours,  // Separate return for hours
        offsetTimeZoneMinutes: minutes, // Separate return for minutes
        dateShowOffset: finalDate, // Output based on offsetShow setting
        timeShowOffset: finalTime, // Output based on offsetShow setting
        isDaylightSavingTime: isInDST ? true : false,
        isOffsetShow: preferences.offsetShow === `on` ? true : false,
        displayOrder: preferences.displayOrder === 'dateAndTime' 
                     ? `${formatDate(localDate, selectedDateFormat)} ${formatTime(localDate, use24HourFormat)}`
                     : `${formatTime(localDate, use24HourFormat)} ${formatDate(localDate, selectedDateFormat)}`
    };
}