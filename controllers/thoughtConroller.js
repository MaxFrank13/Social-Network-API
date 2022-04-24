const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: ObjectId(req.params.thoughtId) })
      .then(thought => {
        !thought
          ? res.status(500).json({ message: 'No thought with that ID' })
          : res.json(thought)
      })
      .catch(err => res.status(500).json(err));
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then(thought => {
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $addToSet: { thoughts: ObjectId(thought._id) } },
          { new: true }
        )
      })
      .then((user) =>
      !user
        ? res.status(404).json({
            message: 'Thought created, but found no user with that ID',
          })
        : res.status(200).json('Created the thought 🎉')
    )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      {
        _id: ObjectId(req.params.thoughtId) 
      },
      {
        $set: req.body 
      },
      { 
        runValidators: true, 
        new: true 
      }
    )
      .then(thought =>
          !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.status(200).json(thought))
      .catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: ObjectId(req.params.thoughtId) })
      .then(thought => {
        return User.findOneAndUpdate(
          { username: thought.username },
          { $pull: { thoughts: ObjectId(thought._id) } },
          { new: true }
        )
      })
      .then(() => res.status(200).json(
        { 
          message: 'Thought deleted!' 
        }
      ))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  addReaction(req, res) {
    Thought.findOneAndUpdate(
      {
        _id: ObjectId(req.params.thoughtId)
      },
      {
        $addToSet: { reactions: req.body } 
      },
      { 
        runValidators: true, 
        new: true 
      }
    )
    .then(thought =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.status(200).json(thought))
    .catch((err) => res.status(500).json(err));
  },

  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      {
        _id: ObjectId(req.params.thoughtId) 
      },
      {
        $pull: { reactions: ObjectId(req.params.reactionId) } 
      },
      { 
        runValidators: true, 
        new: true 
      }
    )
    .then(thought =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.status(200).json(thought))
    .catch((err) => res.status(500).json(err));
  },

}