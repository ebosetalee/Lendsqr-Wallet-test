import Joi from "joi";

export const CREATE = Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
    balance: Joi.number().optional(),
});

export const SIGNIN = Joi.object().keys({
    email: Joi.string().required(),
    account_number: Joi.number().required().min(9),
});
