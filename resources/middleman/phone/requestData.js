var middleman = middleman ?? {};

middleman.requestData = (function () {

    function setDisplay(simOwnerId) {
        sessionStorage.setItem('simOwnerId', simOwnerId);
    }

    function output() {
        const simOwnerId = sessionStorage.getItem('simOwnerId');
        if (simOwnerId) {
            //console.log('simOwnerId:', simOwnerId);
            return middleman.metadata.addObject(middleman.groupeCommunications.output(simOwnerId));
        } else {
            //console.log('No simOwnerId set');
            return middleman.metadata.addObject(middleman.groupeCommunications.output());
        }
    }

    function all() {
        const simOwnerId = sessionStorage.getItem('simOwnerId');
        if (simOwnerId) {
            return middleman.phoneData.allBySimowner(simOwnerId);
        } else {
            return middleman.phoneData.all();;
        }
    }
    return {
        setDisplay: setDisplay,
        output: output,
        all: all
    };

})();

//const simOwnerId = `4209479995`; 
const simOwnerId = ``; 
middleman.requestData.setDisplay(simOwnerId);