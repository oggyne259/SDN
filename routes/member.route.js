var express = require('express');
var router = express.Router();
const memberController = require('../controller/member.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Áp dụng middleware kiểm tra đăng nhập cho toàn bộ các route bên dưới
router.use(authMiddleware);

// Các route quản lý cá nhân
router.get('/profile', memberController.getProfile);
router.post('/profile', memberController.updateProfile);
router.post('/change-password', memberController.changePassword);

module.exports = router;