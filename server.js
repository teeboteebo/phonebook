const express = require("express")
const path = require('path')
const bodyParser = require("body-parser")
const connectToDb = require('./db')
const contactRoutes = require("./API/contactRoutes")
const port = process.env.PORT || 3000

connectToDb()

const app = express()

app.use(bodyParser.json())

app.use(express.static('www'));

app.use(contactRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './www/index.html'));
});

app.listen(port, () => console.log(`Server is on port ${port}`))