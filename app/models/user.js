var bCrypt = require('bcrypt-nodejs');
module.exports = function(sequelize, DataTypes) {
      var User = sequelize.define('user', {
           firstname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                     isAlpha: true,
                     len: [3,25]
                },
           },
           lastname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                     isAlpha: true,
                     len: [1,25]
                },
           },
           email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true,
                validate: {
                     isEmail: true,
                     // isUnique: function(value, next) {
                     //       User.find({
                     //            where: {email: value},
                     //            attributes: ['id']
                     //       }).done(function(error, user) {
                     //            if (error)
                     //                 return next(error);
                     //            if (user)
                     //                 return next('Email address already in use!');
                     //       });
                     // }
                }
           },
           password: {
                type: DataTypes.STRING,
                allowNull: false,
                set: function(v) {
                     if(v) {
                           var salt = bCrypt.genSaltSync(10);
                           var hash = bCrypt.hashSync(v, salt);
                           this.setDataValue('password', hash);
                     }
                },
                validate: { notEmpty: true, }
           },
           age: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                     isNumber: true,
                },
           },
           gender: {
                type: DataTypes.ENUM,
                values: ['male', 'female'],
                defaultValue: 'male',
           },
           forgotPasswordToken: {
                type: DataTypes.STRING,
                allowNull: true
           },
           forgotPasswordReqTime: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: sequelize.NOW
           },
           active: {
                type:DataTypes.BOOLEAN,
                defaultValue: 0,
           },
           role: {
                type: DataTypes.ENUM,
                values: ['superadmin', 'user'],
                defaultValue: 'user',
           },
           facebookId: {
                type: DataTypes.STRING,
                allowNull: null,
           },
           image: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                     notEmpty: true,
                }
           },
           token: {
                type: DataTypes.STRING,
                allowNull: true,
           },
      }, {
           instanceMethods: {
                authenticate: function(password){
                     return bCrypt.compareSync(password, this.password);
                },
                encryptPassword: function(password) {
                     if (!password) return '';
                     return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
                }
           }
      });
      // User.sync({ force: false }).then(function () {
      //      return User.create({ firstname: 'Naveen', lastname: 'Kumar', email: 'nrnaveen0492@gmail.com', password: 'admin123', role: 'superadmin', image: "avatar.png" });
      // });
      return User;
};