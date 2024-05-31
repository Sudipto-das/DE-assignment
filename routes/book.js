
const { auth } = require('./../middleware/index');
const express = require("express");
const router = express.Router();
const { Book,Transaction } = require('./../schema/index');

router.post('/add-books', auth, async (req, res) => {
    const { title, author } = req.body;

    // Validate request body
    if (!title || !author) {
        return res.status(400).json({ message: "Title and author are required" });
    }

    try {
        // Create a new book instance
        const newBook = new Book({
            title,
            author
        });

        await newBook.save();


        res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (error) {

        console.error("Error adding book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update a book
router.put('/update-book/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { title, author } = req.body;

    // Validate request body
    if (!title && !author) {
        return res.status(400).json({ message: "At least one of title or author is required" });
    }

    try {
        // Find the book by ID and update
        const updatedBook = await Book.findByIdAndUpdate(id, { title, author }, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.delete('/delete-book/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        // Find the book by ID and delete
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.put('/borrow-book/:id', auth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Find the book by ID
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.isBorrowed) {
            return res.status(400).json({ message: "Book is already borrowed" });
        }

        // Update the book to mark it as borrowed
        book.isBorrowed = true;
        book.borrowedBy = userId;

        await book.save();

        const transaction = new Transaction({
            book: book._id,
            user: userId,
            type: 'borrow'
        });

        await transaction.save();

        res.status(200).json({ message: "Book borrowed successfully", book });
    } catch (error) {
        console.error("Error borrowing book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.put('/return-book/:id', auth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Find the book by ID
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (!book.isBorrowed || !book.borrowedBy.equals(userId)) {
            return res.status(400).json({ message: "Book is not borrowed by you" });
        }

        // Update the book to mark it as returned
        book.isBorrowed = false;
        book.borrowedBy = null;

        await book.save();

        const transaction = new Transaction({
            book: book._id,
            user: userId,
            type: 'return'
        });

        await transaction.save();

        res.status(200).json({ message: "Book returned successfully", book });
    } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get('/books', auth, async (req, res) => {
    try {
        // Get all books
        const books = await Book.find();
        res.status(200).json({ books });
    } catch (error) {
        console.error("Error retrieving books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/transactions', auth, async (req, res) => {
    try {
        // Get all transactions
        const transactions = await Transaction.find().populate('book').populate('user');
        res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error retrieving transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
