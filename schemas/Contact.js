const mongoose = require("mongoose")
const Schema = mongoose.Schema

let contactSchema = new Schema({
  name: { type: String, required: true },
  numbers: { type: Array },
  emails: { type: Array },
  history: { type: Array },
  future: { type: Array },
  added: { type: String },
  lastChanged: { type: String }
})

module.exports = mongoose.model("Contact", contactSchema)