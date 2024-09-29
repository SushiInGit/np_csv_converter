
var frontend = frontend ?? {};

frontend.renderViews = function (phoneGrouped) {

    function findNameByNumber(number) {
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

    phoneGrouped.sort((a, b) => {
        return a.To - b.To;
    });

    phoneGrouped.forEach(conversation => {
        const name = findNameByNumber(conversation.To);
        conversation.Name = name;
    });

    const viewsDiv = document.querySelector(".menu .list.noselect .pov");
    viewsDiv.innerHTML = ``;
    hrCount = 0;
    phoneGrouped.forEach((data) => {
        let divBox = document.createElement('div');
        divBox.classList.add("user");
        divBox.classList.add(data.To);
        if (hrCount === 0) {
            divBox.innerHTML = `${data.Name}<br>${String(data.To).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}`;
            hrCount++;
        } else {
            divBox.innerHTML = `<hr>${data.Name}<br>${String(data.To).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}`;
            hrCount++;
        };

        divBox.addEventListener("click", function () {
            const allDivs = document.querySelectorAll('.pov .user');
            allDivs.forEach(div => div.classList.remove('active'));
            this.classList.add('active');

        });
        viewsDiv.appendChild(divBox);
    });

}

frontend.renderViews(middleman.groupeCommunications.output());


// Function to render the list of conversations
/*
function renderConversationsList(data) {
    console.log(data);
    const viewsDiv = document.querySelector(".menu .list.noselect .pov");
    viewsDiv.innerHTML = ``;
    if (conversation.simOwner === middleman.simOwner.number() || conversation.To === middleman.simOwner.number()) {      

        let divBox= document.createElement('div');
        divBox.classList.add("number");
        divBox.classList.add(conversation.To);
        divBox.innerHTML = `<hr>${findNameByNumber(conversation.To)}<br>${String(conversation.To).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}`;


    divBox.addEventListener('click', () => showLogs(index, (conversation.To), conversation));
    viewsDiv.appendChild(divBox);
    } else {
        console.log(`Error: Skipping conversation at index #${index} \nFound a number not associated with the SimOwner: ${middleman.simOwner.number()} \nCall details From: ${conversation.From} to: ${conversation.To}`);
    }
}


renderConversationsList(middleman.groupeCommunications.output());

*/
