const User = require("../models/user.model");

class UserRepository {
    async getAllUsers() {
        return await User.find();
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async updateUser(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = new UserRepository();
