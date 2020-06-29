const Joi = require("@hapi/joi")
 
const RegisterValidation = (data)=>{
    const schema = Joi.object({
        fullName: Joi.string().required().min(5).max(80),
        userName: Joi.string().required().min(3).max(50),
        password: Joi.string().required().min(6).max(350),
        email: Joi.string().required().email(),
        walletAddress: Joi.string().required(),
        
    })
    return schema.validate(data)
}
const LoginValidation = (data)=>{
    const schema = Joi.object({
        userName: Joi.string().required().min(3).max(50),
        password: Joi.string().required().min(6).max(350),
    })
    return schema.validate(data)
}

module.exports.RegisterValidation = RegisterValidation;
module.exports.LoginValidation = LoginValidation;
