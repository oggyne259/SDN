var express = require('express');
var router = express.Router();
const perfumeController = require('../controller/perfume.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const adminController = require('../controller/admin.controller');

/* GET home page (Danh sách, Search, Filter) */
router.get('/', perfumeController.getIndex);

/* GET detail page (Chi tiết Nước hoa) */
router.get('/perfumes/:id', perfumeController.getDetail);

/* POST Gửi bình luận (Yêu cầu phải đăng nhập) */
router.post('/perfumes/:id/comments', authMiddleware, perfumeController.addComment);

router.get('/collectors', authMiddleware, adminMiddleware, adminController.getCollectors);

module.exports = router;