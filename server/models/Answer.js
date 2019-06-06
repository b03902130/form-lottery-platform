const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
  },
  answers: {
    type: [String],
    default: '',
  },
});

module.exports = mongoose.model('Answer', AnswerSchema);
