const routers = require('../routers');

module.exports = (app) => {
  app.use('/', routers.user);
  app.use('/', routers.article)
}