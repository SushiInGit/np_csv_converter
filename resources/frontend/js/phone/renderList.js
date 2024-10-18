
var frontend = frontend ?? {};

frontend.renderList = function (phoneGrouped) {

    
    phoneGrouped.sort((a, b) => {
        return a.To - b.To;
    });

    const viewsDiv = document.querySelector(".menu .list.noselect .pov");
    viewsDiv.innerHTML = ``;
    hrCount = 0;

    phoneGrouped.forEach((data) => {
        let divBox = document.createElement('div');
        divBox.classList.add("user");
        divBox.classList.add(`nr__${data.To}`);
        divBox.classList.add(`id__${data.groupIndex}`);

        if (hrCount === 0) {
            divBox.innerHTML = `${data.Name}<br>${String(data.To).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}`;
            hrCount++;
        } else {
            divBox.innerHTML = `<hr>${data.Name}<br>${String(data.To).replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2 $3")}`;
            hrCount++;
        };

        divBox.addEventListener("click", function () {

            const searchbarText = document.getElementById('searchbar');
            if (searchbarText.innerHTML.startsWith('<span class="syntax">no_calls: </span> ')) {
                if (Array.isArray(data.communications)) {
                    const filteredCommunications = data.communications.filter(comm => comm.IsCall === false);
                    const result = {
                        ...data,
                        communications: filteredCommunications
                    };

                    frontend.renderChat(result);
                } else {
                    return;
                }

            } else if (searchbarText.innerHTML.startsWith('<span class="syntax">has_phone_strict: </span> ')) {
                if (Array.isArray(data.communications)) {
                    const phoneIndices = new Set(data.phones.map(phone => phone.index));
                    const filteredCommunications = data.communications.filter(comm => phoneIndices.has(comm.Index));

                    const result = {
                        ...data,
                        communications: filteredCommunications
                    };

                    frontend.renderChat(result);
                } else {
                    return;
                }
             
            } else if (searchbarText.innerHTML.startsWith('<span class="syntax">has_number_strict: </span> ')) {
                if (Array.isArray(data.communications)) {
                    const numberIndices = new Set(data.numbers.map(number => number.index));
                    const filteredCommunications = data.communications.filter(comm => numberIndices.has(comm.Index));

                    const result = {
                        ...data,
                        communications: filteredCommunications
                    };

                    frontend.renderChat(result);
                } else {
                    return;
                }
                
             } else if (searchbarText.innerHTML.startsWith('<span class="syntax">has_number_strict: </span> ')) {
                if (Array.isArray(data.communications)) {
                    const numberIndices = new Set(data.numbers.map(number => number.index));
                    const filteredCommunications = data.communications.filter(comm => numberIndices.has(comm.Index));

                    const result = {
                        ...data,
                        communications: filteredCommunications
                    };

                    frontend.renderChat(result);
                } else {
                    return;
                }
                                       
            } else {
                const allDivs = document.querySelectorAll('.pov .user');
                allDivs.forEach(div => div.classList.remove('active'));
                this.classList.add('active');
                frontend.renderChat(data);
            }

        });
        viewsDiv.appendChild(divBox);
    });

}
//const simOwnerId = `4209479995`; 
const simOwnerId = ``; 
frontend.renderList(middleman.metadata.addObject(middleman.groupeCommunications.output(simOwnerId)));