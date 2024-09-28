var frontend = frontend ?? {};

frontend.renderViews = function () {
    const bankDataGrouped = middleman.bankData.getGrouped();
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
        const data = frontend.renderTable(middleman.bankData.get().records);

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
            
            const dataGrp = frontend.renderTable(middleman.bankData.getGrouped()[indexGrp].records);
            frontend.renderTable(dataGrp).then((table) => {
            }).catch((error) => {
                console.error("Error:", error);
            });
            
        });
        viewsDiv.appendChild(divforEach);
    });

}

frontend.renderViews();
