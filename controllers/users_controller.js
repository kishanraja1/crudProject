const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')


////////// create user
users.post('/', (req, res) => {
  if (req.body.isAdmin === 'on') {
    //req.body needs the app.use at the top
    //if statement to change isAdmin value to true or false, instead of on
    req.body.isAdmin = true
  } else {
    req.body.isAdmin = false
  }
  //overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, createdUser) => {
    res.redirect('/')
  })
})


//////// create account page
users.get('/newUser', (req, res) => {
  res.render('./users/newUser.ejs', {
    tabTitle: 'Create Account'
  })
})

module.exports = users
