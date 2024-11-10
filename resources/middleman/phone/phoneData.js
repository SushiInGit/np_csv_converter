var middleman = middleman ?? {};

middleman.phoneData = (function () {
    const strategies = {
        simowner: (number) => backend.storageSelector.searchRecordBySimOwner(number),
        default: () => backend.storageSelector.searchRecord(backend.storageShow.showLastSearch('showPhone'), true, 'last')
    };

    function loadData(dataType, number) {

        if (!document.querySelector("#filterDateFrom")) {
        const strategy = strategies[dataType] || strategies.default;
            return strategy(number);
        }
        else {

        var data = strategy(number);

        const allLogs = [...data.calls, ...data.texts];

        const { earliest, latest } = allLogs.reduce((result, log) => {
            const date = new Date(log.initiated_at || log.timestamp);
            if (date < result.earliest) result.earliest = date;
            if (date > result.latest) result.latest = date;
            return result;
        }, { earliest: new Date(allLogs[0].initiated_at || allLogs[0].timestamp), latest: new Date(allLogs[0].initiated_at || allLogs[0].timestamp) });

        document.querySelector("#filterDateFrom").min = earliest.toISOString().split("T")[0];
        document.querySelector("#filterDateFrom").max = latest.toISOString().split("T")[0];
        document.querySelector("#filterDateTo").min = earliest.toISOString().split("T")[0];
        document.querySelector("#filterDateTo").max = latest.toISOString().split("T")[0];

        if (!document.querySelector("#filterDateFrom").value) {
            document.querySelector("#filterDateFrom").value = earliest.toISOString().split("T")[0];
        }
        if (!document.querySelector("#filterDateTo").value) {
            document.querySelector("#filterDateTo").value = latest.toISOString().split("T")[0];
        }

        // Filter data on date range
        var dateRangeFrom = document.querySelector("#filterDateFrom").value
            ? new Date(document.querySelector("#filterDateFrom").value)
            : new Date(0);

        var dateRangeTo = document.querySelector("#filterDateTo").value
            ? new Date(document.querySelector("#filterDateTo").value)
            : new Date();
        dateRangeTo.setHours(23, 59, 59, 999);

        data.calls = data.calls.filter(call => {
            var timestamp = new Date(call.initiated_at);
            return timestamp >= dateRangeFrom && timestamp <= dateRangeTo;
        });

        data.texts = data.texts.filter(text => {
            var timestamp = new Date(text.timestamp);
            return timestamp >= dateRangeFrom && timestamp <= dateRangeTo;
        })
        ////

        return data;
    }
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
                CallEnd: null,
                TimestampCorrupt: item.timestampCorrupt
            })),

            ...calls.map((item, index) => ({
                Index: texts.length + index + 1,
                From: item.call_from,
                To: item.call_to,
                Message: null,
                IsCall: true,
                Timestamp: item.initiated_at,
                CallStart: item.established_at === null ? null : item.established_at,
                CallEnd: item.ended_at,
                TimestampCorrupt: null
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


