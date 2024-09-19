
var middleman = middleman ?? {};

middleman.phoneData = function () {

    var texts = backend.dataController.getData(backend.helpers.getAllSheetTypes().TEXTS);
    var calls = backend.dataController.getData(backend.helpers.getAllSheetTypes().CALLS);

    const phoneData = [
        ...texts.map((item, index) => ({
            Index: index,
            From: item.number_from,
            To: item.number_to,
            Message: item.message,
            Timestamp: item.timestamp,
            IsCall: false,
            CallStart: null,
            CallEnd: null
        })),

        ...calls.map((item, index) => ({
            Index: texts.length + index + 1,
            From: item.call_from,
            To: item.call_to,
            Message: null,
            IsCall: true,
            Timestamp: item.initiated_at,
            CallStart: item.established_at == "null" ? null : item.established_at,
            CallEnd: item.ended_at
        }))
    ];
    

    function findConversationInformation(messages) {                        // Gives Infos based on the input
        const IsCall = messages.filter(entry => entry.IsCall === true).length;
        const IsNotCall = messages.filter(entry => entry.IsCall === false).length;
        const OverallCount = messages.length;
        return {callCount: IsCall, messageCount: IsNotCall, everythingCount: OverallCount};
    }

    return { 
        all: () => { return phoneData },
        infoCountIscall: (messages) => { return findConversationInformation(messages).callCount },
        infoCountMessage: (messages) => { return findConversationInformation(messages).messageCount },
        infoCountOverall: (messages) => { return findConversationInformation(messages).everythingCount }

    }
}();