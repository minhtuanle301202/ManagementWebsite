const Joi = require('joi');

exports.validateSendOtpEmail = async(req,res,next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required()
            .messages({
                'string.email': 'Email không đúng định dạng',
                'any.required': 'Email là bắt buộc',
                'string.empty': 'Email không được để trống',
              }),
            newPassword: Joi.string().min(8).pattern(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).*$/).required()
            .messages({
                'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                'string.pattern.base': 'Mật khẩu phải chứa chữ cái, số và ký tự đặc biệt',
                'any.required': 'Mật khẩu là bắt buộc',
                'string.empty': 'Mật khẩu không được để trống',
              }),
            confirmNewPassword: Joi.string().required().valid(Joi.ref('newPassword'))
            .messages({'any.only': 'Mật khẩu không khớp với nhau'}),
            otp: Joi.string().length(6).pattern(/^\d+$/).required()
            .messages({
                'string.pattern.base':'Mã xác thực phải chỉ chứa các chứ số',
                'any.required':'Mã xác thực là bắt buộc'
            })

     
        }).unknown(true);
        await schema.validateAsync(req.body, {abortEarly: true});
        next();
    } catch(err) {
        res.status(400).json({message: err.details[0].message });
    }
}