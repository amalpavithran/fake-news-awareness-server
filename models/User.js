const Joi = require('joi');

const User = Joi.object().keys({
    news: Joi.string()
        .min(10)
        .max(255)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
})

module.exports = User;