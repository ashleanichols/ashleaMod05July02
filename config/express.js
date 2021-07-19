const express = require('express');
const cookieParser = require('cookie-parser');
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const { addUserStatus } = require('../utils');

module.exports = (app) => {
  app.engine('hbs', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: 'views',
    defaultLayout: 'main-layout',
    partialsDir: 'views/partials',
    extname: '.hbs'
  }));

  app.set('view engine', 'hbs');

  app.use(express.static('./static'));

  app.use(cookieParser());

  app.use(addUserStatus);

  app.use(express.urlencoded({ extended: false }));
}