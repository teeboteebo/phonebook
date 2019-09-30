const express = require("express")
// const bodyParser = require("body-parser")
// const session = require("express-session")
// const MongoStore = require("connect-mongo")(session)
// const settings = require("./config/settings.json")
// const connectToDb = require("./config/db")
// const tagRoutes = require("./API/tagRoutes")
// const recipeRoutes = require("./API/recipeRoutes")
// const ingredientRoutes = require("./API/ingredientRoutes")

// connectToDb()

const app = express()

// app.use(bodyParser.json())
// app.get("/", (req, res) => res.send("Welcome To Phonebook"))
// global.salt = settings.salt
app.use(express.static('www'));

// app.use(
//   session({
//     secret: settings.cookieSecret,
//     resave: true,
//     saveUninitialized: true,
//     store: new MongoStore({
//       mongooseConnection: global.db
//     })
//   })
// )

// app.use(tagRoutes, recipeRoutes, ingredientRoutes)

app.listen(3000, () => console.log(`Server is on port 3000`))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './www/index.html'));
});

const Sass = require('./sass');
const config = require('./config.json');

for(let conf of config.sass){
    new Sass(conf);
}