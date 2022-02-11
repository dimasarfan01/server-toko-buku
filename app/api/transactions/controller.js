const { Op } = require('sequelize');
const { Transaction, DetailTransaction } = require('../../db/models');
const { handler } = require('../../utils/handler');

module.exports = {
  async getTransaction(req, res, next) {
    const { keyword = '' } = req.query;
    const { id: userId } = req.user;
    let condition = {
      user: userId,
    };
    try {
      if (keyword !== '') {
        condition = {
          ...condition,
          invoice: { [Op.like]: `%{${keyword}}%` },
        };
      }
      const transaction = await Transaction.findAll({
        where: condition,
        attributes: ['id', 'invoice', 'date'],
        include: {
          model: DetailTransaction,
          as: 'detailTransactions',
        },
      });
      if (!transaction) {
        return handler.error(
          res.status(400),
          'Transaction not found, please try again'
        );
      }
      return handler.success(res.status(200), transaction);
    } catch (error) {
      next(error);
    }
  },
  async getTransactionById(req, res, next) {
    const { id } = req.params;
    const { id: userId } = req.user;
    try {
      const transaction = await Transaction.findOne({
        where: {
          id,
          user: userId,
        },
        attributes: ['id', 'invoice', 'date'],
        include: {
          model: DetailTransaction,
          as: 'detailTransactions',
        },
      });
      if (!transaction) {
        return handler.error(
          res.status(404),
          'Transaction not found, please try again'
        );
      }
      return handler.success(res.status(200), transaction);
    } catch (error) {
      next(error);
    }
  },
};
