const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./config/db")
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')


//Load config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

//connecting db, imported above
connectDB()

const app = express()

//body parser(for post method)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Method override for put request in case of edit story
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))


//Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//HandleBar helpers
const { formatDate, stripTags, truncate, editIcon, compare, allowLike, equal, log } = require('./helpers/hbs')

//Handlebars for front end template
app.engine('.hbs', exphbs.engine({
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    compare,
    allowLike,
    equal,
    log
  }, defaultLayout: 'main', extname: '.hbs'
}));
app.set('view engine', '.hbs');
// app.set('views', './views'); use this if you want diff set of structure

//sessions middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,//wont create if it has nothing to store,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })
}))

//passsport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable to access user in our front end templates
app.use(function (req, res, next) {
  console.log("logging user before setting to global variable");
  console.log(req.user);
  res.locals.user = req.user || null
  next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))
app.use('/promote', require('./routes/promote'))
app.use('/premium', require('./routes/premium'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`))