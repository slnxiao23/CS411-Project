from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)  # Avoid using 'type'

@app.route('/add-transaction', methods=['POST'])
def add_transaction():
    description = request.form['description']
    amount = float(request.form['amount'])
    transaction_type = request.form['type']
    new_transaction = Transaction(description=description, amount=amount, transaction_type=transaction_type)
    db.session.add(new_transaction)
    db.session.commit()
    return redirect(url_for('home'))

@app.route('/')
def home():
    transactions = Transaction.query.all()
    return render_template('index.html', transactions=transactions)

@app.route('/delete-transaction/<int:id>')
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    db.session.delete(transaction)
    db.session.commit()
    return redirect(url_for('home'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure this is called within the application context
    app.run(debug=True, port=5002)
