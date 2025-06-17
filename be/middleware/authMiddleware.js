const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddlewareAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({message: "Bạn chưa đăng nhập hoặc phiên đăng nhập hết hạn."});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch(err) {
        res.clearCookie('token');
        res.status(403).json({message: "Phiên đăng nhập không hợp lệ.Vui lòng đăng nhập lại."});
    }
}; 

exports.authMiddlewareUser = async (req,res,next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) throw new Error('Không có quyền truy cập, hãy đăng nhập để truy cập');
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) throw new Error('Người dùng không tồn tại');

        req.user = user;
        next();
    }  catch(err) {
        res.status(401).json({message: err.message});
    }
}
