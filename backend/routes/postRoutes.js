const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const isAuthenticated = require('../middleware/authMiddleware');

router.get('/posts/new', isAuthenticated, postController.showCreatePage);
router.post('/posts', isAuthenticated, postController.createPost);
router.post('/posts/:id/comments', isAuthenticated, postController.addComment);

router.get('/posts/:id/edit', isAuthenticated, postController.showEditPage);
router.post('/posts/:id/edit', isAuthenticated, postController.updatePost);

router.post('/posts/:id/delete', isAuthenticated, postController.deletePost);

router.get('/posts/:id', postController.showPost);

module.exports = router;