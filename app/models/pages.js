module.exports = function(sequelize, DataTypes) {
      var Pages = sequelize.define('page', {
           title: {
                type: DataTypes.STRING,
                allowNull: false,
           },
           slug: {
                type: DataTypes.STRING,
                allowNull: false,
           },
           text: {
                type: DataTypes.TEXT,
                allowNull: false,
           },
           status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
           },
      }, {
           instanceMethods: {}
      });
      return Pages;
};