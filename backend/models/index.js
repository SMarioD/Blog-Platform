const sequelize = require('../config/database');
const initUserModel = require('./User');
const initPostModel = require('./Post');
const initCommentModel = require('./Comment');
const User = initUserModel(sequelize);
const Post = initPostModel(sequelize);
const Comment = initCommentModel(sequelize);
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = { sequelize, User, Post, Comment };