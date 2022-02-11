const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const useApiV1 = (url, routePath) => app.use(`/api/v1${url}`, routePath);

// router path
const authRoute = require('./app/api/auth/router');
const categoriesRoute = require('./app/api/categories/router');
const booksRoute = require('./app/api/books/router');
const uploadsRoute = require('./app/api/uploads/router');
const checkoutsRoute = require('./app/api/checkouts/router');
const transactionsRoute = require('./app/api/transactions/router');

// app
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
useApiV1('/auth', authRoute);
useApiV1('/categories', categoriesRoute);
useApiV1('/books', booksRoute);
useApiV1('/uploads', uploadsRoute);
useApiV1('/checkouts', checkoutsRoute);
useApiV1('/transactions', transactionsRoute);

module.exports = app;
