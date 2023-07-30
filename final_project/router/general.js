const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(isValid(username)){
    return res.status(400).json({message: "User already exists"});
  }
  else{
    users.push({username: username, password: password});
    return res.status(200).json({message: "User registered successfully"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try { 
    const fetchedBooks = await new Promise(resolve => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });

    res.send(JSON.stringify(fetchedBooks, null, 4));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching books.');
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  let isbn = req.params.isbn;
  let book =await books[isbn];

  if(book){
    res.send(JSON.stringify(book,null,4));
  }
  else{
    res.send("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let author = req.params.author;
  let matchedBooks = await Object.values(books).filter(book => book.author === author);


  if(matchedBooks.length > 0){
    res.send(JSON.stringify(matchedBooks,null,4));
  }
  else{
    res.send("No books found");
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  let title = req.params.title;
  let matchedBooks = await Object.values(books).filter(book => book.title === title);


  if(matchedBooks.length > 0){
    res.send(JSON.stringify(matchedBooks,null,4));
  }
  else{
    res.send("No books found");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  let review = book.reviews;

  if(review){
    res.send(JSON.stringify(review,null,4));
  }
  else{
    res.send("Book not found");
  }
 });

module.exports.general = public_users;
