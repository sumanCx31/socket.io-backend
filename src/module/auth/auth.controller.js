const userSvc = require("../../user/user.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("./auth.model");
const { jwtConfig } = require("../../config/config");
const authSvc = require("./auth.service");
const randomStringGenerator = require("../../../utilities/helper");

class AuthController {
  login = async (req, res) => {
    const {email,password} = req.body;
    const userData = await userSvc.getSingleUserByFilter({email:email});
    
    if(!userData){
        throw{
            code:404,
            message:"User not found",
            status:"USER_NOT_FOUND"
        }
    }
    const isPasswordValid = await bcrypt.compare(password,userData.password);
    if(!isPasswordValid){
        throw{
            code:401,
            message:"Invalid credentials",
            status:"INVALID_CREDENTIALS"
        }
    }

    const accessToken = jwt.sign(
        {
          sub: userData._id,
          typ: "Bearer",
        },
        jwtConfig.secret,
        {
          expiresIn: "1h",
        },
      );
      const refreshToken = jwt.sign(
        {
          sub: userData._id,
          typ: "Refresh",
        },
        jwtConfig.secret,
        {
          expiresIn: "1d",
        },
      );

      const maskedAccessToken = randomStringGenerator(150);
      const maskedRefreshToken = randomStringGenerator(150);

      const authData = {
        userId: userData._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        maskedAccessToken: maskedAccessToken,
        maskedRefreshToken: maskedRefreshToken,
      };
      await AuthModel.create(authData);
      // console.log("Login success");

      res.json({
        data: {
          accessToken: maskedAccessToken,
          refreshToken: maskedRefreshToken,
        },
        message: "Welcome !!!! " + userData.name ,
        status: "LOGIN_SUCCESS",
        options: null,
      });
  };


  register = async (req, res) => {
    try {
      const data = req.body;
      data.status = "active";
      data.password = await bcrypt.hash(data.password, 12);
      const createdUser = await userSvc.createUser(data);

      
      const mappedData = userSvc.getUserPublicProfile(createdUser);
      mappedData.password = createdUser.password;
    
      res.json({
        data: mappedData,
        message: "Register Successfull",
        status: "SUCCESS",
      });
    } catch (exception) {
      throw exception;
    }
  };


  updatePassword = async (req,res)=>{
    try {
      const accessToken = req.headers["authorization"] || null;
      if (!accessToken) {
        throw {
          code: 401,
          message: "Unauthorized",
          status: "UNAUTHORIZED",
        };
      }
      const token = accessToken.replace("Bearer ", "");
      const authData = await authSvc.getSingleRowByFilter({
        maskedAccessToken: token,
      });
      if (!authData) {
        throw {
          code: 401,
          message: "Token not found",
          status: "UNDEFINED_TOKEN",
        };
      }
      const data = jwt.verify(authData.accessToken, jwtConfig.secret);
      if (data.typ !== "Bearer") {
        throw {
          code: 401,
          message: "Bearer token expected",
          status: "BEARER_TOKEN_EXPECTED",
        };
      }
      const user = await userSvc.getSingleUserByFilter({
        _id: data.sub,
      });
      if (!user) {
        throw {
          code: 403,
          message: "User not found or may have been deleted from the system",
          status: "USER_NOT_FOUND",
        };
      }
      const {oldPassword,newPassword} = req.body;
      const isPasswordValid = await bcrypt.compare(oldPassword,user.password);
      if(!isPasswordValid){
        throw{
          code:401,
          message:"Invalid current password",
          status:"UNAUTHORIZED"
        }
      }
      const hashedNewPassword = await bcrypt.hash(newPassword,10);
      user.password = hashedNewPassword;
      await user.save();

      res.json({
        message:"Password updated successfully. Please login again.",
        status:"success"
      })
    } catch (exception) {
      throw exception;
    }
  }

  deleteAccount = async (req,res)=>{
    try {
        const accessToken = req.headers["authorization"] || null;
        if (!accessToken) {
            throw {
            code: 401,
            message: "Unauthorized",
            status: "UNAUTHORIZED",
            };
        }
        const token = accessToken.replace("Bearer ", "");
        const authData = await authSvc.getSingleRowByFilter({
            maskedAccessToken: token,
        });
        if (!authData) {
            throw {
            code: 401,
            message: "Token not found",
            status: "UNDEFINED_TOKEN",
            };
        }
        const data = jwt.verify(authData.accessToken, jwtConfig.secret);
        if (data.typ !== "Bearer") {
            throw {
            code: 401,
            message: "Bearer token expected",
            status: "BEARER_TOKEN_EXPECTED",
            };
        }
        const user = await userSvc.getSingleUserByFilter({
            _id: data.sub,
        });
        if (!user) {
            throw {
            code: 403,
            message: "User not found or may have been deleted from the system",
            status: "USER_NOT_FOUND",
            };
        }
        const userEmail = user.email;
        await authSvc.deleteSingleRowByFilter({ email: userEmail });

        res.json({
            message: `Account with email ${userEmail} has been deleted successfully.`,
            status: "success"
        })
    } catch (exception) {
        throw exception;
    }
}
}

const authcltr = new AuthController();

module.exports = authcltr;
