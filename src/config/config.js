require("dotenv").config();

const DbConfig = {
  mongoDBUrl: process.env.MONGODB_URL,
  mongoDBName: process.env.MONGODB_NAME,
};

const jwtConfig = { 
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
};

module.exports = {
  DbConfig,
    jwtConfig,
};