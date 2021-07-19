const { validationResult } = require('express-validator');

const models = require('../models');
const { jwt } = require('../utils');
const config = require('../config/config');

module.exports = {

  get: {
    login: function (req, res, next) {
      res.render('login.hbs');
    },

    register: function (req, res, next) {
      res.render('register.hbs');
    },
    logout: function (req, res) {
      const token = req.cookies[config.cookie];

      models.TokenBlackList.create({ token }).then(() => {
        res.clearCookie(config.cookie).redirect('/');
      });
    }
  },

  post: {
    login: async function (req, res, next) {
      const { username, password } = req.body;

      try {
        const user = await models.User.findOne({ username });
        const match = user ? await user.matchPassword(password) : false;

        if (!match) {
          const errors = {
            message: 'Wrong password or username!'
          };

          res.render('login.hbs', { username, password, errors });
          return;
        };
        const token = jwt.createToken({ id: user._id });

        res.cookie(config.user, user.username);
        res.cookie(config.cookie, token).redirect('/');
      } catch (err) {
        next(err);
      }
    },

    register: async function (req, res, next) {
      const { username, password, repeatPassword } = req.body;

      const errors = validationResult(req);

      console.log(errors)

      if (!errors.isEmpty()) {

        const hbsObject = {
          username, password, repeatPassword,
          errors: [errors.array()[0].msg]
        };
        return res.render('register.hbs', hbsObject)
      }

      if (password !== repeatPassword) {
        const errors = {
          message: "Both passwords should be the same..."
        };
        return res.render('register.hbs', { username, password, repeatPassword, errors });
      }

      try {
        const registeredUser = await models.User.create({ username, password });
        console.log(registeredUser);
        res.redirect('/login');
      } catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
          const hbsObject = {
            username,
            password,
            repeatPassword,
            amount,
            errors: err.errors
          };
          return res.render('register.hbs', hbsObject);
        };
        if (err.name === 'MongoError') {
          const hbsObject = {
            username,
            password,
            repeatPassword,
            amount,
            errors: [`User ${err.keyValue.username} is taken.`]
          };
          return res.render('register.hbs', hbsObject);
        };
        next(err);
      }
    }
  },
}