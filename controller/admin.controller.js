const db = require("../models");

module.exports = {
  // Lấy danh sách tất cả members (Task 4)
  getCollectors: async (req, res) => {
    try {
      // Lấy toàn bộ thành viên từ database, loại bỏ trường password để bảo mật
      const members = await db.Member.find({}).select("-password");
      
      res.render("pages/admin/collectors", {
        title: "Quản lý Thành viên",
        members: members,
        error: null
      });
    } catch (error) {
      res.status(500).send("Lỗi Server: " + error.message);
    }
  }
};