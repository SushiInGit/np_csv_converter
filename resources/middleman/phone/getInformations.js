function findMostFrequentNumber(messages) {                         // Get Main used Number (hint how is the owner)
    const numberCount = {}
    messages.forEach(msg => {
        numberCount[msg.From] = (numberCount[msg.From] || 0) + 1;
        numberCount[msg.To] = (numberCount[msg.To] || 0) + 1;
    });
    let Number = null;
    let maxCount = 0;
    for (const number in numberCount) {
        if (numberCount[number] > maxCount) {
            maxCount = numberCount[number];
            Number = parseInt(number); 
        }
    }
    return { Number, count: maxCount };
}
const simOwner = findMostFrequentNumber(conversationData);

function findConversationInformation(messages) {                        // Gives Infos based on the input
    const IsCall = messages.filter(entry => entry.IsCall === true).length;
    const IsNotCall = messages.filter(entry => entry.IsCall === false).length;
    const OverallCount = messages.length;
    return {callCount: IsCall, messageCount: IsNotCall, everythingCount: OverallCount};
}
const conversationInfo = findConversationInformation(conversationData);

