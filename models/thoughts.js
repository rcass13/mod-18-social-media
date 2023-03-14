const { Schema, model } = require('mongoose');
const Reaction = require ("./reaction")

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxLength: 280
  },
  username: {
    type: String,
    required: true
  },
  reactions: [
    {
      type: String,
      required: true,
      minlength: 1,
      maxLength: 280
    }
  ]
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;