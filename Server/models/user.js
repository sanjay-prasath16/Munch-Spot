const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    accountid: { type:String, required: false },
    password: { type: String, required: false },
    socialMedia: {
        provider: { type: String },
        providerId: { type: String },
        accessToken: { type: String },
    },
    role: {
        type: String,
        default: "visitor"
    }
})

const UserModel = mongoose.model("local_register", UserSchema);
module.exports = UserModel;