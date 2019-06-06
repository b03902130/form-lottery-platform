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
        type: 'short',  // type can be 'short' or 'multiple'
        question: ''
      },
    ],
  },
});

module.exports = mongoose.model('Form', FormSchema);


