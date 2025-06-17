const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

exports.register = async (user) => {
    const {cardId,email,phone}  = user;
    const existingCardId = await User.findOne({cardId});
    if (existingCardId) throw new Error('Số thẻ căn cước công dân đã được sử dụng!');
    const existingEmail = await User.findOne({email});
    if (existingEmail) throw new Error('Email đã tồn tại!');
    const existingPhone = await User.findOne({phone});
    if (existingPhone) throw new Error('Số điện thoại đã tồn tại!');
    const newUser = new User(user);
    await newUser.save();

} 


exports.login = async (username,password) => {
    const user = await User.findOne({cardId: username});
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);;
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN_USER
    });

    return {
        token: token,
        user: user
    };

} 

exports.changePassword = async (data) => {
    const {cardId, currentPassword, newPassword} = data;
    const user = await User.findOne({cardId});
    if (!user) throw new Error("User doesn't exist");

    const isMatch = await bcrypt.compare(currentPassword,user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials")
    };
    user.password = newPassword;
    await user.save();

} 


exports.getAllUsers = async () => {
    const allUsers = await User.find();
    return allUsers;
}

exports.getUserByCardId = async (cardId) => {
    return await User.findOne({cardId: cardId});
}

exports.getUserByName = async (name) => {
    const users = await User.find({
        $text: { $search: keyword }
      });
    if (users) {
        return users;
    } else {
        throw new Error('No user exists');
    }
}

exports.updateUser = async (cardId, updateData) => {
    const user = await User.findOne({cardId});
    if (!user) throw new Error('Người dùng không tồn tại');
    return await User.findByIdAndUpdate(user._id,updateData,{new: true});
};

exports.deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

exports.getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error("Người dùng không tồn tại");
    return user;
}

exports.getAreaBycardId = async (cardId) => {
    const user = await User.findOne({cardId: cardId});
    if (!user) throw new Error("Người dùng không tồn tại");
    return user.points;

}

