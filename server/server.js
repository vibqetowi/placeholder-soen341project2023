require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongoDB = 'mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB
  + '?retryWrites=true&w=majority';
const cors = require("cors");

mongoose.set('strictQuery', true);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Routers
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const tokenRouter = require('./routes/token');
const postingsRouter = require('./routes/postings');

app.options("*", cors());
app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/token', tokenRouter);
app.use('/postings', postingsRouter);

// return backend url
app.use((req, res, next) => {
  const backendUrl = `${req.protocol}://${req.get('host')}:${process.env.PORT}`;
  app.locals.backendUrl = backendUrl;
  next();
});

// Define endpoint to return backend URL
app.get('/backend-url', (req, res) => {
  res.json({ backendUrl: app.locals.backendUrl });
});

// Define app port
app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));
