
var backend = backend ?? {};

backend.phonebookHelper = function () {

    function uploadPhonebookData(data) {

        const phonenumberRegex = /^[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*/;

        const phoneNumbersArray = data.trim().split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const phoneNumberMatch = line.match(phonenumberRegex);
                if (!phoneNumberMatch)
                    return null;

                const phoneNumber = phoneNumberMatch[0].trim();

                var name = line.replace(phoneNumberMatch[0], '').trim();

                return {
                    number: parseInt(phoneNumber.replace(/\D/g, '')),
                    name: name
                };
            })
            .filter(item => item !== null);

        backend.dataController.savePhonenumbers(phoneNumbersArray)
    }

    function uploadNopixelPhoneData(data) {
        // Data is the plain string from the text area. New lines split by \n

        const phonenumberRegex = /^[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*/;

        var dirtyLogArray = data.trim().split("\n").filter(str => str.trim() !== "").slice(2);

        const phoneNumbers = JSON.parse(localStorage.getItem('phonenumbers')) || [];
        
        for (var i = 0; i < dirtyLogArray.length / 3; i++) {
            var j = i * 3;

            var phonenumber = dirtyLogArray[j + 2].replace(/\((\d{3})\)\s(\d{3})-(\d{4})/, "$1$2$3");
            var name = dirtyLogArray[j + 1];

            if (!phoneNumbers.some(contact => contact.number == phonenumber)) {
                const newContact = {
                    number: Number(phonenumber),
                    name: name
                };

                phoneNumbers.push(newContact);
            }
        }

        backend.dataController.savePhonenumbers(phoneNumbers)
    }

    return {
        uploadPhonebookData: (data) => uploadPhonebookData(data),

        uploadNopixelPhoneData: (data) => uploadNopixelPhoneData(data)
    }

}();