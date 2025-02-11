var frontend = frontend ?? {};

frontend.popupPhonebook_New = (function () {

    function phonebookEvent(records) {
        const newRecords = records;
        const popupDivName = "import_np_new";
        const content = `
            <div class="numberAddList">
                <ul id="newNumbers"></ul>
            </div>
        `;
        const footer = `
         <button class="np" class="close" onclick="window.location.reload();">Close</button>
        `;

        middleman.popupModel.createPopup(popupDivName, 'List of New-Phone contacts', content, footer);
        setTimeout(() => {
            displayRecords(newRecords)
        }, 50);

    }

    function displayRecords(records) {
        const list = document.getElementById("newNumbers");
        list.innerHTML = "";

        records.forEach(record => {
            const result = searchForNumber(record.number);
            const listItem = document.createElement("li");
            listItem.className = "numberList"

            listItem.innerHTML = `
            <div class="numberbody">
            ${record.name}<br>
            ${String(record.number).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}
            </div>
           
            <div class="recordsFound"> 

            ${Array.isArray(result) && result.length === 1 ?
                    `<hr>
                Record found:<br>
                <ul class="recordListFound">${result.map(item => `<li>${item}</li>`).join('')}</ul>` :
                    ""
                }

            ${Array.isArray(result) && result.length > 1 ?
                    `<hr>
                Records found:<br>
                <ul class="recordListFound">${result.map(item => `<li>${item}</li>`).join('')}</ul>` :
                    ""
                }
            </div>
            `
            list.appendChild(listItem);
        });
    }

    function displayRecordsSolo(number, name) {
        const list = document.getElementById("search-result");
        list.innerHTML = "";
        record = [];
        record.number = number
        record.name = name;
        const result = searchForNumber(record.number);

        list.innerHTML = `
            <div class="recordsFound"> 

            ${Array.isArray(result) && result.length > 0 ?
                `Subpoena(s)-Results found for <br><b><u>${record.name}</u></b>:<br>
                <ul class="recordListFoundSolo">
                ${result.map(item => `<li>${item}</li>`).join('')}
                </ul>` :

                `No Subpoena(s)-Results found for <br><b><u>${record.name}</u></b>!`
            }
            </div>
            `
    }



    function searchForNumber(recordNumber) {
        const results = new Set();

        Object.keys(localStorage).forEach(key => {

            // Check if the key ends with '_calls'
            if (key.endsWith('_calls')) {
                const fixedKey = key.replace(/_calls$/, '').replace(/_/g, ' ');
                const data = localStorage.getItem(key);
                const parsedData = JSON.parse(data);

                parsedData.forEach(callRecord => {
                    if ((parseInt(callRecord.call_to, 10) === parseInt(recordNumber, 10))) {
                        results.add(fixedKey);
                    }
                    if ((parseInt(callRecord.call_from, 10) === parseInt(recordNumber, 10))) {
                        results.add(fixedKey);
                    }
                });
            }

            // Check if the key ends with '_text'
            if (key.endsWith('_texts')) {
                const fixedKey = key.replace(/_texts$/, '').replace(/_/g, ' ');
                const data = localStorage.getItem(key);
                const parsedData = JSON.parse(data);

                parsedData.forEach(textRecord => {
                    if ((parseInt(textRecord.number_to, 10) === parseInt(recordNumber, 10))) {
                        results.add(fixedKey);
                    }
                    if ((parseInt(textRecord.number_from, 10) === parseInt(recordNumber, 10))) {
                        results.add(fixedKey);
                    }
                });
            }
        });

        return [...results];
    }


    return {
        render: phonebookEvent,
        searchForNumber: searchForNumber,
        solo: displayRecordsSolo,
    };
})();