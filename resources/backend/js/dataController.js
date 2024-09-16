
var backend = backend ?? {};

backend.dataController = function () {

    function getDataFromLocalStorage(sheetType) {
        return JSON.parse(localStorage.getItem(sheetType) ?? "[]");
    }

    function saveDataToLocalStorage(key, value) {
        if (typeof value === 'string' && value.trim() !== '') {
            localStorage.setItem(key, value);
        }
        else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    function removeDataFromLocalStorage(sheetType) {

        if (typeof variable === 'string' && variable.trim() !== '') {
            localStorage.removeItem(sheetType);
        } else {
            Object.values(backend.helpers.getAllSheetTypes()).forEach((type) => {
                localStorage.removeItem(type);
            })
        }
    }

    function savePhonenumbersToLocalStorage(value) {
        localStorage.setItem("phonenumbers", JSON.stringify(value));
    }

    function getPhonenumbersFromLocalStorage() {
        return JSON.parse(localStorage.getItem("phonenumbers") ?? "[]");
    }

    return {

        getData: (key) => { return getDataFromLocalStorage(key) },

        saveData: (key, value) => saveDataToLocalStorage(key, value),

        clearData: () => removeDataFromLocalStorage(),

        clearDataBySheetType: (key) => removeDataFromLocalStorage(key),

        savePhonenumbers: (phonuNumbers) => savePhonenumbersToLocalStorage(phonuNumbers),

        getPhonenumbers: () => getPhonenumbersFromLocalStorage()

    }
}();
