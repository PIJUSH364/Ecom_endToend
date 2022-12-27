const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('../schema/userSchema');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jsonwebtoken = require('jsonwebtoken');
const User = new mongoose.model('User', userSchema);
const router = express.Router();

router.get('/', (req, res) => {
  res.send('user...');
});

router.post('/signup', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // password hashing
    const hasPassword = await bcrypt.hash(password, 10);
    // new user create
    const newUser = new User({ name, username, email, password: hasPassword });
    // user save on mongodb
    await newUser.save();
    // finally response send
    res.status(200).send({ message: 'SignUp successful!' });
  } catch (error) {
    res.status(500).send('SignUp failed!');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // generate token
    const token = jsonwebtoken.sign(
      {
        email: email,
        password: password,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1000h',
      }
    );
    // find user present on database
    const userInfo = await User.findOne({ email: email }).select({
      email: 0,
      name: 0,
    });
    const { username, password: hashPassword, _id } = userInfo;
    // compare password
    const isValidPassword = await bcrypt.compare(password, hashPassword);

    if (isValidPassword) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: _id },
        {
          $set: { token: token },
        },
        { new: true }
      );
      res.status(200).send({
        message: 'login successful',
        status: isValidPassword,
        result: { username, token: updatedUser.token },
      });
    } else {
      res
        .status(200)
        .send({ error: 'authentication failed', status: isValidPassword });
    }
  } catch (error) {
    res.status(500).send({ error: 'authentication failed' });
  }
});

router.post('/auto_login', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const { email, password } = decoded;

    // find user present on database
    const userInfo = await User.findOne({ email: email });

    // compare password
    const isValidPassword = await bcrypt.compare(password, userInfo.password);

    if (isValidPassword) {
      res.status(200).send({
        message: 'login successful',
        status: isValidPassword,
        result: { username: userInfo.username },
      });
    } else {
      res
        .status(200)
        .send({ error: 'authentication failed', status: isValidPassword });
    }
  } catch (error) {
    res.status(500).send({ error: 'authentication failed' });
  }
});

module.exports = router;
