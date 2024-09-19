
var middleman = middleman ?? {};

middleman.filterBy = function () {
    const groupData = middleman.groupeCommunications.output()

    function findCommunicationsByNumber(data, filter) {
        let output = data.filter(object => {
            return JSON.stringify(object.To)
                .toString()
                .toLowerCase()
                .includes(filter);
        });
        return output;
    }

    function findCommunicationsByText(data, filter) {
        let output = data.filter(object => {
            const pointer = object.communications[0].Message;

            if (pointer !== null) {
                return JSON.stringify(pointer)
                    .toString()
                    .toLowerCase()
                    .includes(filter.toString().toLowerCase());
            }
        });
        return output;
    }

    function strictFilter(data, filter) {
        const pointer = data[0].communications;
        let output = pointer.filter(object => {
            
            if (object.Message.includes(filter.toString().toLowerCase()) === true) {
                   if (pointer !== null) {
                    return JSON.stringify(pointer)
                        .toString()
                        .toLowerCase()
                        .includes(filter.toString().toLowerCase());
                }
            }
        });
        return output;
    };

    ////////// ALL Search
    function findCommunicationsByAll(filter) { // find + remove Dupes + sort it by groupIndex again (if its a number in the text and as phonenumber becouse i cancat it =] )
        const allData = findCommunicationsByNumber(groupData, filter).concat(findCommunicationsByText(groupData, filter));
        const ids = allData.map(({ groupIndex }) => groupIndex);
        const filtered = allData.filter(({ groupIndex }, index) => !ids.includes(groupIndex, index + 1));
        return filtered.sort(function (a, b) { return (a.groupIndex - b.groupIndex); });;
    }

    return {
        Number: (filter) => { return findCommunicationsByNumber(groupData, filter) },
        Message: (filter) => { return findCommunicationsByText(groupData, filter) },
        MessageStrict: (filter) => { return strictFilter(findCommunicationsByText(groupData, filter), filter) },
        All: (filter) => { return findCommunicationsByAll(filter) }
    }
}();