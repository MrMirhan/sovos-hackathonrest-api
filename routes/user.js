const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/get', userController.getUser);

module.exports = router;