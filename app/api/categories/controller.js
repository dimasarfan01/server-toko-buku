const { Category } = require('../../db/models');

module.exports = {
  async getAllCategories(req, res, next) {
    const { id } = req.user;
    try {
      const categories = await Category.findAll({
        where: { user: id },
        attributes: ['id', 'name'],
      });
      return res.status(200).json({
        message: 'Get all categories success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  },
  async createCategories(req, res, next) {
    const { name } = req.body;
    const { id } = req.user;
    try {
      const categories = await Category.create({
        name,
        user: id,
      });

      return res.status(201).json({
        message: 'Create categories success',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  },
  async updateCategories(req, res, next) {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { name } = req.body;
    try {
      const findCategory = await Category.findOne({
        where: { id, user: userId },
      });
      if (findCategory) {
        const updateCategories = await findCategory.update({ name });
        return res.status(200).json({
          message: 'Update categories success',
          data: updateCategories,
        });
      }
      return res.status(404).json({ message: 'Category not found' });
    } catch (error) {
      next(error);
    }
  },
  async deleteCategories(req, res, next) {
    const { id } = req.params;
    const { id: userId } = req.user;
    try {
      const findCategory = await Category.findOne({
        where: { id, user: userId },
      });
      if (findCategory) {
        const deleteCategories = await findCategory.destroy();
        return res.status(200).json({
          message: 'Delete categories success',
          data: deleteCategories,
        });
      }
      return res.status(404).json({ message: 'Category not found' });
    } catch (error) {
      next(error);
    }
  },
};
