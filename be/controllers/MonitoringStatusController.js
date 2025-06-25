const MonitoringStatusService = require('../services/MonitoringStatusService');

exports.createMonitoringStatus = async (req,res) => {
    try {
        
        const {userId,coordinates} = req.body;
        const monitoringStatus = await MonitoringStatusService.createMonitoringStatus(userId,coordinates);
        res.status(201).json({message: 'Vị trí được tạo thành công',monitoringStatus});
    } catch(err) {
        res.status(400).json({message:err.message});
    }
}

exports.updateMonitoringStatus = async (req,res) => {
    try {
        const userId = req.body.user;
        const newMonitoringStatus = await MonitoringStatusService.updateMonitoringStatus(userId,req.body);
        res.status(200).json(newMonitoringStatus);
    } catch(err) {
        res.status(400).json({message: err.message});
    }
}

exports.getAllMonitoringStatus = async (req,res) => {
    try {
        const allMonitoringStatus = await MonitoringStatusService.getAllMonitoringStatus();
        if (!allMonitoringStatus) throw new Error('Không tồn tại bản ghi nào'); 
        res.status(200).json(allMonitoringStatus);
    } catch(err) {
        res.status(500).json({message:Error.message})
    }
}

