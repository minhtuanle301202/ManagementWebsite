const Joi = require('joi');
const { Schema } = require('mongoose');

exports.validateRegister = async (req,res,next) => {
    try {
        const schema = Joi.object({
            cardId: Joi.string().length(12).pattern(/^\d+$/).required().messages({
                'string.pattern.base':'Số CCCD phải chỉ chứa các chứ số',
                'string.length':'Số CCCD phải có độ dài 12 kí tự',
                'any.required':'Số CCCD là bắt buộc',
                'string.empty': 'Số CCCD không được để trống' 
            }), 
            fullName: Joi.string().min(1).required()
            .messages({
                'string.empty': 'Họ và tên không được để trống',
                'any.required': 'Họ và tên là bắt buộc',
                'string.min': 'Họ và tên không hợp lệ',
              }),
            password: Joi.string().min(8).pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).*$/).required()
            .messages({
                'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                'string.pattern.base': 'Mật khẩu phải chứa chữ cái, số và ký tự đặc biệt',
                'any.required': 'Mật khẩu là bắt buộc',
                'string.empty': 'Mật khẩu không được để trống',
              }),
            phone: Joi.string().length(10).pattern(/^\d+$/).required()
            .messages({
                'string.length': 'Số điện thoại phải có đúng 10 chữ số',
                'string.pattern.base': 'Số điện thoại chỉ được chứa các chữ số',
                'any.required': 'Số điện thoại là bắt buộc',
                'string.empty': 'Số điện thoại không được để trống',
              }),
            email: Joi.string().email().required()
            .messages({
                'string.email': 'Email không đúng định dạng',
                'any.required': 'Email là bắt buộc',
                'string.empty': 'Email không được để trống',
              }),
        }).unknown(true);

        await schema.validateAsync(req.body, { abortEarly: true });
        next();
    } catch (err) {
        res.status(400).json({ message: err.details[0].message });
    }
}

exports.validateLogin = async (req,res,next) => {
    try{
        const schema = Joi.object({
            username: Joi.string().length(12).pattern(/^\d+$/).required().messages({
                'string.pattern.base':'Số CCCD phải chỉ chứa các chứ số',
                'string.length':'Số CCCD phải có độ dài 12 kí tự',
                'any.required':'Số CCCD là bắt buộc',
                'string.empty': 'Số CCCD không được để trống' 
            }),
            password: Joi.string().min(8).pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).*$/).required()
            .messages({
                'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                'string.pattern.base': 'Mật khẩu phải chứa chữ cái, số và ký tự đặc biệt',
                'any.required': 'Mật khẩu là bắt buộc',
                'string.empty': 'Mật khẩu không được để trống',
              }),
        });

        await schema.validateAsync(req.body, {abortEarly:true});
        next();
    } catch(err) {
        res.status(400).json({ message: err.details[0].message });
    }

}

