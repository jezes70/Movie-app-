import Joi from "joi"

export const registerUserSchema = Joi.object().keys({
    email: Joi.string().lowercase().required(),
    fullName:Joi.string().required(),
    userName: Joi.string().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password:Joi.any().equal(Joi.ref('password')).required().label
    ('confirm password').messages({'any.only': '{{#label}} does not match'})
}) 

export const options = {
    abortEarly: false,
    errors:{
        wrap:{
            label:''
        }
            
    }
       
    
    
} 


export const loginUserSchema = Joi.object().keys({
    email: Joi.string().lowercase().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    
})

export const updateMovieSchema = Joi.object().keys({
    description: Joi.string(),
    title: Joi.string(),
    price: Joi.number(),
    image: Joi.string()
})