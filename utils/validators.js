const { body } = require('express-validator');

const articleValidator = [

  body('title', 'Title length should be at least 5 symbols!')
    .isLength({ min: 5 })
  ,

  body('description', 'Article description should be at least 20 characters long...')
    .isLength({ min: 20 })
];

const userValidator = [

  body('username', 'User\'s name should be at least 4 symbols!')
    .isLength({ min: 4 })
  ,

  body('username', 'User\'s name should consist alphanumeric!')
    .isAlphanumeric()
  ,

  body('password', 'User\'s password should be at least 6 symbols!')
    .isLength({ min: 6 })
  ,

  body('password', 'User\'s password should consist alphanumeric!')
    .isAlphanumeric()
  ,

  body('repeatPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Both passwords should be the same...');
      }
      return true;
    })
];

module.exports = {
  articleValidator,
  userValidator
};
