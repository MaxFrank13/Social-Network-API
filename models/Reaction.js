const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: [true, 'You have not shared any thoughts!'],
      max: [280, 'Too many characters!'],
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //.toLocaleDateString()
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false, // what does this do?
  }
);

module.exports = reactionSchema;