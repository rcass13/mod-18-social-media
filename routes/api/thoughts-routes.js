const router = require('express').Router();
const User  = require('../../models/users');
const Thought  = require('../../models/thoughts')
const Reaction = require('../../models/reaction')

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughtData = await Thought.find().populate('reactions');
    res.json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by ID
router.get('/:id', async (req, res) => {
  try {
    const thoughtData = await Thought.findById(req.params.id).populate('reactions');
    if (!thoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new thought
router.post('/', async (req, res) => {
  try {
    const thoughtData = await Thought.create(req.body);
    // add thought id to user's thoughts array
    const user = await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thoughtData._id } });
    res.json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT update a thought by ID
router.put('/:id', async (req, res) => {
  try {
    const thoughtData = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!thoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a thought by ID
router.delete('/:id', async (req, res) => {
  try {
    const thoughtData = await Thought.findByIdAndDelete(req.params.id);
    if (!thoughtData) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    // remove thought id from user's thoughts array
    const user = await User.findByIdAndUpdate(thoughtData.userId, { $pull: { thoughts: thoughtData._id } });
    res.json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST add a reaction to a thought
router.post('/:id/reactions', async (req, res) => {
  try {
    const reactionData = await Reaction.create(req.body);
    const thought = await Thought.findByIdAndUpdate(req.params.id, { $push: { reactions: reactionData._id } }, { new: true });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE remove a reaction from a thought
router.delete('/:id/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, { $pull: { reactions: req.params.reactionId } }, { new: true });
    await Reaction.findByIdAndDelete(req.params.reactionId);
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
