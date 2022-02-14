const mongoose = require('mongoose')
const Schema = mongoose.Schema


const merchSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
})

const merchCollection = mongoose.model('Merchandise', merchSchema)

module.exports = merchCollection
