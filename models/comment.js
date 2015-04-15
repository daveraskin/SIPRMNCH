"use strict";
module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define("comment", {
    message: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
       models.comment.belongsTo(models.post)
       models.comment.belongsTo(models.user)
      }
    }
  });
  return comment;
};