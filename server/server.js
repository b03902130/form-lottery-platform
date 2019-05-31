const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const logger = require("morgan");

// Parse env variables
require('dotenv').config()

// Connect to database
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API routes
require('./routes')(app);

app.use(express.static(path.resolve(__dirname, '../build')));

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../build/index.html'));
  res.end();
});


app.listen(process.env.PORT, process.env.HOST, (err) => {
  if (err) {
    console.log(err);
  }
  console.info(`Open http://${process.env.HOST}:${process.env.PORT}/ in your browser`);
});

module.exports = app;
