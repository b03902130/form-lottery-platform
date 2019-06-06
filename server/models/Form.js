const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  questions: {
    type: [mongoose.Schema.Types.Mixed],
    default: [
      {
        question_type: 'text',  // type can be 'text' or 'select'
        question_text: ''
      },
    ],
  },
  isDue: {
    type: Boolean,
    default: false,
  },
  winners: {
    type: [String],
    default: [],
  },  
});

module.exports = mongoose.model('Form', FormSchema);


