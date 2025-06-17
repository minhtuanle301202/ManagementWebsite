const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    cardId: { 
        type: String,
        required: true,
        unique:true,
        trim: true,
        maxlength:12
    },
    fullName: {
        type:String,
        require:true,
        trim: true
    },
    dateOfBirth: {
        type:Date,
        require:true
    },
    gender: {
        type:String,
        required: true,
        enum: ['Nam', 'Nữ', 'Khác']
    },
    nationality: {
        type: String,
        required: true,
        default: "Việt Nam"
    },
    placeOfOrigin: {
        type: String,
        required: true,
        trim: true
    },
    placeOfResidence: {
        type: String,
        required: true,
        trim:true
    },
    points: {
        type: [[Number]],
        required:true
    },
    password: {
        type:String,
        required: true
    },
    email: {
        type:String,
        unique:true,
        required: true,
        trim: true 
    },
    phone: {
        type:String,
        unique:true,
        required: true,
        trim: true 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

UserSchema.index({fullName: 'text'});

UserSchema.pre("save",async function (next) {
        if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
})

module.exports = mongoose.model("user",UserSchema);