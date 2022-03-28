import Joi from "joi";

export const FUND = Joi.object().keys({
    amount: Joi.number().required(),
});

export const TRANSFER = Joi.object().keys({
    amount: Joi.number().required(),
    account_number: Joi.number().required(),
    id: Joi.string().required(),
});
