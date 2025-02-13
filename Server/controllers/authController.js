const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/passwordEncrypt');
const passport = require('passport');
require('../oauth/authentication');
const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express()
app.use(cookieParser());
app.use(express.json());

const test = (req, res) => {
    res.json('test is working')
}

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!username) {
            return res.json({
                err: 'enter a name to proceed'
            })
        };
        if (!email) {
            return res.json({
                err: 'enter a email to proceed'
            })
        } else if (!emailRegex.test(email)) {
            return res.json({
                err: 'enter email in the format of abc@gmail.com'
            })
        }
        if (!password) {
            return res.json({
                err: 'enter a password to proceed'
            })
        } else if (password.length < 6) {
            return res.json({
                err: 'password should be at least 6 characters'
            })
        };
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                err: 'Entered email is already registered with us!!'
            })
        };

        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.json(user)
    } catch (err) {
        console.log(err);
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({
                err: 'Sorry, No user found with the entered User name'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!password) {
            return res.json({
                err: 'Please enter the password'
            })
        }
        if (match) {
            jwt.sign({ email: user.email, id: user._id, name: user.username }, process.env.JWT_SECRET, { expiresIn: '4y' }, (err, token) => {
                if (err) throw err;
                res.cookie('token', token, { httpOnly: true });
                res.json({ user, role: user.role, token });
            })
        }
        if (!match) {
            return res.json({
                err: 'You have entered a wrong Password.Please Try Again'
            })
        }
    } catch (err) {
        console.log(err)
    }
}

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const oauth = passport.authenticate('google', { scope: ['email', 'profile'] });

const oauthResponse = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication failed. Please try again.' });
        }

        const existingUser = await User.findOne({ googleId: req.user.googleId });

        if (existingUser) {
            return res.status(200).json({
                message: 'User already exists',
                user: {
                    id: existingUser._id,
                    username: existingUser.username,
                    email: existingUser.email,
                    profilePicture: existingUser.profilePicture,
                },
            });
        }

        const newUser = new User({
            googleId: req.user.googleId,
            username: req.user.username,
            email: req.user.email,
            profilePicture: req.user.profilePicture,
        });

        const savedUser = await newUser.save();

        const accessToken = generateAccessToken(savedUser);
        const refreshToken = generateRefreshToken(savedUser);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Authentication successful',
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                profilePicture: savedUser.profilePicture,
            },
            tokens: { accessToken, refreshToken },
        });
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error. Please try again.' });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie('token')
    res.json({ message: 'Logged out Successfully' });
}

const getProfile = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) {
                res.clearCookie('token')
                return res.status(401).json({ err: 'You have been logged out for some security purpose.Kindly loginin again in order to book your food' });
            }
            res.json(user)
        })
    } else {
        res.json(null)
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    oauth,
    oauthResponse,
    getProfile,
    logoutUser
}