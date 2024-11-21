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
        if(!username) {
            return res.json({
                err: 'enter a name to proceed'
            })
        };
        if(!email) {
            return res.json({
                err: 'enter a email to proceed'
            })
        } else if(!emailRegex.test(email)) {
            return res.json({
                err: 'enter email in the format of abc@gmail.com'
            })
        }
        if(!password) {
            return res.json({
                err: 'enter a password to proceed'
            })
        } else if(password.length < 6) {
            return res.json({
                err: 'password should be at least 6 characters'
            })
        };
        const exist = await User.findOne({ email });
        if(exist) {
            return res.json({
                err: 'Entered email is already registered with us!!'
            })
        };

        const hashedPassword  = await hashPassword(password)
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.json(user)
    } catch(err) {
        console.log(err);
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) {
            return res.json({
                err: 'Sorry, No user found with the entered User name'
            })
        }
        const match = await comparePassword(password, user.password)
        if(!password) {
            return res.json({
                err: 'Please enter the password'
            })
        }
        if(match) {
            jwt.sign({email: user.email, id: user._id, name: user.username}, process.env.JWT_SECRET, {expiresIn: '4y'}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token, { httpOnly: true });
                res.json({ user, role: user.role, token });
            })
        }
        if(!match) {
            return res.json({
                err: 'You have entered a wrong Password.Please Try Again'
            })
        }
    } catch(err) {
        console.log(err)
    }
}

const oauth = passport.authenticate('google', { scope: ['email', 'profile'] });

const oauthResponse = (req, res, next) => {
    console.log("entering response page");
    passport.authenticate('google', async (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. Please try again.' });
        }

        try {
            let existingUser = await User.findOne({ googleId: user.id });

            if (!existingUser) {
                const newUser = new User({
                    googleId: user.id,
                    username: user.displayName,
                    email: user.email,
                    profilePicture: user.picture,
                });

                existingUser = await newUser.save();
            }

            req.logIn(existingUser, (err) => {
                if (err) {
                    console.error('Login error:', err);
                    return res.status(500).json({ message: 'Login failed. Please try again.' });
                }

                return res.redirect('http://localhost:5173/');
            });
        } catch (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error. Please try again.' });
        }
    })(req, res, next);
};

const logoutUser = async (req, res) => {
    res.clearCookie('token')
    res.json({ message: 'Logged out Successfully'});
}

const getProfile = (req, res) => {
    const token = req.cookies.token;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) {
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