const db = require("../models");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Dùng để giải mã token kiểm tra đăng nhập

module.exports = {
  // 1. Lấy danh sách (Giữ nguyên)
  getIndex: async (req, res) => {
    try {
      let query = {};
      const { perfumeName, brand, page } = req.query;

      // Tìm kiếm và Lọc
      if (perfumeName) query.perfumeName = { $regex: perfumeName, $options: "i" };
      if (brand) query.brand = brand;

      // === CẤU HÌNH PHÂN TRANG ===
      const limit = 9; // Hiển thị 9 sản phẩm 1 trang
      const currentPage = parseInt(page) || 1; // Lấy trang hiện tại từ URL (mặc định là 1)
      const skip = (currentPage - 1) * limit; // Tính số sản phẩm cần bỏ qua

      // Đếm tổng số sản phẩm khớp với điều kiện tìm kiếm để tính số trang
      const totalPerfumes = await db.Perfume.countDocuments(query);
      const totalPages = Math.ceil(totalPerfumes / limit);

      // Lấy data có áp dụng skip và limit
      const perfumes = await db.Perfume.find(query)
        .populate("brand")
        .sort({ createdAt: -1 }) // Sắp xếp nước hoa mới thêm lên đầu
        .skip(skip)
        .limit(limit);
        
      const brands = await db.Brand.find();
      
      res.render("pages/index", {
        title: "Trang chủ - Nước Hoa", 
        perfumes: perfumes, 
        brands: brands,
        searchName: perfumeName || "", 
        selectedBrand: brand || "", 
        currentPage: currentPage, // Truyền trang hiện tại ra EJS
        totalPages: totalPages,   // Truyền tổng số trang ra EJS
        error: null
      });
    } catch (error) {
      res.render("pages/index", { 
        title: "Lỗi", perfumes: [], brands: [], 
        currentPage: 1, totalPages: 1, error: error.message 
      });
    }
  },

  // 2. Lấy chi tiết (Đã thêm biến currentUserId)
  getDetail: async (req, res) => {
    try {
      const perfumeId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(perfumeId)) {
        return res.status(400).send("ID sản phẩm không hợp lệ.");
      }

      const perfume = await db.Perfume.findById(perfumeId)
        .populate("brand")
        .populate("comments.author", "name"); // Lấy tên người bình luận

      if (!perfume) return res.status(404).send("Không tìm thấy sản phẩm.");

      // Kiểm tra xem ai đang xem trang này (để ẩn hiện form bình luận)
      let currentUserId = null;
      if (req.cookies.token) {
        try {
          const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
          currentUserId = decoded.memberId;
        } catch (err) {} // Nếu token sai/hết hạn thì bỏ qua
      }

      res.render("pages/perfume-detail", { 
        title: perfume.perfumeName, 
        perfume: perfume, 
        currentUserId: currentUserId, // Truyền ID user đang đăng nhập ra giao diện
        error: null 
      });
    } catch (error) {
      res.status(500).send("Lỗi hệ thống: " + error.message);
    }
  },

  // 3. THÊM MỚI: Xử lý Gửi Bình luận
  addComment: async (req, res) => {
    try {
      const perfumeId = req.params.id;
      const memberId = req.memberId; // Lấy từ authMiddleware
      const { rating, content } = req.body;

      const perfume = await db.Perfume.findById(perfumeId);
      if (!perfume) return res.status(404).send("Không tìm thấy nước hoa.");

      // LOGIC QUAN TRỌNG: Kiểm tra xem user này đã comment chưa
      const hasCommented = perfume.comments.some(
        (comment) => comment.author.toString() === memberId
      );

      if (hasCommented) {
        return res.status(400).send("Bạn đã đánh giá sản phẩm này rồi! Mỗi thành viên chỉ được đánh giá 1 lần.");
      }

      // Thêm bình luận mới vào mảng
      perfume.comments.push({
        rating: Number(rating),
        content: content,
        author: memberId
      });

      await perfume.save();
      // Sau khi lưu xong, load lại trang chi tiết
      res.redirect(`/perfumes/${perfumeId}`);
    } catch (error) {
      res.status(500).send("Lỗi hệ thống: " + error.message);
    }
  }
};