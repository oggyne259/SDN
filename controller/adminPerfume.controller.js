const db = require("../models");

module.exports = {
  // 1. Lấy danh sách Perfumes (Kèm theo danh sách Brands để đổ vào thẻ <select>)
  getPerfumes: async (req, res) => {
    try {
      const perfumes = await db.Perfume.find().populate("brand").sort({ createdAt: -1 });
      const brands = await db.Brand.find(); // Lấy Brands để Admin chọn khi thêm/sửa
      
      res.render("pages/admin/perfumes", { 
        title: "Quản lý Nước Hoa", 
        perfumes, 
        brands,
        error: null 
      });
    } catch (error) {
      res.status(500).send("Lỗi Server: " + error.message);
    }
  },

  // 2. Thêm mới Perfume
  createPerfume: async (req, res) => {
    try {
      const { perfumeName, uri, price, concentration, description, ingredients, volume, targetAudience, brand } = req.body;
      
      await db.Perfume.create({
        perfumeName, uri, price: Number(price), concentration, description, ingredients, volume: Number(volume), targetAudience, brand
      });
      
      res.redirect("/admin/perfumes");
    } catch (error) {
      res.status(500).send("Lỗi: " + error.message);
    }
  },

  // 3. Cập nhật Perfume
  updatePerfume: async (req, res) => {
    try {
      const { perfumeName, uri, price, concentration, description, ingredients, volume, targetAudience, brand } = req.body;
      
      await db.Perfume.findByIdAndUpdate(req.params.id, {
        perfumeName, uri, price: Number(price), concentration, description, ingredients, volume: Number(volume), targetAudience, brand
      });
      
      res.redirect("/admin/perfumes");
    } catch (error) {
      res.status(500).send("Lỗi: " + error.message);
    }
  },

  // 4. Xóa Perfume
  deletePerfume: async (req, res) => {
    try {
      await db.Perfume.findByIdAndDelete(req.params.id);
      res.redirect("/admin/perfumes");
    } catch (error) {
      res.status(500).send("Lỗi: " + error.message);
    }
  }
};