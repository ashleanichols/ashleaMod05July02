const express = require('express')
const router = express.Router();

const controllers = require('../controllers');
const { userValidator } = require('../utils/validators');

router.route('/login')
  .get(controllers.user.get.login)
  .post(controllers.user.post.login);

router.route('/register')
  .get(controllers.user.get.register)
  .post(userValidator, controllers.user.post.register);

router.get('/logout', controllers.user.get.logout);

module.exports = router;