const { Book, Category } = require('../../db/models');
const { Op } = require('sequelize');
const { handler } = require('../../utils/handler');

module.exports = {
  async getAllBooks(req, res, next) {
    const { id } = req.user;
    const { keyword = '', category = '' } = req.query;
    let query = { user: id };
    try {
      if (keyword !== '') {
        query = { ...query, title: { [Op.like]: `%${keyword}%` } };
      }
      if (category !== '') {
        query = { ...query, category: { [Op.like]: `%${category}%` } };
      }
      const books = await Book.findAll({
        where: query,
        include: {
          model: Category,
          as: 'categoryDetails',
          attributes: ['id', 'name'],
        },
      });
      if (!books.length) {
        return res.status(404).json({ message: 'Books not found' });
      }
      return res.status(200).json({
        message: 'Get all books success',
        data: books,
      });
    } catch (error) {
      next(error);
    }
  },
  async createBooks(req, res, next) {
    const { title, category, author, image, price, stock } = req.body;
    const { id } = req.user;
    try {
      const findBook = await Book.findOne({ where: { title, user: id } });
      if (findBook) return handler.error(res.status(400), 'Book already exist');
      const newBook = await Book.create({
        title,
        user: id,
        category,
        author,
        image,
        published: new Date(),
        price,
        stock,
      });
      return handler.success(res.status(201), newBook, 'Create book success');
    } catch (error) {
      next(error);
    }
  },
  async updateBooks(req, res, next) {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { title, category, author, image, price, stock } = req.body;
    try {
      const findBook = await Book.findOne({
        where: { id, user: userId },
      });
      if (findBook) {
        const updateCategories = await findBook.update({
          title,
          category,
          author,
          image,
          price,
          stock,
        });
        return res.status(200).json({
          message: 'Update Books success',
          data: updateCategories,
        });
      }
      return res.status(404).json({ message: 'Books not found' });
    } catch (error) {
      next(error);
    }
  },
  async deleteBook(req, res, next) {
    const { id } = req.params;
    const { id: userId } = req.user;
    try {
      const findBook = await Book.findOne({
        where: { id, user: userId },
      });
      if (findBook) {
        const deleteCategories = await findBook.destroy();
        return res.status(200).json({
          message: 'Delete book success',
          data: deleteCategories,
        });
      }
      return res.status(404).json({ message: 'Book not found' });
    } catch (error) {
      next(error);
    }
  },
};
