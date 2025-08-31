const { DataTypes, Model } = require('sequelize');

class Comment extends Model {}

function initCommentModel(sequelize) {
    Comment.init({
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Comment'
    });
    return Comment;
}

module.exports = initCommentModel;