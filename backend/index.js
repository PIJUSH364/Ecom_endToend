const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./dataBase/dbConnect');
const userHandler = require('./router/userHandler');

const app = express();
app.use(express.json());

app.use(cors());

// connect with dataBase
connectDb();

// all router
app.get('/', (req, res) => {
  res.send(`app running on ${process.env.PORT}`);
});

app.use('/user', userHandler);

// default error handler...

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`app listen port ${process.env.PORT}`)
);
