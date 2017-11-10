'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName : {
        type  : String
    },
    lastName  : {
        type  : String
    },
    email     : {
        type  : String,
        lowercase : true
    },
    password  : {
        type  : String
    },
    emailOtp       : {
        type  : Number
    },
    emailOtpCreatedAt : {
        type  : Date
    },
    encryptContainer : {
        type  : String
    },
    telephoneNumber : {
        type  : String
    },
    country   : {
        type  : String
    },
    referralCode : {
        type  : String
    },
    referredBy : {
        email : String,
        code  : String
    },
    ipAddress : {
        type  : String
    },
    ethereumAddress : {
        type  : String
    },
    is2FAOn   : {
        type     : Boolean,
        default  : false
    },
    isAuthenticated : {
        type     : Boolean,
        default  : false
    }
}, {timestamps: true});

userSchema.methods.getUser = function() {
    var userDetail = {
        id                  : this._id,
        firstName           : this.firstName,
        lastName            : this.lastName,
        telephoneNumber     : this.telephoneNumber,
        country             : this.country,
        referralCode        : this.referralCode,
        email               : this.email,
        is2FAOn             : this.is2FAOn,
        encryptContainer    : this.encryptContainer
    };
    return userDetail;
};

module.exports = mongoose.model('User', userSchema, 'users');