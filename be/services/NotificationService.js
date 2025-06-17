const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createNotification = async (data) => {
    const user = User.findById(data.userId);
    if (!user) {
        throw new Error('Người dùng không tồn tại!');
    }

    const notification = new Notification({
        user: data.userId,
        message : data.message
    });
    await notification.save();
}


exports.getAllNotifications = async () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const notifications = await Notification.find({
        createdAt: { $gte: threeDaysAgo }
    });
    return notifications;
}
