const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Email is Required']
  },
  username: {
    type: String,
    require: [true, 'Username is Required']
  },
  password: {
    type: String,
    require: [true, 'Password is Required']
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);