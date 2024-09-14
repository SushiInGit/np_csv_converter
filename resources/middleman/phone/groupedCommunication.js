function prioritizeFrom(simOwner, data) {
    if (data.From === simOwner || data.To === simOwner) {
        return {
            From: simOwner,
            To: data.From === simOwner ? data.To : data.From,
        };
    } else {
        return {
            From: Math.min(data.From, data.To),
            To: Math.max(data.From, data.To)
        };
    }
}
const groupedCommunications = [];
conversationData.forEach(call => {
    const normalizedPair = prioritizeFrom(simOwner.Number,call);
    let existingGroup = groupedCommunications.find(group => 
        group.From === normalizedPair.From && group.To === normalizedPair.To
    );

    if (!existingGroup) {
        existingGroup = {
            From: normalizedPair.From,
            To: normalizedPair.To,
            communications: []
        };
        groupedCommunications.push(existingGroup);
    }

    existingGroup.communications.push(call);
});
