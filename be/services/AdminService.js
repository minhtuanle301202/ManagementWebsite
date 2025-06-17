const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');



exports.resigter = async (username,password) => {
    const existing = await Admin.findOne({username});
    if (existing) throw new Error('Username already exists');

    const admin = new Admin({username,password});
    await admin.save();
}

exports.login = async (username, password) => {
    const admin = await Admin.findOne({username});
    if (!admin) throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');

    const token = jwt.sign({admin},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN_ADMIN
    });

    return {
        token: token,
        admin: admin
    };
}





