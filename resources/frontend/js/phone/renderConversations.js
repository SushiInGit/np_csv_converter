// Function to find name from phone records
function findNameByNumber(number) {
    // for (const record of contactList) {
    for (const record of backend.dataController.getPhonenumbers()) {
        if (Array.isArray(record.number)) {
            if (record.number.includes(number)) {
                return record.name;
            }
        } else if (record.number === number) {
            return record.name;
        }
    }
    return number;
}

// Function to render the list of conversations
function renderConversations(data, custemIndex, custemFrom) {
    try {
        if ((isNaN(custemIndex) && isNaN(custemFrom)) ||
            (custemIndex === undefined && custemFrom === undefined) ||
            (custemIndex === custemFrom)) {
            const headerconversationList = document.getElementById('header-sidebar');
            const conversationList = document.getElementById('conversation-list');
            conversationList.innerHTML = '';

            data.forEach((conversation, index) => {
                const link = document.createElement('div');
                link.id = `conversation-member`;
                link.classList.add(`conversation${index}`);
                link.classList.add('chat-list-item');
                headerconversationList.innerHTML = `<div>${findNameByNumber(parseInt(simOwner.Number))}'s Phone History</div>`;
                return (conversation?.From === simOwner?.Number || conversation?.To === simOwner?.Number) ? renderConversationsOutput(conversation, index, conversationList, link) : '';
            });
        } else {
            data.forEach((conversation, index) => {
                if (index === custemIndex) {
                    { showLogs(custemIndex, custemFrom, conversation); }
                }
            });
        }
    } catch (error) {
        console.error("renderConversations() Error:", error);
    }
}
function renderConversationsOutput(conversation, index, conversationList, divBox) {
    if (conversation.From === simOwner.Number || conversation.To === simOwner.Number) {
        divBox.innerHTML = `
    <div class="chat-info">
        <div class="name">${findNameByNumber(conversation.To)}</div>
        <div class="message-preview">${conversation.To}</div>
    </div>
    <div class="time">✉️ Message: ${(findConversationInformation(conversation.communications).messageCount)}<br />
    📞 Calls: ${(findConversationInformation(conversation.communications).callCount)}
    </div>`;
    divBox.addEventListener('click', () => showLogs(index, (conversation.To), conversation));
        conversationList.appendChild(divBox);
    } else {
        console.log(`Error: Skipping conversation at index #${index} \nFound a number not associated with the SimOwner: ${simOwner.Number} \nCall details From: ${conversation.From} to: ${conversation.To}`);
    }
}