const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "supervisor", "admin"]
  },
  accessToken: {
    type: String
  }
})

// Ppassword hashing before saving to DB
 userSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
  });
  module.exports = mongoose.model('user', userSchema);

