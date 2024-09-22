const express=require('express');
const { addTransaction, getAllTransaction, editTransaction, deleteTransaction } = require('../controllers/transactionCtrl');


//router object
const router= express.Router();

//routes
//Add transactions POST Method
router.post('/add-transaction', addTransaction);
//Edit transactions POST Method
router.post('/edit-transaction', editTransaction);
//Delete transactions POST Method
router.post('/delete-transaction', deleteTransaction);

//Get transactions
router.post('/get-transaction', getAllTransaction);

module.exports = router;