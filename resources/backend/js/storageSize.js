var backend = backend ?? {};

backend.storageSize = function () {

    const SETTINGS_KEY = 'np_storageSize';
    const RESERVED_MB = 1;
    const MAX_ALLOWED_MB = 10;

    function getSettings() {
        const settings = localStorage.getItem(SETTINGS_KEY);
        return settings ? JSON.parse(settings) : {};
    }

    function saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function calculateLocalStorageSize() {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const value = localStorage.getItem(key);
                totalSize += key.length * 2;
                totalSize += value.length * 2;
            }
        }
        return totalSize;
    }

    function estimateMaxStorageSize() {
        let testKey = '__test__';
        let testValue = new Array(1024).join('a');
        let maxBytes = 0;
        let maxAllowedBytes = MAX_ALLOWED_MB * 1024 * 1024;

        try {
            while (maxBytes < maxAllowedBytes) {
                localStorage.setItem(testKey, testValue + maxBytes);
                maxBytes += testValue.length * 2;
            }
        } catch (e) {
        }

        localStorage.removeItem(testKey);
        return Math.min(maxBytes, maxAllowedBytes);
    }

    function getMaxStorage() {
        let settings = getSettings();

        if (settings.MAX_STORAGE_MB) {
            return parseFloat(settings.MAX_STORAGE_MB);
        }

        let maxStorageBytes = estimateMaxStorageSize();
        let maxStorageMBCalculated = (maxStorageBytes / (1024 * 1024)) - RESERVED_MB;
        maxStorageMBCalculated = Math.min(maxStorageMBCalculated, MAX_ALLOWED_MB);

        settings.MAX_STORAGE_MB = maxStorageMBCalculated.toFixed(2);
        saveSettings(settings);

        return maxStorageMBCalculated;
    }

    return {
        getMaxStorage: getMaxStorage,
        calculateLocalStorageSize: calculateLocalStorageSize
    };
}();
