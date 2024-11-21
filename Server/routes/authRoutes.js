const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser,loginUser, oauth, oauthResponse, getProfile, logoutUser } = require('../controllers/authController')

//middleware
router.use(
    cors({
        credentials: true,
        origin: process.env.FRONT_END_ROUTE
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/auth/google', oauth)
router.get('/google/callback', oauthResponse)
router.get('/profile', getProfile)
router.get('/logout', logoutUser)

module.exports = router;