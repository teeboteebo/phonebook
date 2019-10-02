const mongoose = require("mongoose")

const connectToDb = () => {
  mongoose
    .connect('mongodb+srv://jesper:kykling95@pb-7ds8q.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))

  global.db = mongoose.connection
}

module.exports = connectToDb