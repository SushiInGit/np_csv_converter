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
    middleman.phoneLookup = phoneArray.reduce((lookup, { number, name }) => {
        lookup[number] = name;
        return lookup;
    }, {});

    const endTime = performance.now();
    middleman.loadTime = endTime - startTime;
    console.log(`Phone contacts initialized in ${middleman.loadTime.toFixed(2)} ms`);
};

middleman.findNames = function(number) {
    return middleman.phoneLookup[number] || "Unknown Contact";
};

middleman.initializePhoneLookup();
