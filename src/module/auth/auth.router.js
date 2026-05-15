const bodyValidator = require('../../middleware/auth.validator');
const authcltr = require('./auth.controller');
const {UserLoginDTO,UserRegistrationDTO} = require('./auth.validator');
const authRouter = require('express').Router();

authRouter.post("/register",bodyValidator(UserRegistrationDTO),authcltr.register);
authRouter.post("/login",bodyValidator(UserLoginDTO),authcltr.login);
authRouter.put("/update-password",authcltr.updatePassword);
authRouter.delete("/delete-account",authcltr.deleteAccount);

module.exports = authRouter;