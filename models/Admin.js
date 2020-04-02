const Joi = require('joi');

const Admin = Joi.object().keys({

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    hash: Joi.string().required(),
})

module.exports = Admin;