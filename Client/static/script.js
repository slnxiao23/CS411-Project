document.addEventListener('DOMContentLoaded', function () {
    // Define initial arrays to store income and expense data
    const incomeData = [];
    const expenseData = [];

    // Variable to hold transactions
    let transactions = [];

    // Function to calculate total income and expenses
    function calculateTotal(data) {
        return data.reduce((acc, val) => acc + val, 0);
    }

    // Create pie chart for financial overview
    const ctx = document.getElementById('financial-chart').getContext('2d');
    const financialChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [
                {
                    label: 'Financial Overview',
                    data: [calculateTotal(incomeData), calculateTotal(expenseData)],
                    backgroundColor: ['green', 'red'],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'right',
            },
        },
    });

    // Function to update the financial summary and chart based on transactions
    function updateFinancialData() {
        const totalIncome = transactions.reduce((acc, transaction) => transaction.type === 'income' ? acc + transaction.amount : acc, 0);
        const totalExpenses = transactions.reduce((acc, transaction) => transaction.type === 'expense' ? acc + transaction.amount : acc, 0);
        const netSavings = totalIncome - totalExpenses;

        document.getElementById('total-income').textContent = totalIncome.toFixed(2);
        document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
        document.getElementById('net-savings').textContent = netSavings.toFixed(2);

        financialChart.data.datasets[0].data = [totalIncome, totalExpenses];
        financialChart.update();
    }

    // Event listener for form submission to add new transaction
    document.getElementById('transaction-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const description = this.querySelector('input[name="description"]').value;
        const amount = parseFloat(this.querySelector('input[name="amount"]').value.replace(/\$|,/g, ''));
        const type = this.querySelector('select[name="type"]').value;

        const newTransaction = {
            id: generateUniqueId(),
            description: description,
            amount: amount,
            type: type
        };
        transactions.push(newTransaction);
        updateFinancialData();
        addTransactionToList(newTransaction);
        this.reset();
    });

    // Function to add transaction to the HTML list
    function addTransactionToList(transaction) {
        const list = document.getElementById('transactions-list').querySelector('ul');
        const item = document.createElement('li');
        item.textContent = `${transaction.description} - $${transaction.amount.toFixed(2)} (${transaction.type})`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function () { removeTransaction(transaction.id); };
        item.appendChild(removeButton);
        list.appendChild(item);
    }

    // Function to remove a transaction by ID
    function removeTransaction(transactionId) {
        transactions = transactions.filter(transaction => transaction.id !== transactionId);
        updateFinancialData();
        document.getElementById('transactions-list').querySelector('ul').innerHTML = '';
        transactions.forEach(addTransactionToList);
    }

    // Utility function to generate a unique ID for each transaction
    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }
});
