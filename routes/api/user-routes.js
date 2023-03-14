
const router = require('express').Router();
const User = require('../../models/users');


// const { Schema, model } = require('mongoose');

// const userSchema = new Schema({
//   username: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
//   },
//   thoughts: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'Thought'
//     }
//   ],
//   friends: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   ]
// });

// const User = model('User', userSchema);

// GET all users
router.get('/', async (req, res) => {
  try {
    const userData = await User.find();
    console.log(userData)
    res.json(userData);
  } catch (err) {
    console.log('Rose is awesome');
    console.log(err);
    res.status(400).json(err);
  }
});

// GET a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findById(req.params.id).populate('thoughts friends');
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const userData = await User.findByIdAndDelete(req.params.id);
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST add a friend to a user's friend list
router.post('/:id/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      res.status(404).json({ message: 'No user or friend found with these ids!' });
      return;
    }
    user.friends.addToSet(friend);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE remove a friend from a user's friend list
router.delete('/:id/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      res.status(404).json({ message: 'No user or friend found with these ids!' });
      return;
    }
    user.friends.pull(friend);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
