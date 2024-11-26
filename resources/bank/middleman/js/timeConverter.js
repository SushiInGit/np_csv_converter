var middleman = middleman ?? {};

middleman.timeConverter = (function () {

    /**
    * Offset Time based on Settings
    * @param {*} timestemp in UTC-Format
    * @returns offsetTime in UTC
    **/
    function offsetTime(timestemp) {
        const date = new Date(timestemp);
        let useOffset = "";
        let npSettings = middleman.settings.getSettings();

        if (npSettings) {
            offset = parseInt(npSettings.offsetBySettings, 10) || 0;
        }
        date.setHours(date.getHours() + offset);

        return date.toISOString();
    }

    /**
    * Convert Timestamp 
    * @param {*} timestamp (in UTC)
    * @returns Time Converted based on 'Settings'
    */
    function processTimestamp(timestamp) {
        const preferences = middleman.settings.getSettings();

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

        const checkValidISO = (timestamp) => !isNaN(new Date(timestamp).getTime());

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

            return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`.trim();
        };

        const convertToTimezone = (date, tz) => new Date(date.toLocaleString('en-US', { timeZone: tz }));
        const isDST = (date, tz) => {
            const currentOffset = new Date(date.toLocaleString('en-US', { timeZone: tz })).getTimezoneOffset();
            const winterOffset = new Date(new Date(date.getFullYear(), 0, 1).toLocaleString('en-US', { timeZone: tz })).getTimezoneOffset();
            return currentOffset < winterOffset;
        };

        if (!checkValidISO(timestamp)) {
            return 'Invalid ISO timestamp';
        }

        const date = new Date(timestamp);

        const selectedTimeZone = formats.timeZones[preferences.timeZone.toLowerCase()] || formats.timeZones.gmt;
        const localDate = convertToTimezone(date, selectedTimeZone);

        const selectedDateFormat = preferences.dateFormat;
        const use24HourFormat = preferences.timeFormat === '24Hour';
        const isInDST = isDST(date, selectedTimeZone);

        const formattedDate = formatDate(localDate, selectedDateFormat);
        const formattedTime = formatTime(localDate, use24HourFormat);

        return {
            timeZone: preferences.timeZone.toUpperCase(),
            date: formattedDate,
            time: formattedTime,
            isDaylightSavingTime: isInDST,
            offsetBySettings: parseInt(preferences.offsetBySettings, 10) || 0,
            fullDateAndTime: preferences.displayOrder === 'dateAndTime'
                ? `${formattedDate} ${formattedTime}`
                : `${formattedTime} ${formattedDate}`
        };
    }

    return {
        processTimestamp,
        convertedTimestamp: (timestemp) => { return processTimestamp(offsetTime(timestemp)) }
    };
})();
