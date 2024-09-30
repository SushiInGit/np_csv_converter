
var frontend = frontend ?? {};

frontend.renderList = function (phoneGrouped) {

    phoneGrouped.sort((a, b) => {
        return a.To - b.To;
    });
    
    phoneGrouped.forEach(conversation => {
        const name = middleman.findNames(conversation.To);
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
            frontend.renderChat(data);

        });
        viewsDiv.appendChild(divBox);
    });

}

frontend.renderList(middleman.groupeCommunications.output());
