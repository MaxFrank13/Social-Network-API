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
    createdAt: {
      type: Date,
      default: Date.now,
      //.toLocaleDateString()
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false, // what does this do?
  }
)

thoughtSchema
  .virtual('reactionCount')
  .get(function() {
    return `${this.reactions.length}`
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;