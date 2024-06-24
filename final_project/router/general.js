const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//  Task 6
//  Register a new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    
});
//  Task 7
//  Register a new user
public_users.post("/customer", (req,res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Succeccefully logged in" });
    }
    
});


// Task 10 
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList() {
    return new Promise((resolve, reject) => {
        resolve(books);
    })
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getBookList().then(
        (bk) => res.send(JSON.stringify(bk, null, 4)),
        (error) => res.send("denied")
    );
});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn) {
    let book_ = books[isbn];
    return new Promise((resolve, reject) => {
        if (book_) {
            resolve(book_);
        } else {
            reject("Unable to find book!");
        }
    })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn).then(
        (bk) => res.send(JSON.stringify(bk, null, 4)),
        (error) => res.send(error)
    )
});

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author) {
    let output = [];
    return new Promise((resolve, reject) => {
        for (var isbn in books) {
            let book_ = books[isbn];
            if (book_.author === author) {
                output.push(book_);
            }
        }
        resolve(output);
    })
}


//  Task 1
//  Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const bookList = await getBooks(); 
    res.json(bookList); // Neatly format JSON output
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

//  Task 11
// Get book details based on ISBN
const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
};

//  Task 2
//  Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });

//  Task 3 & Task 12
//  Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Task 4 & Task 12
//  Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Task 5 & Task 13
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result.reviews),
        error => res.status(error.status).json({message: error.message})
    );
});

module.exports.general = public_users;