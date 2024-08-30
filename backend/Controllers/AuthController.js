const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }  // Shorter expiration for access token
    );

    const refreshToken = jwt.sign(
        { email: user.email, _id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }  // Longer expiration for refresh token
    );

    return { accessToken, refreshToken };
};


const signup = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { name, email, password, image, address } = req.body;

        
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ 
                message: 'User already exists, you can login', 
                success: false 
            });
        }

        
        const userModel = new UserModel({ 
            name, 
            email, 
            password, 
            image, 
            address,
            admin: false 
        });

       
        userModel.password = await bcrypt.hash(password, 10);

       
        await userModel.save();

       
        res.status(201).json({
            message: "Signup successful",
            success: true
        });

    } catch (err) {
        
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
        const errorMsg = 'Auth failed, email or password is wrong';
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        res.status(200).json({
            message: "Login Success",
            success: true,
            accessToken,
            refreshToken,
            user
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required", success: false });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const accessToken = jwt.sign(
            { email: decoded.email, _id: decoded._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ accessToken, success: true });
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token", success: false });
    }
};

module.exports = {
    signup,
    login,
    refreshAccessToken
};