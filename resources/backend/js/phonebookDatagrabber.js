const excel = {};

for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    const storageKey = `excelSheet${i + 1}`;
    //sessionStorage.removeItem(storageKey);
    const storedData = JSON.parse(value);
    excel[`sheet${i}`] = {storedData};
  }



const rawData1 = excel.sheet0.storedData;
const rawData2 = excel.sheet1.storedData;
const rawData   = rawData1.concat(rawData2);
console.log(rawData);



function groupConversations(data) {
    const conversationMap = {};

    data.forEach(item => {
        const from = item.number_from.toString();
        const to = item.number_to.toString();

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
            timestamp: item.timestamp
        });
    });

    return Object.values(conversationMap);
}

// Convert the raw data into grouped conversations
const groupedConversations = groupConversations(rawData);
const chatData = groupedConversations;


// Sample data 
const phoneRecords = [
    { number: '4209480000', name: "Test" },
    { number: '4209991000', name: "Test2" }, // Duplicate number of Test
    { number: '4208993000', name: "John Doe" },
    { number: '4202008000', name: "Jane Smith" },
    { number: ['4209991000', '4208887000'], name: "Alice White" },
    { number: ['4209991000'], name: "Alice White" },  // Duplicate name and number
    { number: '4202550800', name: "Andi Smith" } // Duplicate name
];
/*
    const shortData = [
        {
            conversation: { number_from: '4209480000', number_to: '4208993000' },
            messages: [
                { number_from: '4209480000', message: 'Hey, how are you?', timestamp: '2024-08-01T07:31:16.000Z' },
                { number_from: '4208993000', message: 'I am good! How about you?', timestamp: '2024-08-01T07:32:16.000Z' },
                { number_from: '420899333300', message: 'I am good! How about you?', timestamp: '2024-08-01T07:32:16.000Z' },
                { number_from: '4208993000', message: 'I am good! How about you?', timestamp: '2024-08-01T07:32:16.000Z' },
                { number_from: '4208993000', message: 'I am good! How about you?', timestamp: '2024-08-01T07:32:16.000Z' },
                { number_from: '4208993000', message: 'I am good! How about you?', timestamp: '2024-08-01T07:32:16.000Z' },
                { number_from: '4208993000', message: 'I am good! How about you?', timestamp: '2024-08-01T07:32:16.000Z' },
                { number_from: '4209480000', message: 'I am doing well, thanks for asking!', timestamp: '2024-08-01T07:35:16.000Z' }
            ]
        },
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
    ]
 
const longDataSpam = [
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }
        ,
        {
            conversation: { number_from: '4209480000', number_to: '4202008000' },
            messages: [
                { number_from: '4209480000', message: 'Did you see the game?', timestamp: '2024-08-02T08:00:16.000Z' },
                { number_from: '4202008000', message: 'Yes, it was great!', timestamp: '2024-08-02T08:05:16.000Z' },
                { number_from: '4209480000', message: 'We should watch together next time.', timestamp: '2024-08-02T08:10:16.000Z' }
            ]
        }  

    ];


const chatData = chatDataOutput;


//const chatData = chatDataOutput;
*/