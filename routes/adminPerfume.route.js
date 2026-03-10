var express = require('express');
var router = express.Router();
const adminPerfumeController = require('../controller/adminPerfume.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Khóa toàn bộ route bằng quyền Admin
router.use(authMiddleware, adminMiddleware);

// GET: Danh sách
router.get('/', adminPerfumeController.getPerfumes);

// POST: Thêm mới
router.post('/', adminPerfumeController.createPerfume);

// POST: Sửa 
router.post('/edit/:id', adminPerfumeController.updatePerfume);

// POST: Xóa 
router.post('/delete/:id', adminPerfumeController.deletePerfume);

module.exports = router;