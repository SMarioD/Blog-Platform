const { DataTypes, Model } = require('sequelize');

class Post extends Model {}

function initPostModel(sequelize) {
    Post.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Post'
    });
    return Post;
}

module.exports = initPostModel;