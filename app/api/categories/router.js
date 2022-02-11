const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const {
  getAllCategories,
  createCategories,
  updateCategories,
  deleteCategories,
} = require('./controller');

router.get('/', auth, getAllCategories);
router.post('/', auth, createCategories);
router.put('/:id', auth, updateCategories);
router.delete('/:id', auth, deleteCategories);

module.exports = router;
