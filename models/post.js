"use strict";
module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define("post", {
    message: DataTypes.TEXT,
    business: DataTypes.TEXT,
    type: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.post.hasMany(models.comment);
        models.post.belongsTo(models.user);
      }
    }
  });
  return post;
};