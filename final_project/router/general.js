const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();
const BASE_URL = 'http://localhost:5000';

// Internal data routes for Axios
public_users.get('/internal/books', (req, res) => {
  res.json(books);
});

public_users.get('/internal/isbn/:isbn', (req, res) => {
  res.json(books[req.params.isbn] || {});
});

public_users.get('/internal/author/:author', (req, res) => {
  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  res.json(result);
});

public_users.get('/internal/title/:title', (req, res) => {
  const result = Object.values(books).filter(
    book => book.title.toLowerCase().includes(req.params.title.toLowerCase())
  );
  res.json(result);
});

// Register
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  users.push({ username, password });
  return res.status(200).json({ message: 'User successfully registered' });
});

// Get all books using Axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(${BASE_URL}/internal/books);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get book by ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      ${BASE_URL}/internal/isbn/${encodeURIComponent(req.params.isbn)}
    );

    if (Object.keys(response.data).length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving book' });
  }
});

// Get books by author using Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      ${BASE_URL}/internal/author/${encodeURIComponent(req.params.author)}
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get books by title using Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      ${BASE_URL}/internal/title/${encodeURIComponent(req.params.title)}
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;