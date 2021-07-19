const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, ObjectId } = Schema.Types;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  description: {
    type: String,
    required: true,
    minlength: 20
  },
  creator: {
    type: ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

module.exports = mongoose.model('Article', ArticleSchema);