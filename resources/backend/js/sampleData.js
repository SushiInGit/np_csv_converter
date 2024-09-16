// const contactList = [     // {number: int, Name: string}
//   { number: 4208384290, name: 'Tolan Black' },
//   { number: 4202827342, name: 'Flops Rainman' },
//   { number: 4209183663, name: 'Ana Hunter' },
//   { number: 4202532095, name: 'Raiden Four' },
//   { number: 4202275420, name: 'Tweetie Chirpwood' },
//   { number: 4202644517, name: 'Rean Brite' },
//   { number: 4208359104, name: 'Sparky Kane' },
//   { number: 4204026213, name: 'James Malding' },
//   { number: 4201790814, name: 'Taylor Lott' },
//   { number: 4207012843, name: 'Mohammed Momin' },
//   { number: 4200843991, name: 'Tallie Marks' },
//   { number: 4205703232, name: 'Winter Sison' },
//   { number: 4200637817, name: 'Asher Alden' },
//   { number: 4205872170, name: 'Ava Deveraux' },
//   { number: 4207994307, name: 'Daquan Dumas' },
//   { number: 4201656022, name: 'Leah Strong' },
//   { number: 4205514811, name: 'DJ Cooper' },
//   { number: 4205023106, name: 'Denzel Wallace' },
//   { number: 4207790954, name: 'Michael Razzel' },
//   { number: 4200634275, name: 'Pip Squeak' },
//   { number: 4207829279, name: 'Chas Diaz' },
//   { number: 4208004059, name: 'Quinton Omar Bastoni' },
//   { number: 4202019103, name: 'Arya Shah' },
//   { number: 4208992777, name: 'Cau Mau' },
//   { number: 4207218336, name: 'Claire Miles' },
//   { number: 4205896088, name: 'Stuart KnightWolf' },
//   { number: 4203262028, name: 'Shang Liu' },
//   { number: 4203090789, name: 'Sunny Moonstar' },
//   { number: 4208558671, name: 'Peri Wattson' },
//   { number: 4204475414, name: 'Lang Buddha' },
//   { number: 4203434475, name: 'Gheto Kaiba' },
//   { number: 4206537375, name: 'Reverend Mullins' },
//   { number: 4208762855, name: 'Jerry Anderson' },
//   { number: 4200328802, name: 'Capped Tarranova' },
//   { number: 4206819802, name: 'Pedro Gonzales' },
//   { number: 4200327586, name: 'Patar Bellosh' },
//   { number: 4206350299, name: 'Jason McGrath' },
//   { number: 4202047642, name: 'Ashton Sterlingham' },
//   { number: 4204454284, name: 'Viktor Schmidt' },
//   { number: 4203925486, name: 'Joseph Arrowhead' },
//   { number: 4201260846, name: 'Jason Ledson' },
//   { number: 4205449498, name: 'Nick Bagel' },
//   { number: 4208190888, name: 'John Gray' },
//   { number: 4201185096, name: 'Irwin Dundee' },
//   { number: 4203590900, name: 'Joey Toes' },
//   { number: 4203692145, name: 'Luca Bianchi' },
//   { number: 4201418388, name: 'Leonardo DelSilver' },
//   { number: 4204186335, name: 'Marlo Stanfield' },
//   { number: 4202781033, name: 'Marceline Slade' },
//   { number: 4200056849, name: 'Sam Song' },
//   { number: 4201400008, name: 'Miguel Almerion' },
//   { number: 4208825047, name: 'Vince Riggs' },
//   { number: 4202801082, name: 'LulaBelle Lawson' },
//   { number: 4206653268, name: 'Alma Vergara' },
//   { number: 4200504732, name: 'Aubrey Synnefo' },
//   { number: 4205103659, name: 'Victor Fuentez' },
//   { number: 4209025790, name: 'Zuck Cuc' },
//   { number: 4209997217, name: 'Sean Danielson' },
//   { number: 4200290425, name: 'Vincent Villano' },
//   { number: 4209886168, name: 'Cleo Cloak' },
//   { number: 4209479995, name: 'Bruce Baylor' } // Duplicate name
// ];

/*
4208384290 Tolan Black
4202827342 Flops Rainman
4209183663 Ana Hunter
4202532095 Raiden Four
4202275420 Tweetie Chirpwood
4202644517 Rean Brite
4208359104 Sparky Kane
4204026213 James Malding
4201790814 Taylor Lott
4207012843 Mohammed Momin
4200843991 Tallie Marks
4205703232 Winter Sison
4200637817 Asher Alden
4205872170 Ava Deveraux
4207994307 Daquan Dumas
4201656022 Leah Strong
4205514811 DJ Cooper
4205023106 Denzel Wallace
4207790954 Michael Razzel
4200634275 Pip Squeak
4207829279 Chas Diaz
4208004059 Quinton Omar Bastoni
4202019103 Arya Shah
4208992777 Cau Mau
4207218336 Claire Miles
4205896088 Stuart KnightWolf
4203262028 Shang Liu
4203090789 Sunny Moonstar
4208558671 Peri Wattson
4204475414 Lang Buddha
4203434475 Gheto Kaiba
4206537375 Reverend Mullins
4208762855 Jerry Anderson
4200328802 Capped Tarranova
4206819802 Pedro Gonzales
4200327586 Patar Bellosh
4206350299 Jason McGrath
4202047642 Ashton Sterlingham
4204454284 Viktor Schmidt
4203925486 Joseph Arrowhead
4201260846 Jason Ledson
4205449498 Nick Bagel
4208190888 John Gray
4201185096 Irwin Dundee
4203590900 Joey Toes
4203692145 Luca Bianchi
4201418388 Leonardo DelSilver
4204186335 Marlo Stanfield
4202781033 Marceline Slade
4200056849 Sam Song
4201400008 Miguel Almerion
4208825047 Vince Riggs
4202801082 LulaBelle Lawson
4206653268 Alma Vergara
4200504732 Aubrey Synnefo
4205103659 Victor Fuentez
4209025790 Zuck Cuc
4209997217 Sean Danielson
4200290425 Vincent Villano
4209886168 Cleo Cloak
4209479995 Bruce Baylor
*/

