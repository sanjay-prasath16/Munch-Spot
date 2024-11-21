const express = require('express');
require('dotenv').config();
require('cors');
const app = express();
const passport = require('passport')
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');

mongoose.connect(process.env.MONGODB_URL_COMPASS)

const db = mongoose.connection;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use(passport.initialize());
app.use(passport.session());

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/authRoutes'));

const port = 3001;

app.listen(port, () => {
    console.log(`server is running on the port ${port}`);
})