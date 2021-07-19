const mongoose = require('mongoose');
const Model = mongoose.model;

const tokenBlackList = new mongoose.Schema({
    token: String
})


module.exports = new Model('TokenBlackList', tokenBlackList);