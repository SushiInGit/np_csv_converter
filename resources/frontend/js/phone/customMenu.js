var frontend = frontend ?? {};

frontend.customMenu = function () {
    const contextMenu = document.getElementById("context-menu");
    const addContactButton = document.getElementById("add-contact");
    const copyNumberButton = document.getElementById("copy-number");
    const deleteContactButton = document.getElementById("delete-contact"); 
   
    let selectedNumber = "";

    function cleanPhoneNumber(input) {
        const digits = input.match(/\d+/g);

        if (digits) {
            const cleanedNumber = digits.join('');
            if (cleanedNumber.length === 10) {
                return cleanedNumber;
            }
        }
        return null;
    }
    function getContactNameByNumber(contactNumber) {
        const phoneNumbers = JSON.parse(localStorage.getItem('phonenumbers')) || [];
        const existingContact = phoneNumbers.find(contact => contact.number === Number(contactNumber));
        return existingContact ? existingContact.name : null;
    }

    function deleteContact(number) {
        const contactNumber = cleanPhoneNumber(number)
        let phoneNumbers = JSON.parse(localStorage.getItem('phonenumbers')) || [];
        phoneNumbers = phoneNumbers.filter(contact => contact.number !== Number(contactNumber));
        localStorage.setItem('phonenumbers', JSON.stringify(phoneNumbers));
        global.alertsystem('warning', `Deleted contact with number ${number}<br>Reloading now—thank you for your patience.`, 4);
        setTimeout(() => {
            window.location.reload();
        }, 4000);
        contextMenu.style.display = 'none'; 
    }

    function addContact(name, number) {
        const phoneNumbers = JSON.parse(localStorage.getItem('phonenumbers')) || [];
        const contactName = name;
        const contactNumber = cleanPhoneNumber(number)

        if (/^\d{10}$/.test(contactNumber)) {
            const existingName = getContactNameByNumber(contactNumber);

            if (existingName) {
                global.alertsystem('warning', `The number ${number} already exists in contacts with the name ${existingName}.`, 7);
                return;
            }

            const newContact = {
                number: Number(contactNumber),
                name: name
            };

            phoneNumbers.push(newContact);

            localStorage.setItem('phonenumbers', JSON.stringify(phoneNumbers));

            global.alertsystem('success', `Added ${contactName} <br>with number ${contactNumber} to contacts!<br>Loading now—thank you for your patience.`, 4);
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        } else {
            global.alertsystem('error', `Invalid number. Please enter a valid 10-digit phone number.`, 7);
        }

    }

    function copyToClipboard(text) {
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = cleanPhoneNumber(text);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        global.alertsystem('info', `Add number "${cleanPhoneNumber(text)}" to clipboard.`, 7);
    }


    function showContextMenu(event, numberElement) {
        event.preventDefault();

        selectedNumber = numberElement.innerText;
        
        //const phoneRegex = /^(?:\(420\)\s*|\b420\s*|\b420)?(?:\d{3}\s*\d{4}|\d{7})$/;

        //if (phoneRegex.test(selectedNumber)) {
        if (backend.regex.custemMenuPhoneContacts(selectedNumber)) {
            const numberRect = numberElement.getBoundingClientRect();
            const outputRect = document.querySelector('.output').getBoundingClientRect();

            const cleanNumber = cleanPhoneNumber(selectedNumber);
            const userName = getContactNameByNumber(cleanNumber) || "Unknown Contact";

            const userNameElement = document.getElementById("contextName");
            userNameElement.innerText = userName; 

            const existingName = getContactNameByNumber(cleanNumber);
            if (existingName) {
                document.getElementById("name").style.display = 'none';
                document.getElementById("add-contact").style.display = 'none';
                deleteContactButton.style.display = 'block'; 
            } else {
                document.getElementById("name").style.display = 'block';
                document.getElementById("add-contact").style.display = 'block';
                deleteContactButton.style.display = 'none';
            }

            const menuWidth = contextMenu.offsetWidth;
            const menuHeight = contextMenu.offsetHeight;
                        
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;


            let posX = numberRect.left + (numberRect.width / 2) - (menuWidth / 2);
            let posY = numberRect.bottom + 10;
            if (posX + menuWidth > outputRect.right) {
                posX = outputRect.right - menuWidth - 10;
            }
            if (posX < outputRect.left) {
                posX = outputRect.left + 10;
            }

            if (posY + menuHeight > outputRect.bottom) {
                posY = numberRect.top - menuHeight - 10;
            }


            contextMenu.style.display = 'block';
            contextMenu.style.left = `${posX}px`;
            contextMenu.style.top = `${posY}px`;
        } else {
            //alert("Wrong number!");
            return;
        }
    }


    document.body.addEventListener('contextmenu', (e) => {
        if (e.target.tagName.toLowerCase() === 'number') {
            showContextMenu(e, e.target);
        }
    });


    addContactButton.addEventListener('click', () => {
        const name = document.getElementById("name").value;
        if (name && selectedNumber) {
            addContact(name, selectedNumber);
        } else {
            global.alertsystem('error', `Please enter a name.<br>Can't add a contact without a name!`, 7);
        }
        contextMenu.style.display = 'none';
        document.getElementById("name").value = '';
    });


    copyNumberButton.addEventListener('click', () => {
        if (selectedNumber) {
            copyToClipboard(selectedNumber);
        }
        contextMenu.style.display = 'none';
    });

    deleteContactButton.addEventListener('click', () => {
        if (selectedNumber) {
            deleteContact(selectedNumber);
        }
    });

    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
        }
    });
};

frontend.customMenu();
