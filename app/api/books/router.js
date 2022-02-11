const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const {
  getAllBooks,
  createBooks,
  updateBooks,
  deleteBook,
} = require('./controller');

router.get('/', auth, getAllBooks);
router.post('/', auth, createBooks);
router.put('/:id', auth, updateBooks);
router.delete('/:id', auth, deleteBook);

module.exports = router;
