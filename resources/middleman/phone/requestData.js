var middleman = middleman ?? {};

middleman.requestData = (function () {

    function setDisplay(simOwnerId) {
        sessionStorage.setItem('simOwnerId', simOwnerId);
    }

    function allMetadata() {
        const simOwnerId = sessionStorage.getItem('simOwnerId');
        if (simOwnerId) {
            return middleman.metadata.addObject(middleman.groupeCommunications.output(simOwnerId));
        } else {
            return middleman.metadata.addObject(middleman.groupeCommunications.output());
        }
    }

    function all() {
        const simOwnerId = sessionStorage.getItem('simOwnerId');
        if (simOwnerId) {
            return middleman.phoneData.allBySimowner(simOwnerId);
        } else {
            return middleman.phoneData.all();
        }
    }
    return {
        all: all,
        allMetadata: allMetadata,
        setDisplay: setDisplay
    };

})();

//const simOwnerId = `4209479995`; 
//const simOwnerId = ``; 
//middleman.requestData.setDisplay(simOwnerId);
