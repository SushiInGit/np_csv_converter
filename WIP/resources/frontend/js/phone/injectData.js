function simownerName(number) {
    for (const record of backend.dataController.getPhonenumbers()) {
        if (Array.isArray(record.number)) {
            if (record.number.includes(number)) {
                return record.name;
            }
        } else if (record.number === number) {
            return record.name;
        }
    }
    return "Unknown Contact";
}

if (localStorage.text && localStorage.text !== '[]' || localStorage.calls && localStorage.calls !== '[]') {


    document.addEventListener("DOMContentLoaded", function () {
        const bannerRight = document.querySelector(".banner .right.noselect");
        let dialoguePartners = Object.keys(middleman.groupeCommunications.output()).length + 1;
        if (bannerRight) {
            bannerRight.innerHTML = `
            Total Data: ${middleman.phoneData.infoCountOverall(middleman.phoneData.all())}<br>
            Total Calls: ${middleman.phoneData.infoCountIscall(middleman.phoneData.all())}<br> 
            Total Messages: ${middleman.phoneData.infoCountMessage(middleman.phoneData.all())}<br>
            Dialogue Partners: ${dialoguePartners} 
        `;
        }

        const bannerCenter = document.querySelector(".banner .center.noselect");
        if (bannerCenter) {
            bannerCenter.innerHTML = `
            <h2>${simownerName(middleman.simOwner.number())}</h2>
            <h3>${String(middleman.simOwner.number()).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}</h3>
            <b>${processTimestamp(middleman.phoneData.all()[0].Timestamp).date} to ${processTimestamp(middleman.phoneData.all()[(Object.keys(middleman.phoneData.all()).length - 1)].Timestamp).date}</b>
        `;
        }

    });

};