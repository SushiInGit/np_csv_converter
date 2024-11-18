var middleman = middleman ?? {};

middleman.umami = (function () {

    function trackSettingsChangeTimezone(timezoneOLD, timezoneNew) {
        if (timezoneOLD !== timezoneNew) {
            if (window.umami) {
                window.umami.track(`Timezone Change: ${timezoneNew.toUpperCase()}`, 'User changed Timezone', {
                    category: 'Timezone Changes',
                    action: `${timezoneNew.toUpperCase()}`,
                    label: timezoneNew.toUpperCase()
                });

            }
        }
    }
    function trackSettingsChangeDaylightSaving(dlsOLD, dlsNEW) {
        if (dlsOLD !== dlsNEW) {
            if (window.umami) {
                window.umami.track(`DaylightSaving Offset: ${dlsNEW.toUpperCase()}`, 'DaylightSaving Offset', {
                    category: 'DaylightSaving Offset Changes',
                    action: `${dlsNEW.toUpperCase()}`,
                    label: dlsNEW.toUpperCase()
                });
            }
        }
    }
    function trackFileUpload(page, file) {
        if (window.umami) {
            window.umami.track(`File Upload: ${page.toUpperCase()}`, {
                category: 'File Events',
                action: 'Upload',
                label: file
            });
        }
    }
    function trackContactsImport(type, amount) {
        if (window.umami) {
            window.umami.track(`Contact Event: ${type}`, {
                category: 'Contact Events',
                action: `${amount} Contacts Import`
            });
        }
    }
    function trackContactsExport() {
        if (window.umami) {
            window.umami.track(`Contacts Event: Export`, {
                category: 'Contact Events',
                action: `Contacts Export`
            });
        }
    }
    return {
        trackSettingsTimezone: trackSettingsChangeTimezone,
        trackSettingsDLS: trackSettingsChangeDaylightSaving,
        trackUpload: trackFileUpload,
        trackContact: trackContactsImport,
        trackExport: trackContactsExport
    };

})();