/*const conversationData = [   // { From: int, To: int, Message: string, Timestamp: string, IsCall: Boolean, CallStart: string, CallEnd: string },
  { From: 4209479995, To: 4201843991, Message: "Dont give up on me future ex wifey. been busy. 4200843991 (420)2801082 hope your doing well", Timestamp: '2024-08-10T06:42:27.576Z', IsCall: false, CallStart: null, CallEnd: null },
  { From: 4209479995, To: 4202801082, Message: null, Timestamp: '2024-08-31T21:58:18.519Z', IsCall: true, CallStart: '2024-08-17T19:15:14.331Z', CallEnd: '2024-08-17T19:15:20.872Z' },
  { From: 4209479995, To: 4202801082, Message: null, Timestamp: '2024-08-31T22:08:56.173Z', IsCall: true, CallStart: null, CallEnd: null },
  { From: 4200290425, To: 4209466995, Message: null, Timestamp: '2024-08-31T22:10:01.536Z', IsCall: true, CallStart: '2024-09-01T19:15:18.597Z', CallEnd: '2024-09-01T19:15:29.266Z' },
  { From: 4209479995, To: 4200290425, Message: null, Timestamp: '2024-08-31T22:13:49.835Z', IsCall: true, CallStart: null, CallEnd: null },
  { From: 4209479995, To: 4200843991, Message: "Dont give up on me (420)0290425 future ex wifey. been busy. hope your doing well", Timestamp: '2024-08-10T06:42:27.576Z', IsCall: false, CallStart: null, CallEnd: null },
  { From: 4200843951, To: 4209479995, Message: "aww HELLO I've been very busy too", Timestamp: '2024-02-10T10:01:00.136Z', IsCall: false, CallStart: null, CallEnd: null },
  { From: 4200843991, To: 4209479995, Message: "how have you been?", Timestamp: '2024-02-11T17:08:42.933Z', IsCall: false, CallStart: null, CallEnd: null },
  { From: 4209479995, To: 4202801082, Message: null, Timestamp: '2024-02-31T21:58:18.519Z', IsCall: true, CallStart: '2024-08-17T19:15:14.331Z', CallEnd: '2024-08-17T19:15:20.872Z' },
  { From: 4209479995, To: 4202801082, Message: null, Timestamp: '2024-02-31T22:08:56.173Z', IsCall: true, CallStart: null, CallEnd: null },
  { From: 4200290425, To: 4209479995, Message: null, Timestamp: '2024-02-31T22:10:01.536Z', IsCall: true, CallStart: '2024-09-01T19:15:18.597Z', CallEnd: '2024-09-01T19:15:29.266Z' },
  { From: 4209479995, To: 4200290425, Message: null, Timestamp: '2024-02-31T22:13:49.835Z', IsCall: true, CallStart: null, CallEnd: null },
  { From: 4209479995, To: 4200843991, Message: "Dont give up on me future ex wifey. been busy. hope your doing well", Timestamp: '2024-01-10T06:42:27.576Z', IsCall: false, CallStart: null, CallEnd: null },
  { From: 4200843991, To: 4209479995, Message: "aww HELLO I've been very busy too", Timestamp: '2024-01-10T10:01:00.136Z', IsCall: false, CallStart: null, CallEnd: null },
  { From: 4200843991, To: 4209479995, Message: "how have you been?", Timestamp: '2024-01-11T17:08:42.933Z', IsCall: false, CallStart: null, CallEnd: null },
  { From: 4209479995, To: 4202801082, Message: null, Timestamp: '2024-01-31T21:58:18.519Z', IsCall: true, CallStart: '2024-08-17T19:15:14.331Z', CallEnd: '2024-08-17T19:15:20.872Z' },
  { From: 4209479995, To: 4202801082, Message: null, Timestamp: '2024-01-31T22:08:56.173Z', IsCall: true, CallStart: null, CallEnd: null },
  { From: 4200290425, To: 4209479995, Message: null, Timestamp: '2024-01-31T22:10:01.536Z', IsCall: true, CallStart: '2024-09-01T19:15:18.597Z', CallEnd: '2024-09-01T19:15:29.266Z' },
  { From: 4209479995, To: 4203290425, Message: null, Timestamp: '2024-01-31T22:13:49.835Z', IsCall: true, CallStart: null, CallEnd: null },
  { From: 4209479995, To: 4203290425, Message: "REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", Timestamp: '2024-01-31T22:13:49.835Z', IsCall: false, CallStart: null, CallEnd: null },
  { From: 4203290425, To: 4209479995, Message: "EEEEEERRRRRRRRRRRRRRRRRRRRRRRRRRR", Timestamp: '2024-01-31T22:13:49.835Z', IsCall: false, CallStart: null, CallEnd: null }


];*/


