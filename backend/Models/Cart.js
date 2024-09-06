const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    category: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: false }, 
});

const CartModel = mongoose.model('Cart', CartSchema);
module.exports = CartModel;

