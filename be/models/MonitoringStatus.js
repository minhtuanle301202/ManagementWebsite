const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonitoringStatusSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    coordinates: {
        type: [Number],
        required:true
    },
    lastFaceVerifyTime: {
        type: Date,
    },
    lastUpdateLocationTime: {
        type:Date,
    },
    isMonitoringArea:{
        type:Boolean,
        default: true
    }
 },{
    timestamps: true 
 }
 
);

module.exports = mongoose.model('monitoringStatus',MonitoringStatusSchema,'monitoring_status');
