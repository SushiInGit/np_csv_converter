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

    function filterMessages(messages) {
        return {
          calls: messages.filter(item => item.IsCall === true),
          texts: messages.filter(item => item.IsCall === false)
        };
      }

    return {
        all: all,
        allMetadata: allMetadata,
        setDisplay: setDisplay,
        filterMessages: filterMessages
    };

})();

//const simOwnerId = `4209479995`; 
//const simOwnerId = ``; 
//middleman.requestData.setDisplay(simOwnerId);