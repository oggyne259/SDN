var express = require('express');
var router = express.Router();
const brandController = require('../controller/brand.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Khóa toàn bộ route /brands bằng quyền Admin
router.use(authMiddleware, adminMiddleware);

// GET: Lấy danh sách
router.get('/', brandController.getBrands);

// POST: Thêm mới
router.post('/', brandController.createBrand);

// POST: Cập nhật (Do thẻ <form> HTML mặc định chỉ hỗ trợ GET/POST)
router.post('/edit/:id', brandController.updateBrand);

// POST: Xóa 
router.post('/delete/:id', brandController.deleteBrand);

module.exports = router;