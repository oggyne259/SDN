const adminMiddleware = (req, res, next) => {
    // req.isAdmin đã được giải mã từ token trong authMiddleware trước đó
    if (req.isAdmin === true) {
        res.locals.layout = 'layouts/admin_layout'; // Chuyển sang layout admin
        next(); // Cho phép đi tiếp vào Controller
    } else {
        res.status(403).send("Forbidden: Truy cập bị từ chối! Bạn không phải là Quản trị viên (Admin).");
    }
};

module.exports = adminMiddleware;