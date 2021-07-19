const config = require('../config/config');

module.exports = addUserStatus = (req, res, next) => {
  res.locals = {
    isLoggedIn: req.cookies[config.cookie] !== undefined,
    username: req.cookies[config.user] ? req.cookies[config.user] : '',
  }
  next()
} 