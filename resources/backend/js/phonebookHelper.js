
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

    function uploadNopixelData(data, type) { // Type can be "LL" or "Phone"
        const phonenumberRegex = /^[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*/;

        var dirtyLogArray = data.trim().split("\n").filter(str => str.trim() !== "");

        var firstPhonenumberFoundIndex = dirtyLogArray.findIndex(str => phonenumberRegex.test(str));

        // Skip half records
        if (firstPhonenumberFoundIndex - 2 < 0) {
            dirtyLogArray = dirtyLogArray.slice(firstPhonenumberFoundIndex + 1);
        }
        else {
            dirtyLogArray = dirtyLogArray.slice(firstPhonenumberFoundIndex - 2);
        }

        const phoneNumbers = JSON.parse(localStorage.getItem('phonenumbers')) || [];

        var returnNewRecordsRount = 0;

        for (var i = 0; i < dirtyLogArray.length; i += 3) {
            var j = i;

            // Set default for Phone Contacts
            var phonenumberIndex = j + 2;
            var nameIndex = j + 1;

            // If from LemonList overwrite the default
            if (type == "LL") {
                nameIndex = j;

                if (!phonenumberRegex.test(dirtyLogArray[phonenumberIndex]) && phonenumberRegex.test(dirtyLogArray[phonenumberIndex - 1])) {
                    phonenumberIndex = j + 1;
                    i--;
                }
            }

            // Check if values are valid
            if (!phonenumberRegex.test(dirtyLogArray[phonenumberIndex]) || name == dirtyLogArray[nameIndex]) {
                continue;
            }

            // Create new contact if new
            var name = dirtyLogArray[nameIndex];
            var phonenumber = dirtyLogArray[phonenumberIndex].replace(/\((\d{3})\)\s(\d{3})-(\d{4})/, "$1$2$3");

            if (!phoneNumbers.some(contact => contact.number == phonenumber)) {
                const newContact = {
                    number: Number(phonenumber),
                    name: name
                };

                phoneNumbers.push(newContact);

                returnNewRecordsRount++;
            }
        }

        backend.dataController.savePhonenumbers(phoneNumbers)

        return returnNewRecordsRount;
    }

    return {
        uploadPhonebookData: (data) => uploadPhonebookData(data),

        uploadNopixelPhoneData: (data) => uploadNopixelData(data, "Phone"),

        uploadNopixelLemonListData: (data) => uploadNopixelData(data, "LL")
    }

}();