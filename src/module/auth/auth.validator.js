const Joi = require("joi");

const UserRegistrationDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password and confirm password do not match",
  }),
  status: Joi.string().valid("active", "inactive").default("inactive"),
  gender: Joi.string().valid("male", "female", "other").optional().allow(null),
});

const UserLoginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

module.exports = {
  UserRegistrationDTO,
  UserLoginDTO,
};
