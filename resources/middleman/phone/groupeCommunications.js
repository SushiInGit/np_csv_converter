
var middleman = middleman ?? {};

middleman.groupeCommunications = function () {
    const simOwner = middleman.simOwner.number();
    const data = middleman.phoneData.all();

    // Set Name for From/To 
    data.forEach(from => {
        const name = middleman.findNames(from.From);
        from.From_Name = name;
    });

    data.forEach(to => {
        const name = middleman.findNames(to.To);
        to.To_Name = name;
    });


    function prioritizeFrom(simOwner, data) {
        if (data.From === simOwner || data.To === simOwner) {
            return {
                From: simOwner,
                To: data.From === simOwner ? data.To : data.From,
            };
        } else {
            return {
                From: Math.min(data.From, data.To),
                To: Math.max(data.From, data.To)
            };
        }
    }

    const groupedCommunications = [];

    let groupIndex = 0;
    data.forEach(call => {
        const normalizedPair = prioritizeFrom(simOwner, call);
        let from, to;

        if (normalizedPair.From === simOwner) {
            from = normalizedPair.From;
            to = normalizedPair.To;
        } else {
            from = normalizedPair.To;
            to = normalizedPair.From;
        }

        let existingGroup = groupedCommunications.find(group =>
            (group.simOwner === from && group.To === to) ||
            (group.simOwner === to && group.To === from)
        );
        if (!existingGroup) {

            existingGroup = {
                groupIndex: groupIndex++,
                simOwner: from,
                To: to,
                communications: []
            };
            groupedCommunications.push(existingGroup);
        }

        existingGroup.communications.push(call);

    });

    return {
        output: () => { return groupedCommunications },
    }

}();