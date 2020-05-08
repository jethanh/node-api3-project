const express = require('express');
const User = require('./userDb.js');
const Post = require('../posts/postDb.js')

const router = express.Router();

router.post('/', (req, res) => {
  const info = req.body;
  User.insert(info.name)
    .then(item => {
      res.status(201).json(item)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
    })
});

router.post('/:id/posts', (req, res) => {
  const {id: userId} = req.params;
  console.log(userId)
  console.log(req.body)

  
});

router.get('/', (req, res) => {
  User.get()
    .then(item => {
      res.status(200).json(item)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
    })
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  User.getById(id)
    .then(item => {
      res.status(200).json(item)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
    })
  
});

router.get('/:id/posts', (req, res) => {
  const id = req.params.id;
  User.getUserPosts(id)
    .then(item => {
      res.status(200).json(item)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
    })
});

router.delete('/:id', (req, res) => {
  const id = req.params.id
  User.remove(id)
    .then(res.status(200).end())
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
    })
  
});

router.put('/:id', (req, res) => {
  //only ID and Name in this endpoint, PUT updates name, uses ID to determine which user's name to update.
  //How would we do this if there are multiple things to update like a bio? something like {name, bio} or multiple arguments?
  const id = req.params.id
  const name = req.body.name
  User.update(id, name)
    .then(newInfo => {
      if(newInfo){
        User.getById(id)
        .then(item => {
          res.status(200).json(item)
        })
        .catch(err => {
          res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
        })
      } else {
        res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
    })

});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
