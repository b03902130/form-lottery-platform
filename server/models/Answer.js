const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  owner: {
    type: String,
    default: ''
  },
  form: {
    type: String,
    default: ''
  },
  answers: {
    type: [String],
    default: '',
  },
});

module.exports = mongoose.model('Answer', AnswerSchema);
