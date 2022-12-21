const express = require('express');
const blogController = require('../controllers/blogController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/edit', blogController.blog_update_put);
router.get('/create', blogController.blog_create_get);
router.get('/', blogController.blog_index);
router.post('/', checkUser, blogController.blog_create_post);
router.get('/:id', blogController.blog_details);
router.delete('/:id', blogController.blog_delete);
router.get('/:id/edit', blogController.single_blog_details);

module.exports = router;