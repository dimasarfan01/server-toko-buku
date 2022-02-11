const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { getTransaction, getTransactionById } = require('./controller');

router.get('/', auth, getTransaction);
router.get('/:id', auth, getTransactionById);

module.exports = router;
