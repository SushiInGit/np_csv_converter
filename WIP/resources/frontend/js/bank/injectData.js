document.addEventListener("DOMContentLoaded", function () {
    const bannerRight = document.querySelector(".banner .right.noselect");
    if (bannerRight) {
        bannerRight.innerHTML = `
           Data found: ${middleman.bankData.get().recordsOwner.count} 
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