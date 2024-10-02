const searchbarText = document.getElementById('searchbar');
const suggestionsBox = document.getElementById('suggestionsBox');
const messagesBox = document.getElementById('messagesBox');
let suggestionSelected = false;

const searchSyntax = [
    { syntax: "to:", description: "Search at Number." },
    { syntax: "name:", description: "Search at Name" },
    { syntax: "has:", description: "Included in message." }
];

const messages = middleman.groupeCommunications.output();

searchbarText.setAttribute('data-placeholder', searchbarText.getAttribute('placeholder'));

searchbarText.addEventListener('input', () => {
    if (searchbarText.textContent.trim() === "") {
        searchbarText.setAttribute('data-placeholder', searchbarText.getAttribute('placeholder'));
    } else {
        searchbarText.removeAttribute('data-placeholder');
    }
});

suggestionsBox.addEventListener('mousedown', function (event) {
    suggestionSelected = true;
});

suggestionsBox.addEventListener('mouseup', function (event) {
    suggestionSelected = false;
});

searchbarText.addEventListener('blur', function () {
    setTimeout(function () {
        if (!suggestionSelected) {
            suggestionsBox.classList.remove('show');
        }
    }, 100);
});


searchbarText.addEventListener('input', function () {
    const inputText = this.innerText.toLowerCase();
    showSuggestions(inputText);
    filterMessages(inputText);
    highlightSyntax(inputText);
});
searchbarText.addEventListener('focus', function () {
    const inputText = this.innerText.toLowerCase();
    showSuggestions(inputText);


});

searchbarText.addEventListener('keydown', function (event) {
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
    //messagesBox.innerHTML = '';

    const regex = /(\w+):\s*(.+)/g;
    const matches = [...inputText.matchAll(regex)];


    if (!inputText || inputText.trim() === '') {
        frontend.renderList(middleman.groupeCommunications.output());
        return; 
    }
    if (matches.length === 0) {
        frontend.renderList(middleman.filterBy.All(inputText));
        return;
    } 

    matches.some(match => {
        const key = match[1].toLowerCase();
        const value = match[2].toLowerCase();
        //console.log(key);
        if (key === "to") {
            frontend.renderList(middleman.filterBy.Number(value));
        } else if (key === "has") {
            frontend.renderList(middleman.filterBy.Message(value));
        } else if (key === "name") {
            frontend.renderList(middleman.filterBy.Name(value));
        } 
    });
}
