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
        const totalDifference = formatDifference(middleman.bankData.get().groupedIncomingTotalAmount, middleman.bankData.get().groupedOutgoingTotalAmount);
        bannerRight.innerHTML = `
            Transactions: ${middleman.bankData.get().count} <br>
            Total Income: +$${middleman.bankData.get().groupedIncomingTotalAmount} <br> 
            Total Expense: -$${middleman.bankData.get().groupedOutgoingTotalAmount} 
            Balance: ${totalDifference}
        `;
    }




    const bannerCenter = document.querySelector(".banner .center.noselect");
    if (bannerCenter) {
        bannerCenter.innerHTML = `
   <h2>${middleman.bankData.get().recordsOwner.account_name} of ${middleman.bankData.get().recordsOwner.civ_name}</h2>
            <h3>Bank-Nr. ${middleman.bankData.get().recordsOwner.account_id}</h3>
   
        `;
    }


});