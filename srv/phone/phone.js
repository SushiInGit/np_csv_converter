// Function to format the timestamp
function formatDate(timestamp) {
    const date = new Date(timestamp);
    //return date.toISOString();
    return date.toLocaleString();

}

// Function to render the list of conversations
function renderConversations() {
    const conversationList = document.getElementById('conversation-list');
    conversationList.innerHTML = '';

    chatData.forEach((conversation, index) => {
        const link = document.createElement('div');
        link.classList.add('chat-list-item');
        
        link.innerHTML = `
            <div class="chat-info">
                <div class="name">${findNameByNumber(conversation.conversation.number_from)} to ${findNameByNumber(conversation.conversation.number_to)}</div>
                <div class="message-preview">Click to view conversation</div>
            </div>
            <div class="time">Last massage: ${formatDate(new Date(conversation.messages[0].timestamp))}</div>
        `;
        
        link.addEventListener('click', () => showConversation(index));
        conversationList.appendChild(link);
    });
}

// Function to display a selected conversation
function showConversation(index) {
    const chatBox = document.getElementById('chat-box');
    const header = document.getElementById('chat-header');
    const conversation = chatData[index];

    // Set chat header information
    header.querySelector('.name').textContent = findNameByNumber(conversation.conversation.number_from);
    header.querySelector('.status').textContent = `Chat to ${findNameByNumber(conversation.conversation.number_to)}`;
    
    chatBox.innerHTML = '';  // Clear previous messages

    conversation.messages.forEach(chat => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(chat.number_from === conversation.conversation.number_from ? 'from' : 'to');
        
        const textDiv = document.createElement('div');
        textDiv.textContent = chat.message;
        
        const timestampDiv = document.createElement('div');
        timestampDiv.classList.add('timestamp');
        timestampDiv.textContent = formatDate(chat.timestamp);

        const numberDiv = document.createElement('div');
        numberDiv.classList.add('number');
        numberDiv.textContent = "📞";
        numberDiv.textContent += (chat.number_from === conversation.conversation.number_from ? 'from' : 'to');
        numberDiv.textContent += "\n";
        numberDiv.textContent += (chat.number_from);

        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(timestampDiv);
        messageDiv.appendChild(numberDiv);

        chatBox.appendChild(messageDiv);
    });
}

// Function to find name from phone records
function findNameByNumber(number) {
    const record = phoneRecords.find(entry => entry.number === number);
    return record ? record.name : number;
}

// Initialize the conversation list on page load
renderConversations();