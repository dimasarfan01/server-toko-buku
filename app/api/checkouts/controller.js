const { Transaction, DetailTransaction, Book } = require('../../db/models');
const { handler } = require('../../utils/handler');
const sequelize = require('../../db/models').sequelize;

module.exports = {
  async checkout(req, res, next) {
    const t = await sequelize.transaction();
    const { payload = [] } = req.body;
    const { id: userId } = req.user;
    let errorBookIdNotFound = [];
    let errorBookIdStock = [];
    let updateStock = [];
    const getDate = new Date();
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    try {
      if (payload.length === 0) {
        return handler.error(res.status(400), 'Payload is empty');
      }

      const transaction = await Transaction.create(
        {
          invoice: `T-${randomNumber}${getDate.getTime()}`,
          date: getDate,
          user: userId,
        },
        { transaction: t }
      );

      if (!transaction) {
        return handler.error(
          res.status(400),
          'Transaction failed, please try again'
        );
      }

      for (let i = 0; i < payload.length; i++) {
        const book = await Book.findOne({
          where: { id: payload[i].bookId, user: userId },
        });
        if (!book) {
          errorBookIdNotFound.push(payload[i]?.bookId);
        }
        // if book exist and then check the stock
        if (book?.stock < payload[i].quantity || !book) {
          errorBookIdStock.push(payload[i]?.bookId);
        }
        // create data for detail transaction
        payload[i].transaction = transaction.id;
        payload[i].titleBook = book?.title;
        payload[i].book = book?.id;
        payload[i].imageBook = book?.image;
        payload[i].priceBook = book?.price;
        payload[i].user = userId;
        // update stock in books
        updateStock.push({
          id: payload[i].bookId,
          stock: book?.stock - payload[i].quantity,
          user: userId,
        });
      }

      if (errorBookIdStock.length !== 0) {
        return handler.error(
          res.status(400),
          `book stock is not enough with id : ${errorBookIdStock.join(
            ', '
          )} and user : ${userId}`
        );
      }

      if (errorBookIdNotFound.length !== 0) {
        return handler.error(
          res.status(400),
          `no book with id :  ${errorBookIdNotFound.join(
            ', '
          )} and user : ${userId}`
        );
      }

      await Book.bulkCreate(
        updateStock,
        {
          updateOnDuplicate: ['stock'],
        },
        { transaction: t }
      );

      const detailTranscation = await DetailTransaction.bulkCreate(payload, {
        transaction: t,
      });

      await t.commit();

      return handler.success(
        res.status(201),
        detailTranscation,
        'Success Checkout'
      );
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },
};
