
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

    return {

        isValidISODateCheck: (dateString) => isValidISODateCheck(dateString),

        getAllSheetTypes: () => { return enumSheetTypes }

    }
}();
