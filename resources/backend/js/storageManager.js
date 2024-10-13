var backend = backend ?? {};

backend.storageManager = function () {


    function getStorageUsage() {
        const maxStorageMB = backend.storageSize.getMaxStorage();
        const usedBytes = backend.storageSize.calculateLocalStorageSize(); 
        const usedMB = usedBytes / (1024 * 1024);
        const usedPercentage = (usedBytes / (maxStorageMB * 1024 * 1024)) * 100;

        console.log(`Used storage: ${usedMB.toFixed(2)} MB`);
        console.log(`Storage usage: ${usedPercentage.toFixed(2)}%`);

        return {
            usedMB: usedMB.toFixed(2),
            usedPercentage: usedPercentage.toFixed(2)
        };
    }


    function addDataToLocalStorage(key, value) {
        const newItemSize = (key.length * 2) + (value.length * 2); 

        const maxStorageMB = backend.storageSize.getMaxStorage();
        const usedBytes = backend.storageSize.calculateLocalStorageSize();

        if ((usedBytes + newItemSize) > (maxStorageMB * 1024 * 1024)) {
            console.warn("Cannot add new data. LocalStorage limit will be exceeded.");
            return false;
        }
        try {
            backend.dataController.saveData(key, value);

            if (backend.storageSize.calculateLocalStorageSize() > (maxStorageMB * 1024 * 1024)) {
                console.warn("Storage limit exceeded after adding new data.");
                return false;
            }

            return true;
        } catch (e) {
            console.error("Error adding data to LocalStorage:", e);
            return false;
        }
    }

    return {
        getStorageUsage: getStorageUsage,
        addData: addDataToLocalStorage
    };
}();

backend.storageManager.getStorageUsage();