const Joi = require('joi');

const User = Joi.object().keys({
    news_title: Joi.string()
        .min(10)
        .max(255)
        .required(),
    
    news_title: Joi.string()
        .min(10)
        .max(255)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
})

module.exports = User;