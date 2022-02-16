const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
  name: String,
  username: { type: String, unique: true, required: true},
  password: String,
  isAdmin: Boolean
})

const User = mongoose.model('User', userSchema)

module.exports = User
