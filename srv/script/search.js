function searchTable() {
    var input = document.querySelector("#searchInput").value.toLowerCase();
    var rows = document.querySelectorAll("#phoneRecords tr");
    var visibleRowIndex = 0;
    rows.forEach(function(row, index) {
        if (index === 0) return;
        var rowText = row.innerText.toLowerCase();
        if (rowText.includes(input)) {
            row.style.display = ""; 
            if (visibleRowIndex % 2 === 0) {
                row.style.backgroundColor = "#2a2a2a"; 
            } else {
                row.style.backgroundColor = "#1e1e1e"; 
            }
            visibleRowIndex++;
        } else {
            row.style.display = "none"; 
        }
    });
}

const searchInput = document.getElementById('searchInput');

window.onload = function() {
    searchInput.focus();
};

document.addEventListener('keydown', function(event) {
    const ignoredKeys = [
        'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
    ];

    if (!ignoredKeys.includes(event.key)) {
        searchInput.focus();
    }
});