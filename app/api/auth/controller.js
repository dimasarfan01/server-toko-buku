const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async signin(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    try {
      if (user && bcrypt.compareSync(password, user.password)) {
        return res.status(200).json({
          message: 'Sign-in Success',
          data: jwt.sign(
            {
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
              },
            },
            'secret',
            { expiresIn: '1h' }
          ),
        });
      }
      return res.status(403).json({ message: 'Invalid email' });
    } catch (error) {
      next(error);
    }
  },
  async signup(req, res, next) {
    const { name, email, password, confirmedPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      if (password !== confirmedPassword)
        return res.status(403).json({ message: 'Passwords do not match' });
      if (user)
        return res.status(403).json({ message: 'Email already exists' });

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      });
      delete newUser.dataValues.password;
      return res
        .status(201)
        .json({ message: 'Sign-up Success', data: newUser });
    } catch (error) {
      next(error);
    }
  },
};
