const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')

sessions.get('/new', (req, res) => {
  res.render('./sessions/newSession.ejs',
  {
    currentUser: req.session.currentUser,
    tabTitle: 'Log in',
  })
})

// on sessions form submit (log in)
sessions.post('/', (req, res) => {

  User.findOne({ username: req.body.username }, (err, foundUser) => {
    // Database error
    if (err) {
      console.log(err)
      res.send('oops the db had a problem')
    } else if (!foundUser) {
      // if found user is undefined/null not found etc
      res.send('<a  href="/users/newUser">Sorry, no user found. Create an account </a>')
    } else {
      // user is found yay!
      // now let's check if passwords match
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        // add the user to our session
        req.session.currentUser = foundUser,
        req.session.isAdmin = true
        // redirect back to our home page
        res.redirect('/')
      } else {
        // passwords do not match
        res.send('<a href="/sessions/new"> password does not match. Try Again </a>')
      }
    }
  })
})

sessions.delete('/', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

module.exports = sessions
