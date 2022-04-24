const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// export route functions
module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.status(200).json(users))
      .catch((err) => res.status(404).json(err));
  },

  getSingleUser(req, res) {
    User.findOne({ _id: ObjectId(req.params.userId) })
      .then(user => {
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.status(200).json(user)
      })
      .catch(err => res.status(404).json(err));
  },

  createUser(req, res) {
    User.create(req.body)
      .then(user => res.status(200).json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      {
        _id: ObjectId(req.params.userId)
      },
      {
        $set: req.body 
      },
      { 
        runValidators: true, 
        new: true 
      }
    )
      .then(user =>
          !user
            ? res.status(404).json({ message: 'No user with this id!' })
            : res.status(200).json(user))
      .catch((err) => res.status(500).json(err));
  },

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: ObjectId(req.params.userId) })
      .then(user =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.deleteMany(
            { username: { $in: user.username } },
          )
      )
      .then(() => res.status(200).json(
        { 
          message: 'User and thoughts deleted!' 
        }
      ))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  addFriend(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.userId 
      },
      {
        $addToSet: { friends: ObjectId(req.params.friendId) } 
      },
      { 
        runValidators: true, 
        new: true 
      }
    )
    .then(() => res.status(200).json(
      { 
        message: 'Friend added' 
      }
    ))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

  removeFriend(req, res) {
    User.findOneAndUpdate(
      {
        _id: ObjectId(req.params.userId) 
      },
      {
        $pull: { friends: ObjectId(req.params.friendId) } 
      },
      { 
        runValidators: true, 
        new: true 
      }
    )
    .then(() => res.status(200).json(
      { 
        message: 'Friend deleted!' 
      }
    ))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },

};