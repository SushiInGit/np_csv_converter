var middleman = middleman ?? {};

middleman.umami = (function () {
    function trackEvent(eventName, eventDetails) {
        if (window.umami) {
            try {
                window.umami.track(eventName, eventDetails);
            } catch (error) {
                console.error(`Umami tracking failed: ${error.message}`);
                return false; 
            }
        } else {
            console.warn("Umami tracking is not available (possibly blocked by an ad blocker).");
            return false; 
        }
        return true; 
    }

    function trackSettingsChangeTimezone(timezoneOLD, timezoneNew) {
        if (timezoneOLD !== timezoneNew) {
            const eventName = `Timezone Change: ${timezoneNew.toUpperCase()}`;
            const eventDetails = {
                category: 'Timezone Changes',
                action: `${timezoneNew.toUpperCase()}`,
                label: timezoneNew.toUpperCase(),
            };
            return track(eventName, eventDetails);
        }
    }

    function trackSettingsChangeDaylightSaving(dlsOLD, dlsNEW) {
        if (dlsOLD !== dlsNEW) {
            const eventName = `DaylightSaving Offset: ${dlsNEW.toUpperCase()}`;
            const eventDetails = {
                category: 'DaylightSaving Offset Changes',
                action: `${dlsNEW.toUpperCase()}`,
                label: dlsNEW.toUpperCase(),
            };
            return track(eventName, eventDetails);
        }
    }

    function trackFileUpload(page, file) {
        const eventName = `File Upload: ${page.toUpperCase()}`;
        const eventDetails = {
            category: 'File Events',
            action: 'Upload',
            label: file,
        };
        return track(eventName, eventDetails);
    }

    function trackContactsImport(type, amount) {
        const eventName = `Contact Event: ${type}`;
        const eventDetails = {
            category: 'Contact Events',
            action: `${amount} Contacts Import`,
        };
        return track(eventName, eventDetails);
    }

    function trackContactsExport() {
        const eventName = `Contacts Event: Export`;
        const eventDetails = {
            category: 'Contact Events',
            action: `Contacts Export`,
        };
        return track(eventName, eventDetails);
    }

    return {
        trackSettingsTimezone: trackSettingsChangeTimezone,
        trackSettingsDLS: trackSettingsChangeDaylightSaving,
        trackUpload: trackFileUpload,
        trackContact: trackContactsImport,
        trackExport: trackContactsExport,
    };
})();
