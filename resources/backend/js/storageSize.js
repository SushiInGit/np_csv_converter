var backend = backend ?? {};

backend.storageSize = function () {

    const STORAGE_KEY = 'MAX_STORAGE_MB';
    const RESERVED_MB = 1;
    const MAX_ALLOWED_MB = 20;

    function calculateLocalStorageSize() {
        let totalSize = 0;

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                const value = localStorage.getItem(key);

                totalSize += key.length * 2;
                totalSize += value.length * 2;
            }
        }
        return totalSize; // Return total size in bytes
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
            // We've hit the storage limit or browser limitation
        }

        localStorage.removeItem(testKey);
        return Math.min(maxBytes, maxAllowedBytes);
    }


    function getMaxStorage() {
        let maxStorageMB = localStorage.getItem(STORAGE_KEY);

        if (maxStorageMB) {
            //console.log(`Using stored max storage: ${maxStorageMB} MB (minus ${RESERVED_MB}MB reserved)`);
            return parseFloat(maxStorageMB);
        }

        let maxStorageBytes = estimateMaxStorageSize();
        let maxStorageMBCalculated = (maxStorageBytes / (1024 * 1024)) - RESERVED_MB;
        maxStorageMBCalculated = Math.min(maxStorageMBCalculated, MAX_ALLOWED_MB);
        localStorage.setItem(STORAGE_KEY, maxStorageMBCalculated.toFixed(2));

        //console.log(`Estimated max storage: ${maxStorageMBCalculated.toFixed(2)} MB (max ${MAX_ALLOWED_MB}MB allowed)`);
        return maxStorageMBCalculated;
    }

    return {
        getMaxStorage: getMaxStorage,
        calculateLocalStorageSize: calculateLocalStorageSize
    };
}();