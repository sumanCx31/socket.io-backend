const UserModel = require("../../user/user.model");
const AuthModel = require("./auth.model");


class AuthService {
  createAuthData = async (data) => {
    try {
      const auth = new AuthModel(data);
      return await auth.save();
    } catch (exception) {
      throw exception;
    }
  };

  getSingleRowByFilter = async (filter) => {
    try {
      return await AuthModel.findOne(filter);
    } catch (exception) {
      throw exception;
    }
  };

  deleteSingleRowByFilter = async (filter) => {
    try {
      return await UserModel.deleteOne(filter);
    } catch (exception) {
      throw exception;
    }
  };

  updateSingleRowByFilter = async (filter, data) => {
    try {
      return await AuthModel.findOneAndUpdate(
        filter,
        { $set: data },
        { new: true },
      );
    } catch (exception) {
      throw exception;
    }
  };
}

const authSvc = new AuthService();
module.exports = authSvc;
