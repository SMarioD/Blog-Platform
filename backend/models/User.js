const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {}

function initUserModel(sequelize) {
    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'User',
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    });
    return User;
}

module.exports = initUserModel;