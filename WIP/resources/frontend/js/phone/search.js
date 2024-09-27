    const searchbarText = document.getElementById('searchbar');
    const suggestionsBox = document.getElementById('suggestionsBox');
    const messagesBox = document.getElementById('messagesBox');
    let suggestionSelected = false;

    const searchSyntax = [
        { syntax: "to:", description: "Is number or known name" },
        { syntax: "has:", description: "Is in message" },
        { syntax: "before:", description: "Date before" },
        { syntax: "after:", description: "Date after" }

    ];

    const messages = [
        { user: "@john", content: "Hey there! Check this out: https://example.com", date: "2024-09-24", pinned: false },
        { user: "@jane", content: "Don't forget about the meeting tomorrow!", date: "2024-09-25", pinned: true },
        { user: "@alice", content: "Looking forward to the event!", date: "2024-09-23", pinned: false },
        { user: "@bob", content: "Check this image: image.png", date: "2024-09-22", pinned: false },
        { user: "@support", content: "Here is the support link: https://support.example.com", date: "2024-09-21", pinned: false },
        { user: "@everyone", content: "Update: New features coming soon!", date: "2024-09-20", pinned: false },
        { user: "@alice", content: "I'm on vacation until next week.", date: "2024-09-19", pinned: true },
    ];

    searchbarText.setAttribute('data-placeholder', searchbarText.getAttribute('placeholder'));

    searchbarText.addEventListener('input', () => {
        if (searchbarText.textContent.trim() === "") {
            searchbarText.setAttribute('data-placeholder', searchbarText.getAttribute('placeholder'));
        } else {
            searchbarText.removeAttribute('data-placeholder');
        }
    });

    suggestionsBox.addEventListener('mousedown', function(event) {
        suggestionSelected = true;
    });
    
    suggestionsBox.addEventListener('mouseup', function(event) {
        suggestionSelected = false;
    });

    searchbarText.addEventListener('blur', function() {
        setTimeout(function() {
            if (!suggestionSelected) {
                suggestionsBox.classList.remove('show');
            }
        }, 100); 
    });
    

    searchbarText.addEventListener('input', function() {
        const inputText = this.innerText.toLowerCase();
        showSuggestions(inputText);
        filterMessages(inputText);
        highlightSyntax(inputText);
    });
    searchbarText.addEventListener('focus', function() {
        const inputText = this.innerText.toLowerCase();
        showSuggestions(inputText);
       

    });
     
    searchbarText.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
 

    function showSuggestions(inputText = '') {
        suggestionsBox.innerHTML = '';

        const filteredSuggestions = inputText
            ? searchSyntax.filter(item => item.syntax.startsWith(inputText))
            : searchSyntax;

        if (filteredSuggestions.length > 0) {
            suggestionsBox.classList.add('show');
            filteredSuggestions.forEach(syntaxItem => {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.classList.add('suggestion');
                suggestionDiv.innerHTML = `<span class="syntax">${syntaxItem.syntax}</span> <span class="hint">${syntaxItem.description}</span>`;
                
                suggestionDiv.addEventListener('click', () => {
                    const currentText = searchbarText.innerHTML;
                    searchbarText.innerHTML = `<span class="syntax">${syntaxItem.syntax}</span> ${currentText}`;
                    searchbarText.focus();
                    suggestionsBox.classList.remove('show');
                    highlightSyntax(searchbarText.innerText); 
                });
                
                suggestionsBox.appendChild(suggestionDiv);
            });
        } else {
            suggestionsBox.classList.remove('show');
        }
    }

    function highlightSyntax(inputText) {
        const regex = /(\w+:\s?)/g; 
        searchbarText.innerHTML = inputText.replace(regex, '<span class="syntax">$1</span>\n');
        placeCaretAtEnd(searchbarText); 
    }

    function placeCaretAtEnd(el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function filterMessages(inputText) {
        messagesBox.innerHTML = '';

        const regex = /(\w+):\s*(.+)/g;
        const matches = [...inputText.matchAll(regex)];

        const filteredMessages = messages.filter(message => {
            if (!inputText) return false; 
            
            const searchTerm = inputText.toLowerCase();

            return message.user.toLowerCase().includes(searchTerm) ||
                   message.content.toLowerCase().includes(searchTerm) ||
                   message.date.toLowerCase().includes(searchTerm) ||
                   matches.some(match => {
                       const key = match[1].toLowerCase();
                       const value = match[2].toLowerCase();
                       switch (key) {
                           case 'to':
                               return message.user.toLowerCase().includes(value);
                           case 'has':
                               return message.content.toLowerCase().includes(value);
                           case 'before':
                               return new Date(message.date) < new Date(value);
                           case 'after':
                               return new Date(message.date) > new Date(value);
                           default:
                               return false;
                       }
                   });
        });

        filteredMessages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.innerText = `${message.user}: ${message.content} (${message.date})`;
            messagesBox.appendChild(messageDiv);
        });
    }