const Joi = require('joi');

exports.validateSignup = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
  });
  
  return schema.validate(data);
};

exports.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  });
  
  return schema.validate(data);
};

exports.validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    price: Joi.number().required().positive()
  });
  
  return schema.validate(data);
};
