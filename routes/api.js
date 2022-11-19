const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middlewares/jwt')

const authRoute = require('./auth');
const userRoute = require('./user');
const invoiceRoute = require('./invoice');

router.use('/auth', authRoute)
router.use('/user', authenticateToken, userRoute)
router.use('/invoice', authenticateToken, invoiceRoute)


module.exports = router;