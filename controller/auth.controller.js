const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");

module.exports = {
  // Render login page
  showLogin: (req, res) => {
    res.render("auth/login", {
      title: "Login",
      error: null,
      success: null,
      email: "",
    });
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const member = await db.Member.findOne({ email });
      if (!member) {
        return res.status(401).render("auth/login", {
          title: "Login",
          error: "Tài khoản hoặc mật khẩu không chính xác.",
          success: null,
          email,
        });
      }

      const isPasswordValid = await bcryptjs.compare(password, member.password);

      if (!isPasswordValid) {
        return res.status(401).render("auth/login", {
          title: "Login",
          error: "Tài khoản hoặc mật khẩu không chính xác.",
          success: null,
          email,
        });
      }

      // LƯU Ý: Đã đổi userId thành memberId để khớp với authMiddleware
      const token = jwt.sign(
        { memberId: member._id, isAdmin: member.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Vẫn giữ lại cookie để hỗ trợ cho việc test giao diện EJS sau này
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
      
      
      return res.redirect("/"); // Chuyển hướng về trang chủ sau khi đăng nhập thành công

    } catch (error) {
      return res.status(500).render("auth/login", {
        title: "Login",
        error: "Đăng nhập thất bại, vui lòng thử lại sau.",
        success: null,
        email: req.body.email || "",
      });
    }
  },

  // Api login
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const member = await db.Member.findOne({ email });
      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found"
        });
      }

      const isPasswordValid = await bcryptjs.compare(password, member.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password"
        });
      }

      // signin
      const token = jwt.sign(
        { memberId: member._id, isAdmin: member.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        data: {
            id: member._id,
            email: member.email,
            isAdmin: member.isAdmin
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  //Register

  register: async (req, res) => {
    try {
      const { email, password, name, YOB, gender } = req.body;
      
      // 1. Kiểm tra duplicate email
      const existMember = await db.Member.findOne({ email });
      if (existMember) {
        // Trả về JSON báo lỗi 400 (Bad Request) nếu trùng email
        return res.status(400).json({
          success: false,
          message: "Email này đã được đăng ký. Vui lòng sử dụng email khác!"
        });
      }

      // 2. Hash password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      // 3. Tạo mới thành viên
      const newMember = new db.Member({
        email,
        password: hashedPassword,
        name,
        YOB,
        // Ép kiểu về boolean đề phòng client gửi lên string 'true'/'false'
        gender: gender === 'true' || gender === true 
      });

      // 4. Lưu vào Database
      await newMember.save();

      return res.redirect("/auth/login");

    } catch (error) {
      // 6. Trả về JSON báo lỗi Server hoặc lỗi thiếu dữ liệu (500)
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống: " + error.message
      });
    }
  },
  
  showRegister: (req, res) => {
    res.render("auth/register", { title: "Register", error: null, success: null });
  },

  // Đăng xuất (xóa triệt để token)
  logout: (req, res) => {
    // Phải truyền đúng option giống lúc tạo thì trình duyệt mới chịu xóa
    res.clearCookie("token", { 
        httpOnly: true, 
        path: '/' 
    });
    
    // Xóa xong thì chuyển hướng về trang đăng nhập
    res.redirect("/auth/login");
  }
};
