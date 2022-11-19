const User = require('../models/users')

// Get user
exports.getUser = async(req, res, next) => {
    try {
        let mUser = await User.get({ _id: req.query.id }, 0)
        console.log(mUser)
        if (!mUser.docs.length > 0) {
            return res.status(400).json({ message: 'User is not signed up!' })
        }

        let user = mUser.docs[0];
        // remove password from user
        // Respond to User
        if (user) {
            user.hash = undefined
            user.salt = undefined
            res.status(200).json({
                success: true,
                user: user
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'No user found!'
            })
        }
    } catch (err) {
        console.log(err);
        // sends response for 500 error
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment.",
            errorMessage: err.message
        })
    }
}

// Update user
exports.updateUser = async(req, res, next) => {
    try {
        let mUser = await User.get({ "_id": req.body._id }, 0)
        if (!mUser.docs.length > 0) {
            return res.status(400).json({ message: 'User is not signed up!' })
        }

        let user = mUser.docs[0];

        await User.update(req.body, function(err) {
            if (err) {
                throw err
            } else {
                console.log('updated');
            }
        });

        await new Promise(r => setTimeout(r, 1000));

        let uUser = await User.get({ "_id": req.body._id }, 0)

        user = uUser.docs[0];

        console.log(uUser);
        // remove password from user
        // Respond to User
        if (user) {
            user.hash = undefined
            user.salt = undefined
            res.status(200).json({
                success: true,
                user: uUser
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'No user found!'
            })
        }
    } catch (err) {
        // sends response for 500 error
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment.",
            errorMessage: err.message
        })
    }
}