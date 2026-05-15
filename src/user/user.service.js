const UserModel = require("./user.model");

class UserService {
  getUserPublicProfile(user) {
    return {
      name: user.name,
      email: user.email,
      status: user.status,
      _id: user._id,
      createdBy: user.createdBy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy,
    };
  }
  async createUser(data) {
    try {
      const user = new UserModel(data)
      return await user.save()
    } catch (exception) {
      throw exception
    }
  }

  getSingleUserByFilter = async (filter) => {
    try {
      const userData = await UserModel.findOne(filter);
      return userData;
    } catch (exception) {
      throw exception;
    }
  };
}

const userSvc = new UserService();
module.exports = userSvc;
