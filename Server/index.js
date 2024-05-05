const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const { mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');

// database connection
mongoose.connect(process.env.MONGODB_URL_COMPASS)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/authRoutes'));

const port = 3001;

app.listen(port, () => {
    console.log(`server is running on the port ${port}`);
})