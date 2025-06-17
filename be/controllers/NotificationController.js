const NotificationService = require('../services/NotificationService');

exports.createNotification = async (req,res) => {
    try {
        const data = req.body;
        await NotificationService.createNotification(data);
        res.status(200).json({message: 'Tạo thông báo thành công'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
} 

exports.getAllNotifications = async(req,res) => {
    try {
        const notifications = await NotificationService.getAllNotifications();
        res.status(200).json({notifications});
    } catch(err) {
        res.status(400).json({message:err.message});
    }
}

