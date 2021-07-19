const express = require('express')
const router = express.Router();

const auth = require('../utils/auth');
const controllers = require('../controllers');
const { articleValidator } = require('../utils/validators');

router.get('/', auth(false), controllers.article.get.home);

router.get('/all-articles', auth(false), controllers.article.get.allArticles);

router.route('/create')
  .get(auth(), controllers.article.get.create)
  .post(auth(), articleValidator, controllers.article.post.create);

router.route('/edit/:id')
  .get(auth(false), controllers.article.get.edit)
  .post(auth(false), articleValidator, controllers.article.post.edit);

router.get('/details/:id', auth(false), controllers.article.get.details);

router.get('/delete/:id', auth(false), controllers.article.get.delete);

router.get('/error', auth(), controllers.article.get.error);

router.post('/search', auth(), controllers.article.post.search);

router.get('*', auth(false), controllers.article.get.notFound);

module.exports = router;