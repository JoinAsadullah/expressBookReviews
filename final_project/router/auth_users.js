const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [{username:"user1",password:"password"},{username:"user2",password:"password"},{username:"user3",password:"password"}];

const isValid = (username)=>{ //returns boolean
  if(users.some(user => user.username === username)){
    return true;
  }
  else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let user = users.find(user => user.username === username);
  if(password === user.password){
      return true;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password
      },
      'fingerprint_customer',
      { expiresIn: 60 * 60 }
    );

    // Store the accessToken with the same key in the session
    req.session.token = accessToken;
    req.session.username = username;

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.username;
  let book = books[isbn];
  if(book){
    if(book.reviews){
      books[isbn].reviews = {...books[isbn].reviews,[username]:review};
    }
    else{
      books[isbn].reviews = {...books[isbn].reviews,[username]:review};
    }
    return res.status(200).json({message: "Review added successfully"});
  }
  else{
    return res.status(404).json({message: "Book not found"});
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.username;
  let book = books[isbn];
  if(book){
    if(book.reviews){
      delete books[isbn].reviews[username];
    }
    else{
      delete books[isbn].reviews[username];
    }
    return res.status(200).json({message: "Review deleted successfully"});
  }
  else{
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
