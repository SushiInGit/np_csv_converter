
var texts = backend.dataController.getData(backend.helpers.getAllSheetTypes().TEXTS);
var calls = backend.dataController.getData(backend.helpers.getAllSheetTypes().CALLS);
const rawData = [
    ...texts.map(item => ({
        From: item.number_from,
        To: item.number_to,
        Message: item.message,
        Timestamp: item.timestamp,
        IsCall: false,
        CallStart: null,
        CallEnd: null
    })),
    ...calls.map(item => ({
        From: item.call_from,
        To: item.call_to,
        Message: null,
        IsCall: true,
        Timestamp: item.initiated_at,
        CallStart: item.established_at == "null" ? null : item.established_at,
        CallEnd: item.ended_at
    }))
];

// const phoneRecords = contactList;  /// WIP -> at the end Dell
const phoneRecords = backend.dataController.getPhonenumbers();  /// WIP -> at the end Dell
 
//  Filter/Combine/Clear object
function groupConversations(data) {
    const conversationMap = {};

    data.forEach(item => {
        const from = item.From.toString();
        const to = item.To.toString();

        const key = [from, to].sort().join('-');

        if (!conversationMap[key]) {
            conversationMap[key] = {
                conversation: [from, to],
                messages: []
            };
        }
        conversationMap[key].messages.push({
            from: from,
            to: to,
            message: item.message,
            timestamp: item.timestamp || item.initiated_at,
            initiated_at: item.initiated_at,
            established_at: item.established_at,
            ended_at: item.ended_at,
            calltime: item.cakktime
        });
    });
    // Sort messages within each conversation by timestamp
    Object.values(conversationMap).forEach(conversation => {
        conversation.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    return Object.values(conversationMap);
}



