
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
});

const bookSchema = new mongoose.Schema({
    id:String,
    author: String,
    title:String,
    isBorrowed: { type: Boolean, default: false },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
})

const transactionSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['borrow', 'return'], required: true },
    timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);

module.exports = {User,Book,Transaction}