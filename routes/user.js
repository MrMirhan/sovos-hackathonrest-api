const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/get', userController.getUser);
router.post('/update', userController.updateUser);

module.exports = router;