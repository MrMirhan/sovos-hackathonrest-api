const User = require('../models/users')
const utils = require('../lib/utils');
const crypto = require("crypto");

// Adds new user
exports.postAddUser = async(req, res, next) => {
    try {
        // Get all fields from the clients
        const { email, password, confirm_password } = req.body;
        let mUser = await User.get({ email: email }, 1)

        if (mUser.docs.length > 0) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Check if password and confirm password match
        if (password !== confirm_password) {
            return res.status(401).json({
                message: 'Passwords does not match!'
            })
        }
        // Passport
        const saltHash = utils.genPassword(password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        // Save new User
        const newuser = {
            username: email.split('@')[0],
            email: email,
            hash: hash,
            salt: salt
        }

        let userCreate = await User.create(newuser, function(err) {
            if (err) {
                throw err
            } else {
                console.log('inserted');
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        let user = await User.get(newuser, 0)

        user = user.docs[0];

        // Respond to User
        if (user) {
            user.hash = undefined
            user.salt = undefined
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({
                success: true,
                user: user,
                token: tokenObject.token,
                expiresIn: tokenObject.expires
            })
        }
    } catch (err) {
        console.log(err);
        // sends response for 500 error
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

//  User login to the application
exports.postUserLogin = async(req, res, next) => {
    try {
        // Get fields from client
        const { email, password } = req.body;
        // Check fi username exist
        let mUser = await User.get({ email: email }, 1)

        if (!mUser.docs.length > 0) {
            return res.status(400).json({ message: 'User is not signed up!' })
        }

        let user = mUser.docs[0];
        // Check if password matches
        const isValid = utils.validPassword(password, user.hash, user.salt)
        if (isValid) {
            // return user object for authentication
            user.hash = undefined
            user.salt = undefined
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({
                success: true,
                user: user,
                token: tokenObject.token,
                expiresIn: tokenObject.expires
            })
        } else {
            // Return error for wrong credentials
            return res.status(401).json({
                message: "You entered the wrong credentials!"
            });
        }
    } catch (err) {
        console.log(err);
        // sends response for 500 error
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}