const chatDataInput = JSON.parse(excelData);










const chatDataOutput = chatDataInput;

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


const chatData = shortData.concat();


//const chatData = chatDataOutput;