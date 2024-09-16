
var backend = backend ?? {};

backend.phonebookUpload = function () {

    function uploadPhonebookData(data) {

        const phonenumberRegex = /^[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*\d[\s\-\(\)]*/;

        const result = data.trim().split('\n').map(line => {
            const phoneNumberMatch = line.match(phonenumberRegex);
            const phoneNumber = phoneNumberMatch ? phoneNumberMatch[0].trim() : '';

            // Remove the phone number from the line to get the full name
            const fullName = line.replace(phoneNumber, '').trim();

            return {
                phoneNumber: phoneNumber.replace(/\D/g, ''),
                fullName: fullName
            };
        });

        console.log(result)

        backend.dataController.savePhonenumbers(sheetType, cleanData);
    }

    return {
        uploadPhonebookData: (data) => uploadPhonebookData(data)
    }

}();