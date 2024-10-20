
if (localStorage.bankRecords) {

    function formatDifference(incomingTotal, outgoingTotal) {
        if (typeof incomingTotal === 'number' && typeof outgoingTotal === 'number') {
            const totalDifference = incomingTotal - outgoingTotal;

            return totalDifference >= 0 ? `+$${totalDifference}` : `-$${Math.abs(totalDifference)}`;
        } else {
            throw new Error('???');
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        const bannerRight = document.querySelector(".banner .right.noselect");
        if (bannerRight) {
            const totalDifference = formatDifference(middleman.bankData.get().totalIn, middleman.bankData.get().totalOut);
            bannerRight.innerHTML = `
            Transactions: ${middleman.bankData.get().count} <br>
            Total Income: $${middleman.bankData.get().totalIn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} <br> 
            Total Expense: $${middleman.bankData.get().totalOut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} <br>
            Balance: ${totalDifference.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
        `;
        }

        const earliestRecord = middleman.bankData.get().earliestRecord;
        const latestRecord = middleman.bankData.get().latestRecord;

        const isoDateEarly = new Date(earliestRecord);
        const isoDateEarlyFix = isoDateEarly.toISOString().split('T').join(' ').slice(0, 10);
        const isoDateLate = new Date(latestRecord);
        const isoDateLateFix = isoDateLate.toISOString().split('T').join(' ').slice(0, 10);

        const bannerCenter = document.querySelector(".banner .center.noselect");
        if (bannerCenter) {
            bannerCenter.innerHTML = `
            <h2>${middleman.bankData.get().recordsOwner.account_name} of ${middleman.bankData.get().recordsOwner.civ_name}</h2>
            <h3>ID: ${middleman.bankData.get().recordsOwner.account_id}</h3>
            <b> ${isoDateEarlyFix} to ${isoDateLateFix}</b>
        `;
        }
    });
};
