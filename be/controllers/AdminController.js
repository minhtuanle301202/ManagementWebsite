const AdminService = require('../services/AdminService');
const jwt = require('jsonwebtoken');


exports.register = async(req,res) => {
    try {
        const {username,password} = req.body;
        await AdminService.resigter(username,password);
        res.status(201).json({message: 'Registration successful'}); 
    } catch(err) {
        res.status(400).json({message: err.message});
    }
}

exports.login = async (req,res) => {
    try {
        const {username, password} = req.body;
        const result = await AdminService.login(username,password);
        res.cookie('token',result.token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: false,
            maxAge: 2*60*60*1000
        });
        res.status(200).json({ admin: result.admin,message:'Đăng nhập thành công' });

    } catch(error) {
        res.status(401).json({message: error.message});
    }

}

exports.logout = (req,res) => {
    res.clearCookie("token");
    res.status(200).json({message: "Đăng xuất thành công "});
}


exports.checkAuth = (req,res) => {
    const admin = req.admin;
    res.status(200).json(admin);
}
