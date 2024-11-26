/*
var middleman = middleman ?? {};

middleman.findNames = function (number) {
    const startTime = Date.now();
    for (const record of backend.dataController.getPhonenumbers()) {
        if (Array.isArray(record.number)) {
            if (record.number.includes(number)) {
                return record.name;
            }
        } else if (record.number === number) {
            return record.name;
        }
    }
    return "Unknown Contact";
}

*/
////////////////////////////////////


var middleman = middleman ?? {};

middleman.initializePhoneLookup = function() {
    const startTime = performance.now();

    const phoneArray = backend.dataController.getPhonenumbers() || [];
    middleman.findNames.phoneArray = new Array(phoneArray.length);
    middleman.findNames.phoneLookup = {};

    for (let i = 0; i < phoneArray.length; i++) {
        const contact = phoneArray[i];
        contact.index = i; 
        middleman.findNames.phoneArray[i] = contact;
        middleman.findNames.phoneLookup[contact.number] = contact.name;
    }

    const endTime = performance.now();
    middleman.loadTime = endTime - startTime;
    console.log(`Phone contacts initialized in ${middleman.loadTime.toFixed(2)} ms`);
};

middleman.findNames = function(number) {
    return middleman.findNames.phoneLookup[number] || "Unknown Contact";
};

middleman.initializePhoneLookup();
