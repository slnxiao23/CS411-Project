document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = this.querySelector('input[type="text"]').value;
    const amount = this.querySelector('input[type="number"]').value;
    const type = this.querySelector('select').value;

    const listItem = document.createElement('li');
    listItem.textContent = `${description}: $${amount} (${type})`;

    document.getElementById('transactions-list').querySelector('ul').appendChild(listItem);

    // Reset form
    this.reset();
});
