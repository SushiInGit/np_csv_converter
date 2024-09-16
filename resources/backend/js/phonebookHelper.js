
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

    return {
        uploadPhonebookData: (data) => uploadPhonebookData(data)
    }

}();