const MonitoringStatus = require('../models/MonitoringStatus');
const User = require('../models/User');
const Notification = require('../models/Notification');


exports.createMonitoringStatus = async (userId,data) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');
    const { coordinates,lastFaceVerifyTime,lastUpdateLocationTime} = data;
    const monitoringStatus = new MonitoringStatus({
        user: userId,
        coordinates,
        lastFaceVerifyTime,
        lastUpdateLocationTime
    });
    await monitoringStatus.save();
};

exports.updateMonitoringStatus = async (userId,data) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');

    const monitoringStatus = await MonitoringStatus.findOne({user:userId});
    if (!monitoringStatus) {
        const result = await exports.createMonitoringStatus(userId,data);
        return result;
    } else {
        const newMonitoringStatus = await MonitoringStatus.findByIdAndUpdate(monitoringStatus._id,data, {new:true});
        const isInside = isPointInPolygon(user.points,newMonitoringStatus.coordinates);
        let notification = null;
        if (!isInside) {
            if (newMonitoringStatus.isMonitoringArea) {
                    notification = new Notification({
                    user: userId,
                    message: `Đối tượng ${user.fullName} - ${user.cardId} đang không ở trong vùng kiểm soát` 
                });
                newMonitoringStatus.isMonitoringArea = false;
                await notification.save();
            } 
        } else {
            if (!newMonitoringStatus.isMonitoringArea) {
                newMonitoringStatus.isMonitoringArea = true;
            }
        }
        await newMonitoringStatus.save();
        return newMonitoringStatus;
    }
}

exports.getAllMonitoringStatus = async () => {
    return await MonitoringStatus.find()
    .populate({
        path: 'user',
        select: 'cardId fullName' 
      });
}

function setVector(a, b) {
    return [b[0] - a[0], b[1] - a[1]];
}

function calculateAngle(vectorA, vectorB) {
    let dotProduct = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
    let magnitudeA = Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2);
    let magnitudeB = Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2);
    return Math.acos(dotProduct / (magnitudeA * magnitudeB));
}

function isPointInPolygon(polygon, point) {
    let sum = 0;
    let n = polygon.length-1;
    
    for (let i = 0; i < n; i++) {
        let vectorA = setVector(polygon[i], point);
        let vectorB = setVector(polygon[i + 1], point);
        sum += calculateAngle(vectorA, vectorB);
    }
    
    let vectorA = setVector(polygon[n - 1], point);
    let vectorB = setVector(polygon[0], point);
    sum += calculateAngle(vectorA, vectorB);
    
    return Math.abs(sum - 2 * Math.PI) <= 0.01;
}