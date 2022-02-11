const mongoose = require('mongoose')


const scheduleSchema = new mongoose.Schema({
  className: String,
  date: Date,
  instructor: String,
  Description: String
})

const scheduleCollection = mongoose.model('Class', scheduleSchema)

module.exports = scheduleCollection
