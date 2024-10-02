var frontend = frontend ?? {};

frontend.treeselect = function () {

    new Vue({
        el: '#treeselect',
        components: {
            'treeselect': VueTreeselect.Treeselect
        },
        data: {
            options: [],
            selection: [],
            selectedColumns: [],
            treeselectKey: 0,
            exceptions: ['comment', 'type', 'from_civ_name', 'to_civ_name', 'amount', 'date'],
        },
        mounted() {
            this.loadColumns();
            this.loadSelectedColumns();
            this.highlightDirections();
            this.highlightAmounts();
            this.highlightAmountsNoTax();
            this.highlightTaxAmount();
        },
        methods: {
            loadSelectedColumns() {
                const storedColumns = sessionStorage.getItem('selectedColumns');
                if (storedColumns) {
                    this.selectedColumns = JSON.parse(storedColumns);
                }
            },
            saveSelectedColumns() {
                sessionStorage.setItem('selectedColumns', JSON.stringify(this.selectedColumns));
            },
            clearSelection() {
                this.selection = [];
            },
            loadColumns() {
                const tableHeaders = document.querySelectorAll('#bankRecordsTable thead th');
                this.options = [];

                tableHeaders.forEach((th) => {
                    if (!this.exceptions.includes(th.className)) {
                        this.options.push({
                            id: th.className,
                            label: th.textContent
                        });
                    }
                });

                this.toggleColumns(this.selectedColumns);
            },
            toggleColumns(selectedColumns) {
                const allColumns = document.querySelectorAll('th, td');

                allColumns.forEach((col) => {
                    col.classList.add('hidden');
                });

                this.exceptions.forEach(exceptionClass => {
                    const columnsToShow = document.querySelectorAll(`.${exceptionClass}`);
                    columnsToShow.forEach(col => col.classList.remove('hidden'));
                });

                selectedColumns.forEach(columnClass => {
                    const columnsToShow = document.querySelectorAll(`.${columnClass}`);
                    columnsToShow.forEach(col => col.classList.remove('hidden'));
                });
            },
            highlightDirections() {
                const directionCells = document.querySelectorAll('#bankRecordsTable .direction');
                directionCells.forEach(cell => {
                    if (cell.textContent.trim() === 'in') {
                        cell.classList.add('in');
                    } else if (cell.textContent.trim() === 'out') {
                        cell.classList.add('out');
                    }
                });
            },
            highlightAmounts() {
                const amountCells = document.querySelectorAll('#bankRecordsTable .amount');
                amountCells.forEach((cell, index) => {
                    const directionCell = document.querySelectorAll('#bankRecordsTable .direction')[index];
                    const direction = directionCell.textContent.trim();
                    const amount = `${(cell.textContent.trim()).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                    cell.innerHTML = amount;
                    if (direction === 'in') {
                        cell.classList.add('amount-in');
                    } else if (direction === 'out') {
                        cell.classList.add('amount-out');
                    }
                });
            },
            highlightAmountsNoTax() {
                const amountCells = document.querySelectorAll('#bankRecordsTable .original_amount');
                amountCells.forEach((cell, index) => {
                    const directionCell = document.querySelectorAll('#bankRecordsTable .direction')[index];
                    const direction = directionCell.textContent.trim();
                    const amount = `${cell.textContent.trim().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                    cell.innerHTML = amount;
                    if (direction === 'in') {
                        cell.classList.add('amount-in');
                    } else if (direction === 'out') {
                        cell.classList.add('amount-out');
                    }
                });
            },
            highlightTaxAmount() {
                const amountCells = document.querySelectorAll('#bankRecordsTable .tax_amount');
                amountCells.forEach((cell, index) => {
                    const directionCell = document.querySelectorAll('#bankRecordsTable .direction')[index];
                    const direction = directionCell.textContent.trim();
                    const amount = `${cell.textContent.trim().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                    cell.innerHTML = amount;
                    if (direction === 'in') {
                        cell.classList.add('amount-in');
                    } else if (direction === 'out') {
                        cell.classList.add('amount-out');
                    }
                });
            },
            loadNewData(newData) {
                const sortedData = this.sortData(newData);
                this.updateTable(sortedData);
                this.loadColumns();
                this.toggleColumns(this.selectedColumns);

                this.highlightDirections();
                this.highlightAmounts();
                this.highlightAmountsNoTax();
                this.highlightTaxAmount();
            },
            updateTable(newData) {
                const tableBody = document.querySelector('#bankRecordsTable tbody');
                tableBody.innerHTML = '';

                newData.forEach(item => {
                    const row = document.createElement('tr');
                    const columns = Object.keys(item);

                    columns.forEach(column => {
                        const cell = document.createElement('td');
                        cell.className = column;
                        cell.textContent = item[column];
                        row.appendChild(cell);
                    });

                    tableBody.appendChild(row);
                });

                this.toggleColumns(this.selectedColumns);
            }
        },
        watch: {
            selectedColumns(newSelection) {
                this.toggleColumns(newSelection);
                this.saveSelectedColumns();
            }
        },
        template: `
            <div>
                <treeselect v-model="selectedColumns" :multiple="true" :options="options" :key="treeselectKey"></treeselect>
            </div>
        `
    });
}

Vue.config.warnHandler = function (msg, vm, trace) {
    if (msg.includes('Cannot find element: #treeselect')) {
        return;
    }
    console.warn(`[Vue warn]: ${msg}\n${trace}`);
};
