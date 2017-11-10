'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
    type : {
        type  : String
    },
    date : {
        type  : String
    },
    description : {
        type  : String
    },
    transactionHash : {
        type  : String
    },
    status : {
        type  : String
    },
    amount    : {
        type  : String
    },
    userId    : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Transaction', transactionSchema, 'transaction');