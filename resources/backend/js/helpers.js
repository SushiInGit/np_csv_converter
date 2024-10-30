
var backend = backend ?? {};

backend.helpers = function () {

    const enumSheetTypes = Object.freeze({
        TEXTS: "texts",
        CALLS: "calls",
        BANKRECORDS: "bankRecords",
        GENERIC: "generic"
    });

    function isValidISODateCheck(dateString) {
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
        return isoDateRegex.test(dateString);
    }

    function sortObjectByKey(arr, key) {
        if (!key) { // Sort if Key is null (like for Bank Upload)
            return arr.sort((a, b) => {
                const isANumeric = /^\d/.test(a);
                const isBNumeric = /^\d/.test(b);
                if (isANumeric && isBNumeric) {
                    return a.localeCompare(b);
                } else if (isANumeric) {
                    return -1; 
                } else if (isBNumeric) {
                    return 1; 
                } else {
                    return a.localeCompare(b); 
                }
            });
         }

        if (key) { // Sort by key
            return arr.sort((a, b) => {
                const valA = a[key];
                const valB = b[key];

                const isANumeric = /^\d+$/.test(valA);
                const isBNumeric = /^\d+$/.test(valB);

                if (isANumeric && isBNumeric) {
                    return valA - valB;
                }

                if (isANumeric) return -1;
                if (isBNumeric) return 1;

                return valA.localeCompare(valB);
            });
        }
    }

    return {
        sortObjectByKey: sortObjectByKey,
        isValidISODateCheck: (dateString) => isValidISODateCheck(dateString),
        getAllSheetTypes: () => { return enumSheetTypes }
    }
}();
