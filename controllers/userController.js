const User = require('../models/userModel');
const Config = require('../config/config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { roles } = require('../roles')


// Check permissions against diffrent type of users
exports.grantPermission = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

// Check if user is loggedIn
exports.checkIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}


// Create and register new user
exports.signup = async (req, res, next) => {
  try{
      const user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.password= req.body.password;
      user.role= req.body.role || "user";
      const token = jwt.sign({userId: user._id}, Config.JWT_SECRET, { expiresIn: '1d' });
      user.accessToken=token;
      await user.save();
      // Return success message with Token
       {
        res.status(200).json({
           message: "User added successfully!!!",
          "accessToken" : token
        });
      };
  } catch (error) {
      next(error)
    }
    }
  
    // Auntenticate user against registered users
  exports.login = async (req, res, next) => {
    try{
    const password = req.body.password;
    const email= req.body.email;
    console.log(Date.now());
      console.log((Date.now().valueOf() / 1000));
    const user = await User.findOne({ email });
    if(!user) res.json({error: 'User does not exist!!'});
      // Verify password by comparing 
      if(bcrypt.compareSync(password, user.password)) {
      const accessToken = jwt.sign({userId: user._id}, Config.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({message: "User found!!!",data: { email: user.email, role: user.role, id: user.id }, accessToken});
      }
      else
      {
      res.json({status:"error", message: "Invalid password!!!"});
      }
    }
  catch (error) {
    next(error)
  }
  }
  
//  Only Admin can get all users
exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
}
// Get particular user against ID
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
       res.json({error: 'User does not exist'});
    }
    else{
    res.status(200).json({
      data: user
    });
  }
  } catch (error) {
    next(error)
  }
}
// Delete User by finding ID against user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: 'User has been deleted'
    });
  } catch (error) {
    next(error)
  }
}
// Update user against particular ID

 exports.updateUser = async (req, res, next) => {
   try {
     const userId =  req.body.userId;
     await User.findByIdAndUpdate(userId);
     res.status(200).json({data: null,
            message: 'User has been updated'   
    })
     
   } catch (error) {
     next(error);
   }
 }
//  User information available to everyone

exports.userData = async(req, res, next) =>  {
  const users =  await User.find({});
  // console.log(users);
  const key = _.first(users);
  console.log(key);
  key.pop("email");
console.log(key);

  const cities = { country: "pakistan",
                  province: "punjab",
                  city: "rawalpindi",
                  capital: "islamabad"};
  console.log(cities);
  cities.flag = "green";
  delete cities["province"];
  delete cities.city;
  console.log(cities);

 
  res.status(200).json({
    data: users
  });
}