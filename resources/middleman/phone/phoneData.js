var middleman = middleman ?? {};

middleman.phoneData = (function () {
    const strategies = {
        simowner: (number) => backend.storageSelector.searchRecordBySimOwner(number),
        default: () => backend.storageSelector.searchRecord(backend.storageShow.showLastSearch('showPhone'), true, 'last')
    };

    function loadData(dataType, number) {
        const strategy = strategies[dataType] || strategies.default;
        return strategy(number);
    }

    function formatData(data) {
        const texts = data.texts ?? backend.dataController.getData("[]");
        const calls = data.calls ?? backend.dataController.getData("[]");

        return [
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
                CallStart: item.established_at === null ? null : item.established_at,
                CallEnd: item.ended_at
            }))
        ];
    }

    function findConversationInformation(messages) {
        let callCount = 0;
        let messageCount = 0;

        messages.forEach(entry => {
            if (entry.IsCall) {
                callCount++;
            } else {
                messageCount++;
            }
        });

        return { callCount, messageCount, everythingCount: messages.length };
    }

    function autoSwap(number) { //load ALL if empty if number then use allBySimowner
        const dataType = number ? "simowner" : "default";
        const data = loadData(dataType, number);
        return formatData(data);
    }

    return {
        all: () => formatData(loadData("default")),
        allBySimowner: (number) => formatData(loadData("simowner", number)),
        autoSwap,
        infoCountIscall: (messages) => findConversationInformation(messages).callCount,
        infoCountMessage: (messages) => findConversationInformation(messages).messageCount,
        infoCountOverall: (messages) => findConversationInformation(messages).everythingCount
    };
})();


