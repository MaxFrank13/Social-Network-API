const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, 'You have not shared any thoughts!'],
      min: 1,
      max: [280, 'Too many characters!'],
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
    createdAt: {
      type: Date,
      default: Date.now(),
      get: date => date.toLocaleString()
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
)

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;