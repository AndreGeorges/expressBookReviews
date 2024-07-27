
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  
//return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.get("/auth/all_books", (req, res)=> {
  res.send(books)
  });


// Add a book review
//  https://andregeorges-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/auth/review/4
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
const isbn = req.params.isbn;
const {review} = req.body;
const username = req.session.authorization.username;
console.log("review",review );
console.log("username in function", username)

if (books[isbn]) {
    // Check if the user is logged in
    if (username) {
        // Add the new review or update the existing review
        books[isbn].reviews[username] = review;

        // Send a success response
        res.json({ message: "Review updated successfully", reviews: books[isbn].reviews });
    } else {
        // User not logged in
        res.status(401).json({ message: "User not logged in" });
    }
} else {
    // Book not found
    res.status(404).json({ message: "Book not found" });
}
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    // Check if the book exists
    if (books[isbn]) {
        // Check if the user is logged in
        if (username) {
            // Check if the review exists and belongs to the logged-in user
            if (books[isbn].reviews[username]) {
                // Delete the review
                delete books[isbn].reviews[username];

                // Send a success response
                res.json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
            } else {
                // Review not found or does not belong to the user
                res.status(404).json({ message: "Review not found or not authorized to delete this review" });
            }
        } else {
            // User not logged in
            res.status(401).json({ message: "User not logged in" });
        }
    } else {
        // Book not found
        res.status(404).json({ message: "Book not found" });
    }
});





module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
