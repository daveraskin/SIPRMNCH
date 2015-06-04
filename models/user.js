"use strict";

var bcrypt = require('bcrypt')
var flash = require('connect-flash');
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    userName: DataTypes.STRING,
    password: {
               type: DataTypes.STRING,
               validate: {
                    len: {
                      args:[8,200],
                      msg: "Your password needs to be a little longer (a minimum of 8 characters is required)."
                    }
                 }
               },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    picture: DataTypes.TEXT
  },
  {
    hooks: {
      beforeCreate: function(user, options, sendback){
        bcrypt.hash(user.password,10,function(err,hash){
          if (err) throw err;
          user.password = hash;
          sendback(null, user);
        })

      }
      },
    classMethods: {
      associate: function(models) {
       models.user.hasMany(models.post);
       models.user.hasMany(models.comment);
      }
    }
  });
  return user;
};