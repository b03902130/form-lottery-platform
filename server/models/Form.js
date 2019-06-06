const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  owner: {
    type: String,
    default: ''
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
    default: false
  }
});

module.exports = mongoose.model('Form', FormSchema);


