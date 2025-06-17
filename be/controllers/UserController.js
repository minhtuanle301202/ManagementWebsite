const UserService = require('../services/UserService');


exports.register = async (req,res) => {
    try {
        const data = req.body;
        await UserService.register(data);
        res.status(201).json({message:'Tạo người dùng thành công'});
    } catch(err) {
        res.status(400).json({message: err.message});
    }
}


exports.login = async (req,res) => {
    try {
        const {username,password} = req.body;
        const result = await UserService.login(username,password);
        res.status(200).json({token: result.token,message:'Đăng nhập thành công',user:result.user});
    } catch(err) {
        res.status(401).json({message: err.message});
    }
}


exports.getAllUsers = async (req,res) => {
    try {
        const allUsers = await UserService.getAllUsers();
        if (!allUsers) {
            throw new Error("User doesn't exist");
        }
        res.status(200).json(allUsers);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}

exports.getUserByCardId = async (req,res) => {
    try {
        const user = await UserService.getUserByCardId(req.params.cardId);
        if (!user) throw new Error("User doesn't exist");
        res.status(200).json(user)
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}

exports.updateUser = async(req,res) => {
    try{
        const user = await UserService.updateUser(req.params.cardId,req.body);
        res.status(200).json({user,message: 'Cập nhật dữ liệu thành công!'});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}



exports.getUserById  = async (req,res) => {
 try {
    const userId = req.user._id;
    const user = await UserService.getUserById(userId);
    res.status(200).json(user);
 } catch(err) {
    res.status(500).json({message: err.message});
 }
}

exports.getAreaByCardId = async (req,res) => {
    try {
        const cardId = req.params.cardId;
        const points = await UserService.getAreaBycardId(cardId);
        res.status(200).json(points);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}




