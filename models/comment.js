'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.comment.belongsTo(models.user)
    }
  }
  comment.init({
    userName: DataTypes.STRING,
    comment: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    drinkName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};