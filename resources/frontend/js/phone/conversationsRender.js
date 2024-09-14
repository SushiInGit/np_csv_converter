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
const groupedCalls = [];
conversationData.forEach(call => {
    const normalizedPair = prioritizeFrom(simOwner.Number,call);
    let existingGroup = groupedCalls.find(group => 
        group.From === normalizedPair.From && group.To === normalizedPair.To
    );

    if (!existingGroup) {
        existingGroup = {
            From: normalizedPair.From,
            To: normalizedPair.To,
            coomunications: []
        };
        groupedCalls.push(existingGroup);
    }

    existingGroup.coomunications.push(call);
});
console.log("aaaaaaaaaaddd", groupedCalls);


// Function to render the list of conversations
function renderConversations(data) {
    const headerconversationList = document.getElementById('header-sidebar');
    const conversationList = document.getElementById('conversation-list');
    conversationList.innerHTML = '';

    data.forEach((conversation, index) => {
        //console.log(conversation);
        const link = document.createElement('div');
        link.classList.add('chat-list-item');
        headerconversationList.innerHTML = `<div>${findNameByNumber(parseInt(simOwner.Number))}'s Phone History</div>`;
        if (parseInt(conversation.From) === parseInt(simOwner.Number)) {
                const filteredData = conversation.filter(item => parseInt(conversation.From) === parseInt(simOwner.Number));
                console.log("AAAAAAAAAAAAA",filteredData);
                link.innerHTML = `
                <div class="chat-info">
                    <div class="name">${findNameByNumberUnknown(conversation.To)}</div>
                    <div class="message-preview">${conversation.To}</div>
                </div>
                <div class="time">✉️ Message: ${(findConversationInformation(filteredData).messageCount)}<br />
                📞 Calls: ${(findConversationInformation(filteredData).callCount)}
                </div>`;
            
        } else {
                const filteredData = groupedCalls.filter(item => parseInt(conversation.To) === parseInt(groupedCalls.to));
                console.log("BBBBBBBBBBBBBBBBBB",filteredData);
                link.innerHTML = `
                <div class="chat-info">
                    <div class="name">${findNameByNumberUnknown(parseInt(conversation.From))}</div>
                    <div class="message-preview">${parseInt(conversation.From)}</div>
                </div>
                <div class="time">✉️ Message: ${(findConversationInformation(filteredData).messageCount)}<br />
                📞 Calls: ${(findConversationInformation(filteredData).callCount)}
                 </div>`;
            

        }
        link.addEventListener('click', () => showConversation(index));
        conversationList.appendChild(link);
    });

}
