const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Assuming this is a Base64 string
        required: false,
    },
    address: {
        type: String,
        required: false, // Address stored as a single string
    }
});

const UserModel = mongoose.model('new_emon', UserSchema);
module.exports = UserModel;
