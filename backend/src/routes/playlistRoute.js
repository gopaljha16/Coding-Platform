const express = require('express');
const Playlist = require('../models/playlist');
const userMiddleware = require('../middleware/userMiddleware');
const playlistRouter = express.Router();


// Create a new playlist
playlistRouter.post('/', userMiddleware , async (req, res) => {
  try {
    const playlist = new Playlist({
      name: req.body.name,
      user: req.user._id
    });
    await playlist.save();
    res.status(201).send(playlist);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get user's playlists
playlistRouter.get('/user', userMiddleware , async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id })
      .populate('problems', 'title difficulty tags');
    res.send(playlists);
  } catch (err) {
    res.status(500).send();
  }
});

// Add problem to playlist
playlistRouter.post('/:id/problems', userMiddleware , async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!playlist) {
      return res.status(404).send();
    }
    
    if (!playlist.problems.includes(req.body.problemId)) {
      playlist.problems.push(req.body.problemId);
      await playlist.save();
    }
    
    res.send(playlist);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get playlist details
playlistRouter.get('/:id', userMiddleware , async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('problems');
    
    if (!playlist) {
      return res.status(404).send();
    }
    
    res.send(playlist);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = playlistRouter;