const Book = require("../model/Book");
const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

const getAllBooks = async (req, res, next) => {
  let books;
  try {
    books = await Book.find();
  } catch (error) {
    console.log("Error", error);
  }
  if (!books) {
    return res.status(404).json({ message: "No Product Found" });
  }
  return res.status(200).json({ books });
};

const getBookById = async (req, res, next) => {
  const id = req.params.id;
  let book;
  try {
    book = await Book.findById(id);
  } catch (error) {
    console.log("Error", error);
  }
  if (!book) {
    return res.status(404).json({ message: "No Product Found" });
  }
  return res.status(200).json({ book });
};

const addBook = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log("ERROR", err);
    } else {
      const book = new Book({
        name: req.body.name,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        available: req.body.available,
        image: req.file.path,
      });
      if (!book) {
        return res.status(400).json({ message: "Unable To Add Book" });
      }
      await book
        .save()
        .then(() => res.send(book))
        .catch((err) => {
          console.log("Error", err);
          if (err) {
            res.status(400).json({ message: err.message });
          }
        });
    }
  });
};

const updateBook = async (req, res, next) => {
  const id = req.params.id;
  upload(req, res, async (err) => {
    if (err) {
      console.log("ERROR", err);
    } else {
      const book = await Book.findByIdAndUpdate(id, {
        name: req.body.name,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        available: req.body.available,
        image: req.file.path,
      });
      book
        .save()
        .then(() => res.send(book))
        .catch((err) => {
          console.log("Error", err);
          if (err) {
            res.status(404).json({ message: err.message });
          }
        });
    }
  });
};

const deleteBook = async (req, res, next) => {
  const id = req.params.id;
  let book;
  try {
    book = await Book.findByIdAndRemove(id);
  } catch (error) {
    console.log("Error", error);
  }
  if (!book) {
    return res.status(404).json({ message: "No Book Found To Delete" });
  }
  return res.status(200).json({ message: "Book Deleted Successfully" });
};

exports.getAllBooks = getAllBooks;
exports.addBook = addBook;
exports.getBookById = getBookById;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
