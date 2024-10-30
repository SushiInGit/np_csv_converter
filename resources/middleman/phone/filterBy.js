
var middleman = middleman ?? {};

middleman.filterBy = function () {
    const groupData = middleman.metadata.addObject(middleman.requestData.allMetadata());

    function findCommunicationsByText(data, filter) {
        if (Object.keys(data).length !== 0) {
            let output = data.filter(object => {
                return object.communications.some(communication => {
                    const pointer = communication.Message;
                    return pointer !== null &&
                        JSON.stringify(pointer)
                            .toLowerCase()
                            .includes(filter.toString().toLowerCase());
                });
            });
            return output;
        }
    }

    function strictFilter(data, filter) {
        if (Object.keys(data).length !== 0) {
            const pointer = data ? data[0].communications : null;
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
    };


    //////// search rework v2
    function find_hasNumber(data, filter) {
        if (Array.isArray(data) && data.length > 0) {
            let output = data.filter(object => {
                const trimmedFilter = filter.trim();
                if (trimmedFilter === '' || trimmedFilter === '.') {
                    return object.hasNumber === true;
                }

                if (object.hasNumber) {
                    const outputString = JSON.stringify(object.numbers).toLowerCase();
                    return outputString.includes(trimmedFilter.toLowerCase());
                }
                return false;
            });
            return output;
        }
        return [];
    }

    function find_hasPhone(data, filter) {
        if (Array.isArray(data) && data.length > 0) {
            let output = data.filter(object => {
                const trimmedFilter = filter.trim();
                if (trimmedFilter === '' || trimmedFilter === '.') {
                    return object.hasPhone === true;
                }

                if (object.hasPhone) {
                    const outputString = JSON.stringify(object.phones).toLowerCase();
                    return outputString.includes(trimmedFilter.toLowerCase());
                }
                return false;
            });
            return output;
        }
        return [];
    }

    function find_hasLink(data, filter) {
        if (Array.isArray(data) && data.length > 0) {
            let output = data.filter(object => {
                const trimmedFilter = filter.trim();
                if (trimmedFilter === '' || trimmedFilter === '.') {
                    return object.hasLink === true;
                }

                if (object.hasLink) {
                    const outputString = JSON.stringify(object.links).toLowerCase();
                    return outputString.includes(trimmedFilter.toLowerCase());
                }
                return false;
            });
            return output;
        }
        return [];
    }

    function find_number(data, filter) {
        if (Array.isArray(data) && data.length > 0) {

            let output = data.filter(object => {
                let trimmedFilter = filter.trim().replace(/\D/g, "");

                if (trimmedFilter === "") { return data; }

                return JSON.stringify(object.To)
                    .toLowerCase()
                    .includes(trimmedFilter.toLowerCase());
            });
            return output;
        }
        return [];
    }

    function find_name(data, filter) {
        if (Array.isArray(data) && data.length > 0) {
            let trimmedFilter = filter.trim();

            if (trimmedFilter === ".") { trimmedFilter = ""; }

            let output = data.filter(object => {
                const pointer = object.Name;
                if (object.Name === "Unknown Contact") {
                    return false;
                }

                if (pointer !== false) {
                    return JSON.stringify(pointer)
                        .toLowerCase()
                        .includes(trimmedFilter.toLowerCase());
                }
                return false;
            });
            return output;
        }
        return [];
    }

    function find_unknown(data, filter) {
        if (Array.isArray(data) && data.length > 0) {
            let trimmedFilter = filter.trim();

            if (trimmedFilter === ".") { trimmedFilter = ""; }

            let output = data.filter(object => {
                const pointer = object.Name;
                if (object.Name !== "Unknown Contact") {
                    return false;
                }

                if (pointer !== false) {
                    return JSON.stringify(pointer)
                        .toLowerCase()
                        .includes(trimmedFilter.toLowerCase());
                }
                return false;
            });
            return output;
        }
        return [];
    }

    function find_message(data, filter) {
        if (Array.isArray(data) && data.length > 0) {
            const trimmedFilter = filter.trim();

            let output = data.filter(object => {

                const pointer = object.communications[0]?.Message;

                if (trimmedFilter === '' || trimmedFilter === '.') {
                    return true;
                }

                if (pointer !== null) {
                    return JSON.stringify(pointer)
                        .toLowerCase()
                        .includes(trimmedFilter.toLowerCase());
                }
                return false;
            });
            return output;
        }
        return [];
    }

    function find_noCalls(data, filter) {
        if (Array.isArray(data) && data.length > 0) {
            const trimmedFilter = filter.trim();
            let output = data.filter(object => {
                const filteredCommunications = object.communications.filter(comm => comm.IsCall === false);

                if (filteredCommunications.length === 0) {
                    return false;
                }
                const pointer = object.communications[0]?.Message;

                if (trimmedFilter === '' || trimmedFilter === '.') {
                    return true;
                }

                if (pointer !== null) {
                    return JSON.stringify(pointer)
                        .toLowerCase()
                        .includes(trimmedFilter.toLowerCase());
                }
                return false;
            });
            return output;
        }
        return [];
    }

    function missedCalls(data) {
        let missedCallsList = [];
        const grouped = {};

        data.forEach(object => {
            const communications = object.communications;
            const filtered = communications.filter(comm => {
                return comm.IsCall === true && comm.CallStart === 'null';
            });

            if (filtered.length > 0) {
                missedCallsList = missedCallsList.concat(filtered);
            }
        });

        missedCallsList.forEach(comm => {
            let key;
            if (comm.From === middleman.simOwner.number()) {
                key = `${comm.To}`;
            } else if (comm.To === middleman.simOwner.number()) {
                key = `${comm.From}`;
            } else {
                key = [comm.From, comm.To].sort().join('-');
            }

            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(comm);
        });

        return grouped;
    }

    function defaultSearch(filter) {
        var byCommunicationsByText = findCommunicationsByText(filter);
        var byName = find_name(groupData, filter);
        var byNumber = find_number(groupData, filter);

        const combined = [...byCommunicationsByText, ...byName, ...byNumber];
        const uniqueArray = Array.from(
            new Map(combined.map(item => [item.groupIndex, item])).values()
        );

        return uniqueArray;
    }

    return {
        // Deprecated
        Message: (filter) => { return findCommunicationsByText(groupData, filter) },
        MessageStrict: (filter) => { return strictFilter(findCommunicationsByText(groupData, filter), filter) },
        All: (filter) => { return findCommunicationsByAll(filter) },
        // Deprecated


        Default: (filter) => { return defaultSearch(filter) },

        // Search V2 below
        Messagev2: (filter) => { return findCommunicationsByText(filter) },
        Number: (filter) => { return find_number(groupData, filter) },
        Name: (filter) => { return find_name(groupData, filter) },
        Unknown: (filter) => { return find_unknown(groupData, filter) },
        hasNumber: (filter) => { return find_hasNumber(groupData, filter) },
        hasPhone: (filter) => { return find_hasPhone(groupData, filter) },
        hasLink: (filter) => { return find_hasLink(groupData, filter) },
        hasMessage: (filter) => { return find_message(groupData, filter) },
        noCalls: (filter) => { return find_noCalls(groupData, filter) },
        missedCalls: () => { return missedCalls(groupData) },
    }
}();

//console.log(middleman.filterBy.missedCalls());