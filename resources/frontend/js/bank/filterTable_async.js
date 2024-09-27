window.onload = function() {
    new Vue({
        el: '#treeselect',
        components: {
            'treeselect': VueTreeselect.Treeselect
        },
        data: {
            options: [],
            selectedColumns: [],
            exceptions: ['comment', 'type', 'direction', 'from_civ_name', 'to_civ_name', 'amount', 'date'], //always show
            rows: [], 
            isLoading: true 
        },
        mounted() {
            this.loadColumns();
            this.loadRows(); 
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
            async loadRows() {
                const allData = await this.fetchData(); 
                for (const rowData of allData) {
                    this.rows.push(rowData);
                    this.$nextTick(() => {
                        this.formatRow(rowData); 
                    });
                    await new Promise(resolve => setTimeout(resolve, 0)); 
                }
                this.isLoading = false; 
            },
            fetchData() {
                return new Promise(resolve => {
                        const data = middleman.bankData.get().records;
                        resolve(data);
                });
            },
            formatRow(rowData) {
                this.highlightDirections();
                this.highlightAmounts();
                //this.formatDatesInTable();
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
            },
            convertDateToLocal(dateString) {
                const date = new Date(dateString);
                return date.toUTCString();
            },
            formatDatesInTable() {
                const rows = document.querySelectorAll('#bankRecordsTable tbody tr');
                rows.forEach(row => {
                    const dateCell = row.querySelector('.date');
                    if (dateCell) {
                        const originalDate = dateCell.innerText;
                        dateCell.innerText = this.convertDateToLocal(originalDate);
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
            <div>
                <treeselect v-model="selectedColumns" :multiple="true" :options="options" placeholder="Filter..."></treeselect>
                                <div v-if="isLoading">Loading...</div>
                <table id="bankRecordsTable">
                    <thead>
                        <tr>
                            <th class="comment">Comment</th>
                            <th class="type">Type</th>
                            <th class="direction">Direction</th>
                            <th class="from_civ_name">From</th>
                            <th class="to_civ_name">To</th>
                            <th class="amount">Amount</th>
                            <th class="date">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in rows" :key="index">
                            <td class="comment">{{ row.comment }}</td>
                            <td class="type">{{ row.type }}</td>
                            <td class="direction">{{ row.direction }}</td>
                            <td class="from_civ_name">{{ row.from_civ_name }}</td>
                            <td class="to_civ_name">{{ row.to_civ_name }}</td>
                            <td class="amount">{{ row.amount }}</td>
                            <td class="date">{{ row.date }}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        `
    });
};
