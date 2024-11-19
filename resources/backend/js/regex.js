var backend = backend ?? {};

backend.regex = function () {

    function validatePhoneNumber(line, patterns) {                  // Regex Array Function
        for (const pattern of patterns) {
            if (pattern.test(line)) {
                return true; 
            }
        }
        return false; 
    }

    const phoneBookRegex = [                                        // Used in: popupPhonebook.js
        /^(420\d{7}|\(420\)\s?\d{3}\s?\d{4}|\d{10})\s*(.+)$/,       //Whitelist
        /^(690\d{7}|\(690\)\s?\d{3}\s?\d{4}|\d{10})\s*(.+)$/        //Public
    ];

    const custemMenuRegex = [                                       // Used in: customMenu.js
        /^(?:\(420\)\s*|\b420\s*|\b420)?(?:\d{3}\s*\d{4}|\d{7})$/,  //Whitelist
        /^(?:\(690\)\s*|\b690\s*|\b690)?(?:\d{3}\s*\d{4}|\d{7})$/   //Public
    ];

    function addContactValidCheck(number) {                         // Used in popupPhoneOverview.js
        if (number.length !== 10) {
            return {
                isValid: false,
                message: "Phone number must be exactly 10 digits long."
            };
        }
        if (!number.startsWith("420") && !number.startsWith("690")) {
            return {
                isValid: false,
                message: "Phone number must start with 420 or 690."
            };
        }
        return { isValid: true, message: "Phone number is valid." };
    }

    function addObjectRegex() {                                     // Used in: addObject.js
        return /(?:\(?(?:420|690)\)?\s*\d{3}\s*\d{4}|\b(?:420|690)\d{7}\b)/g;
    }

    function addHtmlTagsRegex() {                                   // Used in: addhtmltags.js
        return /\b(?:420|690)\d{7}\b/g;
    }

    function phoneRecordshelper() {                                 // Used in: phoneRecordsHelper.js
        return /^(?:(?:420|690)\d{7}|\((?:420|690)\)\s?\d{3}\s?\d{4}|\d{10})$/;
    }

    return {
        importPhoneContacts: (line) => { return validatePhoneNumber(line, phoneBookRegex) },
        custemMenuPhoneContacts: (line) => { return validatePhoneNumber(line, custemMenuRegex) },
        addContactValidCheck: addContactValidCheck,
        addObjectRegex: addObjectRegex,
        addHtmlTagsRegex: addHtmlTagsRegex,
        phoneRecordshelper: phoneRecordshelper
    }; 
}();