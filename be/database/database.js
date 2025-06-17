const mongoose = require('mongoose');
exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Ket noi MongoDb thanh cong');

    } catch (error) {
        console.error('Loi ket noi MongoDb: ',error);
        process.exit(1);
    }
}

 