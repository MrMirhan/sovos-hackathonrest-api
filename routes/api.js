const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middlewares/jwt')

const authRoute = require('./auth');
const userRoute = require('./user');

router.use('/auth', authRoute)
router.use('/user', authenticateToken, userRoute)

module.exports = router;