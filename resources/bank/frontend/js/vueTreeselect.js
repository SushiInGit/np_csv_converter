var frontend = frontend ?? {};

frontend.treeselect = function () {
    /**
    * Render Bankrecords from vue + treeselect
    **/
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
            alwayshide: ['indexID'],
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
                const storedColumns = JSON.parse(sessionStorage.getItem('selectedColumns'));
                if (storedColumns) {
                    this.selectedColumns = storedColumns;
                }
            },

            saveSelectedColumns() {
                let data = this.selectedColumns;
                sessionStorage.setItem('selectedColumns', JSON.stringify(data));
            },

            clearSelection() {
                this.selection = [];
            },

            loadColumns() {
                const tableHeaders = document.querySelectorAll('#bankRecordsTable thead th');
                this.options = [];

                tableHeaders.forEach((th) => {
                    if (!this.exceptions.includes(th.id)) {
                        if (!this.alwayshide.includes(th.id)) {
                            this.options.push({
                                id: th.id,
                                label: th.textContent
                            });
                        }
                    }
                });

                this.toggleColumns(this.selectedColumns);
            },

            toggleColumns(selectedColumns) {
                const allColumns = document.querySelectorAll('th, td');

                allColumns.forEach((col) => {
                    col.classList.add('hidden');
                });

                const columnsToShow = selectedColumns.filter(columnClass => !this.alwayshide.includes(columnClass));

                columnsToShow.forEach(columnClass => {
                    const columnsToShow = document.querySelectorAll(`#${columnClass}`);
                    columnsToShow.forEach(col => col.classList.remove('hidden'));
                });

                this.exceptions.forEach(exceptionClass => {
                    const columnsToShow = document.querySelectorAll(`#${exceptionClass}`);
                    //columnsToShow.forEach(col => console.log(col.classList));
                    columnsToShow.forEach(col => col.classList.remove('hidden'));
                });

            },

            highlightDirections() {
                const directionCells = document.querySelectorAll('#bankRecordsTable #direction');
                directionCells.forEach(cell => {
                    if (cell.textContent.trim() === 'in') {
                        cell.classList.add('in');
                    } else if (cell.textContent.trim() === 'out') {
                        cell.classList.add('out');
                    }
                });
            },

            highlightAmounts() {
                const amountCells = document.querySelectorAll('#bankRecordsTable #amount');
                amountCells.forEach((cell, index) => {
                    const directionCell = document.querySelectorAll('#bankRecordsTable #direction')[index];
                    const direction = directionCell.textContent.trim();
                    const rawAmount = parseFloat(cell.textContent.trim().replace(/,/g, ''));

                    if (!isNaN(rawAmount)) {
                        const formattedAmount = rawAmount.toFixed(2);
                        const amount = `${formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                        cell.innerHTML = amount;
                    }

                    if (direction === 'in') {
                        cell.classList.add('amount-in');
                    } else if (direction === 'out') {
                        cell.classList.add('amount-out');
                    }
                });
            },

            highlightAmountsNoTax() {
                const amountCells = document.querySelectorAll('#bankRecordsTable #netAmount');
                amountCells.forEach((cell, index) => {
                    const directionCell = document.querySelectorAll('#bankRecordsTable #direction')[index];
                    const direction = directionCell.textContent.trim();
                    const rawAmount = parseFloat(cell.textContent.trim().replace(/,/g, ''));
                    if (!isNaN(rawAmount)) {
                        const formattedAmount = rawAmount.toFixed(2);
                        const amount = `${formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                        cell.innerHTML = amount;
                    }
                    if (direction === 'in') {
                        cell.classList.add('amount-in');
                    } else if (direction === 'out') {
                        cell.classList.add('amount-out');
                    }
                });
            },

            highlightTaxAmount() {
                const amountCells = document.querySelectorAll('#bankRecordsTable #taxAmount');
                amountCells.forEach((cell, index) => {
                    const directionCell = document.querySelectorAll('#bankRecordsTable #direction')[index];
                    const direction = directionCell.textContent.trim();
                    const rawAmount = parseFloat(cell.textContent.trim().replace(/,/g, ''));
                    if (!isNaN(rawAmount)) {
                        const formattedAmount = rawAmount.toFixed(2);
                        const amount = `${formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                        cell.innerHTML = amount;
                    }

                    if (direction === 'in' && rawAmount !== 0) {
                        cell.classList.add('amount-in');
                    } else if (direction === 'in' && rawAmount === 0) {
                        cell.classList.add('amount-zero-in');
                    } else if (direction === 'out' && rawAmount !== 0) {
                        cell.classList.add('amount-out');
                    } else if (direction === 'out' && rawAmount === 0) {
                        cell.classList.add('amount-zero-out');
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
            <div class="treeselect" id="treeselect">
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
