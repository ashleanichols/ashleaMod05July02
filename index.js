const dotenv = require('dotenv');
dotenv.config();
require('./config/database')().then(() => {

  const config = require('./config/config');
  const app = require('express')();

  require('./config/express')(app);
  require('./config/routes')(app);

  app.use((err, req, res, next) => {
    res.render('404.hbs', { errorMessage: err.message })
  })

  app.listen(config.port, console.log(`Server is ready! Listening on port ${config.port}!`))
}).catch(err => console.log(err));