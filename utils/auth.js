const jwt = require('./jwt');
const config = require('../config/config');
const models = require('../models');

function auth(redirectUnauthenticated = true) {

  return function (req, res, next) {
    const token = req.cookies[config.cookie] || '';

    Promise.all([jwt.verifyToken(token), models.TokenBlackList.findOne({ token })])
      .then(([data, blacklistedToken]) => {
        if (blacklistedToken) {
          return Promise.reject(new Error('blacklisted token'));
        };

        models.User.findById(data.id)
          .then(user => {
            req.user = user;
            next();
          });
      }).catch(error => {
        if (!redirectUnauthenticated) { next(); return; }

        if (['token expired', 'blacklisted token', 'jwt must be provided', 'jwt expired'].includes(error.message)) {
          res.redirect('/user/login');
          return;
        }
        next(error);
      });
  }
}

module.exports = auth;