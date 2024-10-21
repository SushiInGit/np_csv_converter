var frontend = frontend ?? {};

frontend.renderViews = function () {

    function reorderObject (data) {
        return data.map(newMap => {
            return {
                id: newMap.id,
                comment: newMap.comment,
                from_account_id: newMap.from_account_id,
                from_civ_name: newMap.from_civ_name,
                from_account_name: newMap.from_account_name,
                to_account_id: newMap.to_account_id,
                to_civ_name: newMap.to_civ_name,
                to_account_name: newMap.to_account_name,
                type: newMap.type,
                direction: newMap.direction,
                amount: newMap.amount,
                original_amount: newMap.original_amount,
                tax_percentage: newMap.tax_percentage,
                tax_amount: newMap.tax_amount,
                tax_type: newMap.tax_type,
                tax_id: newMap.tax_id,
                date: newMap.date,
                index: newMap.index
            };
        });
    }
    const bankDataGrouped = middleman.bankData.getGrouped();
    if(!bankDataGrouped){ return; }

    bankDataGrouped.sort((a, b) => {
        return a.to.account_id - b.to.account_id;
    });

    bankDataGrouped.forEach((data) => {

        if (data.to.civ_name === 'null' && data.to.account_id < 100) {
            data.to.civ_name = middleman.stateAccounts(data.to.account_id);
        }
        return data.to.civ_name;
    });
    
    const viewsDiv = document.querySelector(".menu .list.noselect .pov");
    viewsDiv.innerHTML = ``;

    var divAll = document.createElement("div");
    divAll.classList.add("user");
    divAll.classList.add("all");
    divAll.innerHTML = `ALL<br>Transactions`
    divAll.addEventListener("click", function() {

        const allDivs = document.querySelectorAll('.pov .user');
        allDivs.forEach(div => div.classList.remove('active'));
        this.classList.add('active');

        var table = document.querySelector("#bankRecordsTable");
        table.innerHTML = ``;
        //const data = frontend.renderTable(middleman.bankData.get().records);
        const data = frontend.renderTable(reorderObject(middleman.bankData.get().records));


        frontend.renderTable(data).then((table) => {
        }).catch((error) => {
            console.error("Error:", error);
        });
        
    });
    viewsDiv.appendChild(divAll);
    bankDataGrouped.forEach((data) => {
        let divforEach= document.createElement('div');
        divforEach.classList.add("user");
        divforEach.classList.add(data.to.account_id);
        divforEach.innerHTML = `<hr>${middleman.stateAccounts(data.to.account_id, data.to.civ_name)}<br>ID: ${data.to.account_id}`;
       // divforEach.innerHTML = `<hr>${data.to.civ_name}<br>ID: ${data.to.account_id}`;

        divforEach.addEventListener("click", function() {
            const allDivs = document.querySelectorAll('.pov .user');
            allDivs.forEach(div => div.classList.remove('active'));
            this.classList.add('active');

            var table = document.querySelector("#bankRecordsTable");
            table.innerHTML = ``;
            indexGrp = data.groupIndex;
            
            //const dataGrp = frontend.renderTable(middleman.bankData.getGrouped()[indexGrp].records);
            const dataGrp = frontend.renderTable(reorderObject(middleman.bankData.getGrouped()[indexGrp].records));
            frontend.renderTable(dataGrp).then((table) => {
            }).catch((error) => {
                console.error("Error:", error);
            });
            
        });
        viewsDiv.appendChild(divforEach);
    });

}

frontend.renderViews();
