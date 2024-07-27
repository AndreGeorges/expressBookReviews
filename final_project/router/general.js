
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "username or password missing." });

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(books)
});

//get list of books available using Promise callbacks
public_users.get('/books',function(req,res){
    new Promise((resolve,reject)=>{
        resolve(books);
    }).then(data =>{
        res.json(data);
    }).catch(err=>{
        res.status(500).json({message:"Error occured"})
    });
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    
    const isbn = req.params.isbn;
    
    const book = books[isbn];

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }

 });

 //fetch books using isbn and promise
 public_users.get('/isbnprom/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }     
    }).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).json({ message: "Error fetching books" });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    
    const booksByAuthor = [];
    
    for (const isbn in books) {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    }
    
    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by the specified author" });
    }
});

//get books details based on author and promise
public_users.get('/authorprom/:author',function (req, res) {
    const author = req.params.author;
    new Promise((resolve, reject) => {
        const booksByAuthor = [];
    
        for (const isbn in books) {
            if (books[isbn].author === author) {
                booksByAuthor.push(books[isbn]);
            }
        }
        if (booksByAuthor) {
            resolve(booksByAuthor);
        } else {
            reject("no books by this author");
        }     
    }).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).json({ message: "Error fetching book" });
    });
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
 const title = req.params.title;
  const booksByTitle = [];
  
  for (const isbn in books) {
      if (books[isbn].title === title) {
          booksByTitle.push(books[isbn]);
      }
  }
  
  if (booksByTitle.length > 0) {
      res.json(booksByTitle);
  } else {
      res.status(404).json({ message: "No books found with that title" });
  }  
});


//get books details based on title and promise
public_users.get('/titleprom/:title',function (req, res) {
    const title = req.params.title;
    new Promise((resolve, reject) => {
        const booksByTitle = [];
    
        for (const isbn in books) {
            if (books[isbn].title === title) {
                booksByTitle.push(books[isbn]);
            }
        }
        if (booksByTitle) {
            resolve(booksByTitle);
        } else {
            reject("no books with this title");
        }     
    }).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).json({ message: "Error fetching book" });
    });
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 const isbn = req.params.isbn;
    const book = books[isbn];

    if(book){
        res.json(book.reviews);
    } else {
        res.status(404).json({message: "can not find that book"});
    }


  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
