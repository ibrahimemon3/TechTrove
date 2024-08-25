const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

const signup = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { name, email, password, image, address } = req.body;

        // Check if the user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ 
                message: 'User already exists, you can login', 
                success: false 
            });
        }

        // Create a new user instance including the address
        const userModel = new UserModel({ 
            name, 
            email, 
            password, 
            image, 
            address // Include the address field
        });

        // Hash the password before saving
        userModel.password = await bcrypt.hash(password, 10);

        // Save the user to the database
        await userModel.save();

        // Respond with a success message
        res.status(201).json({
            message: "Signup successful",
            success: true
        });

    } catch (err) {
        // Handle any errors
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        console.log("User data:", user);
        const errorMsg = 'Auth failed, email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            user // You can include the address here if needed
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

module.exports = {
    signup,
    login
};
