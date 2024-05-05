const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/passwordEncrypt')
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express()
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
            res.json({
                err: 'Please enter the password'
            })
        }
        if(match) {
            jwt.sign({email: user.email, id: user._id, name: user.username}, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
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

const getProfile = (req, res) => {
    const token = req.cookies.token;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) {
                return 'token expired'
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
    getProfile
}