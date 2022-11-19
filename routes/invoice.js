const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice');
var xmlparser = require('express-xml-bodyparser');

router.get('/get', invoiceController.getInvoice);
router.use(xmlparser());
router.post('/create', invoiceController.insertInvoice);

module.exports = router;