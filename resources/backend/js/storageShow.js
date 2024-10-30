var backend = backend ?? {};

backend.storageShow = function () {

    const SETTINGS_KEY = 'np_settings';

    function getSettings() {
        const settings = localStorage.getItem(SETTINGS_KEY);
        return settings ? JSON.parse(settings) : {};
    }

    function saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function saveShowPhone(lastRecord) {
        const settings = getSettings();

        settings.showPhone = {
            lastSearch: lastRecord || null
        };

        saveSettings(settings);
    }

    function saveShowBank(lastRecord) {
        const settings = getSettings();

        settings.showBank = {
            lastSearch: lastRecord || null
        };

        saveSettings(settings);
    }

    function saveLastSearchRecord(baseName, useFallback = false) {
        const record = backend.storageSelector.searchRecord(baseName, useFallback, 'last');

        if (record.calls || record.texts) {
            saveShowPhone(baseName);  
        }

        if (record.bank) {
            saveShowBank(baseName);  
        }
    }

    function showLastSearch(option = 'both') {
        const settings = getSettings();

        const showPhoneRecord = settings.showPhone ? settings.showPhone.lastSearch : 'No record saved for showPhone';
        const showBankRecord = settings.showBank ? settings.showBank.lastSearch : 'No record saved for showBank';

        if (option === 'showPhone') {
            return showPhoneRecord;
        }

        if (option === 'showBank') {
            return showBankRecord;
        }

        return {
            showPhone: showPhoneRecord,
            showBank: showBankRecord
        };
    }

    function checkIfSavedRecordsExist() {
        const settings = getSettings();
        const showPhoneRecord = settings.showPhone ? settings.showPhone.lastSearch : null;
        const showBankRecord = settings.showBank ? settings.showBank.lastSearch : null;

        let phone = false;
        if (showPhoneRecord && (localStorage.getItem(`${showPhoneRecord}_calls`) || localStorage.getItem(`${showPhoneRecord}_calls`))) {
            phone = true;
        }

        let bank = false;
        if (showBankRecord && localStorage.getItem(`${showBankRecord}_bankRecords`)) {
            bank = true;
        }

        return {
            phone,
            bank
        };
    }

    return {
        saveLastSearchRecord: saveLastSearchRecord,
        showLastSearch: showLastSearch,
        checkIfExist: checkIfSavedRecordsExist 
    };

}();


//backend.storageShow.saveLastSearchRecord('testrecord', true);

/*
const settings = localStorage.getItem('np_settings');
console.log(JSON.parse(settings));
*/

//console.log(backend.storageShow.showLastSearch());
//console.log(backend.storageShow.showLastSearch('showPhone'));
//console.log(backend.storageShow.showLastSearch('showBank'));