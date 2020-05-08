const express = require('express');
const User = require('./userDb.js');
const Post = require('../posts/postDb.js')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const info = req.body;
  User.insert(info.name)
    .then(item => {
      res.status(201).json(item)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
    })
});

router.post('/:id/posts', validatePost, (req, res) => {
  const {id: user_id} = req.params;
  console.log(user_id)
  console.log(req.body)
  const text = req.body.text
  Post.insert({user_id, text})
    .then(item => {
      res.status(201).json(item);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko" })
    })
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

router.get('/:id', validateUserId, (req, res) => {
  console.log(req.user)
res.status(200).json(req.user)
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

// - `validateUserId()`

//   - `validateUserId` validates the user id on every request that expects a user id parameter
//   - if the `id` parameter is valid, store that user object as `req.user`
//   - if the `id` parameter does not match any user id in the database, 
//   cancel the request and respond with status `400` and `{ message: "invalid user id" }`

function validateUserId(req, res, next) {
  const id = req.params.id
  User.getById(id)
    .then(item => {
      if(item){
        console.log(req.user) //req.user will come from the get request, undefined here
        req.user = item;
        next();
      } else {
        res.status(400).json({ errorMessage: "User not found." })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Somethin' went wrong, bucko." })
    })
}

// - `validateUser()`

//   - `validateUser` validates the `body` on a request to create a new user
//   - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing user data" }`
//   - if the request `body` is missing the required `name` field,
//    cancel the request and respond with status `400` and `{ message: "missing required name field" }`


function validateUser(req, res, next) {
  const name = req.body.name;
  if (!req.body){
    res.status(400).json({ errorMessage: "User data required." })
  } else if(!name) {
    res.status(400).json({ errorMessage: "Name required" })
  } else {
    next();
  }
}

// - `validatePost()`
//   - `validatePost` validates the `body` on a request to create a new post
//   - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing post data" }`
//   - if the request `body` is missing the required `text` field, 
//   cancel the request and respond with status `400` and `{ message: "missing required text field" }`

function validatePost(req, res, next) {
  const text = req.body.text;
  if (!req.body){
    res.status(400).json({ errorMessage: "Post data required." })
  } else if(!text) {
    res.status(400).json({ errorMessage: "Text required" })
  } else {
    next();
  }
}

module.exports = router;
