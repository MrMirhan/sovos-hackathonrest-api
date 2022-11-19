const User = require('../models/users')


// Get user
exports.getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.query.id);
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