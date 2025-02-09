const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { cache } = require('../middleware/cache');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, cache(300), getMe);

module.exports = router; 