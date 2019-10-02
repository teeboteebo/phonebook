const express = require("express")
const path = require('path')
const bodyParser = require("body-parser")
const connectToDb = require('./db')
const contactRoutes = require("./API/contactRoutes")
const port = process.env.PORT || 3000
const Sass = require('./sass');
const config = require('./config.json');

connectToDb()

const app = express()

app.use(bodyParser.json())

app.use(express.static('www'));

app.use(contactRoutes)

app.listen(port, () => console.log(`Server is on port ${port}`))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './www/index.html'));
});


for (let conf of config.sass) {
  new Sass(conf);
}