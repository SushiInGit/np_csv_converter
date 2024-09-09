// init table 
function sortTableByColumn(table, column, asc = true) {
	const dirModifier = asc ? 1 : -1;
	const tBody = table.tBodies[0];
	const rows = Array.from(tBody.querySelectorAll("tr"));

    const sortedRows = rows.sort((a, b) => {
		const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
		const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

		return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
	});

	while (tBody.firstChild) {
		tBody.removeChild(tBody.firstChild);
	}

	tBody.append(...sortedRows);
	table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
	table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
	table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);

    searchTable(); // Cleanup for <tr> colors source: search.js
}

// click function -- Sorting 
function initializeSorting() {
    modifyTableHeader();
    // Input Row
    const firstTh = document.querySelector('thead th');
    if (!firstTh.textContent.trim()) {
        firstTh.textContent = 'Row'; 
    }
    // Make it clickable

    document.querySelectorAll(".table-sortable th").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
		const tableElement = headerCell.parentElement.parentElement.parentElement;
		const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
		const currentIsAscending = headerCell.classList.contains("th-sort-asc");

		sortTableByColumn(tableElement, headerIndex, !currentIsAscending, 0, true);
        });
    });
}

// auto generate <thead> from first row , push every other row into <tbody>
function modifyTableHeader() {
    var table = document.getElementById("phoneRecords");
    if (!table || table.rows.length === 0) return; 
    var firstRow = table.rows[0];
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");

    for (var i = 0; i < firstRow.cells.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = firstRow.cells[i].innerHTML; 
        headerRow.appendChild(th); 
    }
    thead.appendChild(headerRow);
    table.insertBefore(thead, table.firstChild);
    table.deleteRow(1);
    var tbody = document.createElement("tbody");
    while (table.rows.length > 1) { 
        tbody.appendChild(table.rows[1]); 
    }

    table.appendChild(tbody); 
    resizeTableHeaderWidths();
}


// Set Table widths on load
function resizeTableHeaderWidths() {
    const thead = document.querySelector('thead');
    const ths = thead.querySelectorAll('th');
    const tableWidth = thead.parentElement.offsetWidth;

    let totalWidth = 0;
    ths.forEach(th => {
        totalWidth += th.offsetWidth;
    });

    ths.forEach(th => {
        const width = (th.offsetWidth / totalWidth) * 100; 
        th.style.width = `${width}%`;
    });
}


