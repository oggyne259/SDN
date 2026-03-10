const db = require("../models");
const bcryptjs = require("bcryptjs");

module.exports = {
  // 1. Xem thông tin cá nhân
  getProfile: async (req, res) => {
    try {
      const member = await db.Member.findById(req.memberId);
      if (!member) return res.status(404).send("Không tìm thấy người dùng");
      res.render("pages/profile", { title: "Hồ sơ cá nhân", member: member, success: null, error: null });
    } catch (error) {
      res.status(500).send("Lỗi Server: " + error.message);
    }
  },

  // 2. Cập nhật thông tin 
  updateProfile: async (req, res) => {
    try {
      const { name, YOB, gender } = req.body;
      
      await db.Member.findByIdAndUpdate(req.memberId, {
        name: name,
        YOB: YOB,
        // FIX LỖI: Bắt cả trường hợp boolean chuẩn lẫn chuỗi 'true'
        gender: gender === 'true' || gender === true
      });

      const updatedMember = await db.Member.findById(req.memberId);
      res.render("pages/profile", { title: "Hồ sơ cá nhân", member: updatedMember, success: "Cập nhật thông tin thành công!", error: null });
    } catch (error) {
      res.status(500).send("Lỗi hệ thống: " + error.message);
    }
  },

  // 3. Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const member = await db.Member.findById(req.memberId);

      const isMatch = await bcryptjs.compare(oldPassword, member.password);
      if (!isMatch) return res.render("pages/profile", { title: "Hồ sơ cá nhân", member, success: null, error: "Mật khẩu cũ không chính xác!" });
      
      if (newPassword !== confirmPassword) return res.render("pages/profile", { title: "Hồ sơ cá nhân", member, success: null, error: "Mật khẩu xác nhận không khớp!" });

      const salt = await bcryptjs.genSalt(10);
      member.password = await bcryptjs.hash(newPassword, salt);
      await member.save();

      res.render("pages/profile", { title: "Hồ sơ cá nhân", member, success: "Đổi mật khẩu thành công!", error: null });
    } catch (error) {
      res.status(500).send("Lỗi hệ thống: " + error.message);
    }
  }
};