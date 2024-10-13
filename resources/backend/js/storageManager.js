var backend = backend ?? {};

backend.storageManager = function () {

    const MAX_STORAGE_MB = 3; // Limit of 3 MB
    const MAX_STORAGE_BYTES = MAX_STORAGE_MB * 1024 * 1024; 

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

    // Function to get the used space in MB and percentage of the limit
    function getStorageUsage() {
        const usedBytes = calculateLocalStorageSize(); 
        const usedMB = usedBytes / (1024 * 1024); 
        const usedPercentage = (usedBytes / MAX_STORAGE_BYTES) * 100; 

        console.log(`Used storage: ${usedMB.toFixed(2)} MB`);
        console.log(`Storage usage: ${usedPercentage.toFixed(2)}%`);

        return {
            usedMB: usedMB.toFixed(2),
            usedPercentage: usedPercentage.toFixed(2)
        };
    }

    function isBelowStorageLimit(newItemSize) {
        const usedBytes = calculateLocalStorageSize();
        return (usedBytes + newItemSize) <= MAX_STORAGE_BYTES; 
    }

    function calculateItemSize(key, value) {
        const itemSize = (key.length * 2) + (value.length * 2); 
        return itemSize; 
    }


    function addDataToLocalStorage(key, value) {
        const newItemSize = calculateItemSize(key, value);

        if (!isBelowStorageLimit(newItemSize)) {
            console.warn("Cannot add new data. LocalStorage limit will be exceeded.");
            return false;
        }

        try {
            backend.dataController.saveData(key, value);

            if (!isBelowStorageLimit(0)) { // Check again with no new item
                console.warn("LocalStorage limit exceeded. Consider removing some items.");
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