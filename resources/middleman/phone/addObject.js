var middleman = middleman ?? {};

middleman.metadata = function () {
    function addObject(data) {
        const urlRegex = /\b(?:https?:\/\/|www\.)[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(?:\/\S*)?\b/g;
        const numberRegex = /\d+/g;
        const phoneRegex = /(?:\(?420\)?\s*\d{3}\s*\d{4}|\b420\d{7}\b)/g;

        return data.map(group => {
            let links = [];
            let numbers = [];
            let phones = [];

            group.communications.forEach(comm => {
                if (comm.Message) {

                    const foundUrls = comm.Message.match(urlRegex);
                    if (foundUrls) {
                        links.push({
                            index: comm.Index,
                            url: links.concat(foundUrls)
                        });

                    }

                    const containsNumber = comm.Message.match(numberRegex);
                    if (containsNumber) {
                        numbers.push({
                            index: comm.Index,
                            message: comm.Message
                        });
                    }

                    const foundPhones = comm.Message.match(phoneRegex); 
                    if (foundPhones) {
                        foundPhones.forEach(phone => {
                            phones.push({
                                index: comm.Index, 
                                phone: phone 
                            });
                        });
                    }
                    
                }
            });

            return {
                ...group,
                hasLink: links.length > 0,
                links: links,
                hasNumber: numbers.length > 0,
                numbers: numbers,
                hasPhone: phones.length > 0, 
                phones: phones 
            };
        });

    }
    return {
        addObject: (data) => { return addObject(data) },
    }

}();

//console.table(middleman.metadata.addObject(middleman.groupeCommunications.output()));
