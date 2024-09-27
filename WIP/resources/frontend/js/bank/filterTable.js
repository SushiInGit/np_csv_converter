// Vue Treeselect-Komponente initialisieren
function treeselect () {
    new Vue({
        el: '#treeselect',
        components: {
            'treeselect': VueTreeselect.Treeselect
        },
        data: {
            options: [],
            selectedColumns: [],
            exceptions: ['comment', 'type', 'direction', 'from_civ_name', 'to_civ_name', 'amount', 'date'] //always show
        },
        mounted() {
            this.loadColumns();
            this.highlightDirections();
            this.highlightAmounts();
        },
        methods: {
            loadColumns() {
                const tableHeaders = document.querySelectorAll('#bankRecordsTable thead th');
                tableHeaders.forEach((th) => {
                    if (!this.exceptions.includes(th.className)) {
                        this.options.push({
                            id: th.className,
                            label: th.textContent
                        });
                    }
                });


                this.toggleColumns([]);
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
                    const amount = `${cell.textContent.trim()}`;
                    cell.innerHTML = amount;
                    if (direction === 'in') {
                        cell.classList.add('amount-in');
                    } else if (direction === 'out') {
                        cell.classList.add('amount-out');
                    }
                });
            }
        },
        watch: {
            selectedColumns(newSelection) {
                this.toggleColumns(newSelection);
            }
        },
        template: `
                <treeselect v-model="selectedColumns" :multiple="true" :options="options"></treeselect>
            `
    });
};


Vue.config.warnHandler = function (msg, vm, trace) {
    if (msg.includes('Cannot find element: #treeselect')) {
      return; // Suppress this warning
    }
    console.warn(`[Vue warn]: ${msg}\n${trace}`);
  };