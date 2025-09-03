import User from '../models/user.model.js'
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import createError from '../utils/createError.js';
export async function register(req, res, next) {
    try {
        const { username, email, password, country, img, phone, desc, isSeller } = req.body || {};

        if (!username || !email || !password || !country) {
            return res.status(400).json({
                message: "Missing required fields",
                required: ["username", "email", "password", "country"],
            });
        }

        const hash = bcrypt.hashSync(String(password), 5);
        const newUser = new User({
            username,
            email,
            password: hash,
            country,
            img,
            phone,
            desc,
            isSeller,
        });
        await newUser.save();
        res.status(201).send("user created");
    } catch (err) {
        // Handle duplicate key errors from MongoDB/Mongoose
        if (err && err.code === 11000) {
            return res.status(409).json({
                message: "Username or email already exists",
                keyValue: err.keyValue,
            });
        }
        // Validation errors
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                details: err.errors,
            });
        }
        next(err);
    }
}
export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, 'User not found'));

        const iscorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!iscorrect) return next(createError(400, 'wrong password'));

        if (!process.env.JWT_KEY) {
            return next(createError(500, 'Server misconfiguration: missing JWT_KEY'));
        }
        const token = Jwt.sign({
            id: user._id,
            isSeller: user.isSeller,
        }, process.env.JWT_KEY);
        const { password, ...info } = user._doc;
        res.cookie("accessToken", token,
            { httpOnly: true }
        ).status(200).send(info);
    } catch (error) {
        next(error);
    }
}
export const logout = async (req, res) => {
    res.clearCookie("accessToken", {
        sameSite: "none",
        secure: true
    }).status(200).send("User has been logout");
}