const db = require("../models");

module.exports = {
  // 1. Lấy danh sách Brands (GET)
  getBrands: async (req, res) => {
    try {
      const brands = await db.Brand.find().sort({ createdAt: -1 });
      
      // Lấy lỗi từ URL (nếu có)
      const errorMessage = req.query.error || null;

      res.render("pages/admin/brands", { 
        title: "Quản lý Thương hiệu", 
        brands: brands, 
        error: errorMessage // Truyền lỗi ra giao diện EJS
      });
    } catch (error) {
      res.status(500).send("Lỗi Server: " + error.message);
    }
  },

  // 2. Thêm mới Brand (POST)
  createBrand: async (req, res) => {
    try {
      const { brandName } = req.body;
      if (!brandName) throw new Error("Tên thương hiệu không được để trống!");
      
      await db.Brand.create({ brandName });
      res.redirect("/brands"); // Thêm xong thì load lại trang
    } catch (error) {
      res.status(500).send("Lỗi: " + error.message);
    }
  },

  // 3. Sửa Brand (Thay vì dùng PUT khó tích hợp EJS Form, ta dùng POST route riêng)
  updateBrand: async (req, res) => {
    try {
      const { brandName } = req.body;
      await db.Brand.findByIdAndUpdate(req.params.id, { brandName });
      res.redirect("/brands");
    } catch (error) {
      res.status(500).send("Lỗi: " + error.message);
    }
  },

  // 4. Xóa Brand (Dùng POST route riêng)
  deleteBrand: async (req, res) => {
    try {
      const isUsed = await db.Perfume.findOne({ brand: req.params.id });
      if (isUsed) {
        // Chuyển hướng lại trang /brands và gắn theo lỗi trên URL
        const errMsg = "Không thể xóa thương hiệu này vì đang có sản phẩm nước hoa sử dụng nó!";
        return res.redirect("/brands?error=" + encodeURIComponent(errMsg));
      }

      await db.Brand.findByIdAndDelete(req.params.id);
      res.redirect("/brands");
    } catch (error) {
      res.redirect("/brands?error=" + encodeURIComponent("Lỗi hệ thống: " + error.message));
    }
  }
};