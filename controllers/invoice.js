const Invoice = require('../models/invoices')
const { Chain, ctx } = require('../utils/chainConnect')

// Get user
exports.getInvoice = async(req, res, next) => {
    try {
        let mInvoice = await Invoice.get({ invoice_no: req.query.invoice_no }, 1)
        if (!mInvoice.docs.length > 0) {
            return res.status(400).json({ message: 'There is no Invoice in DB with this id!' })
        }

        let invoice = mInvoice.docs[0];

        try {
            console.log(await Chain.ReadAsset(ctx, invoice._id))
        } catch (err) {
            console.error(err)
        }

        if (invoice) {
            res.status(200).json({
                success: true,
                invoice: invoice
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'No invoice found!'
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

exports.insertInvoice = async(req, res, next) => {
    try {
        let invoiceParsed = req.body['invoice'];
        const newInvoice = {
            invoice_no: invoiceParsed['cbc:id'][0],
            date: invoiceParsed['cbc:issuedate'][0],
            amount: invoiceParsed['cac:legalmonetarytotal'][0]['cbc:payableamount'][0]['_'],
            currency: invoiceParsed['cac:legalmonetarytotal'][0]['cbc:payableamount'][0]['$']['currencyID'],
            supplier_taxpayer: invoiceParsed['cac:accountingsupplierparty'][0]['cac:party'][0]['cac:partyname'][0]['cbc:name'][0],
            customer_taxpayer: invoiceParsed['cac:accountingcustomerparty'][0]['cac:party'][0]['cac:partyname'][0]['cbc:name'][0],
        }

        let mInvoice = await Invoice.get({ invoice_no: newInvoice.invoice_no }, 1)
        if (mInvoice.docs.length > 0) {
            return res.status(400).json({ message: 'This invoice id is already created!' })
        }

        let invoiceCreate = await Invoice.create(newInvoice, function(err) {
            if (err) {
                throw err
            } else {
                console.log('inserted');
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1500));

        let invoice = await Invoice.get(newInvoice, 1)

        invoice = invoice.docs[0];

        console.log(await Chain.CreateAsset(ctx, invoice._id, invoice.invoice_no, invoice.date, invoice.amount, invoice.currency, invoice.supplier_taxpayer, invoice.customer_taxpayer))

        res.status(200).json({
            success: true,
            invoice: invoice,
        })

    } catch (err) {
        console.log(err);
        // sends response for 500 error
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment.",
            errorMessage: err.message
        })
    }
}