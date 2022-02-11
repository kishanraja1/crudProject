const mongoose = require('mongoose')
const Schema = mongoose.Schema


const scheduleSchema = new mongoose.Schema({
  className: String,
  date: String,
  instructor: String,
  capacity: Number
})

const scheduleCollection = mongoose.model('Class', scheduleSchema)

module.exports = scheduleCollection
