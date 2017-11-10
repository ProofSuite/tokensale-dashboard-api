'use strict';

var jwt = require('jsonwebtoken');

module.exports = {
    publicRouteValidate:function (method) {
        return function (req, res, next) {
            switch(method) {
                case 'login' :
                    req.checkBody('email', helpers.checkIfRequired('Email')).notEmpty()
                        .isEmail().withMessage(helpers.checkIfEmail('Email'))
                        .len(3, 100).withMessage(helpers.checkLength('Email', 3, 100));
                    req.checkBody('password', helpers.checkIfRequired('Password')).notEmpty();
                    break;

                case 'signup' :
                    console.log(req.body);
                    req.checkBody('firstName', helpers.checkIfRequired('First Name')).notEmpty()
                        .len(2, 50).withMessage(helpers.checkLength('Firs tName', 2, 50));

                    req.checkBody('lastName', helpers.checkIfRequired('Last Name')).notEmpty()
                        .len(2, 50).withMessage(helpers.checkLength('Last Name', 2, 50));

                    req.checkBody('email', helpers.checkIfRequired('Email')).notEmpty()
                        .isEmail().withMessage(helpers.checkIfEmail('Email'))
                        .len(3, 100).withMessage(helpers.checkLength('Email', 3, 100));

                    req.checkBody('password', helpers.checkIfRequired('Password')).notEmpty();

                    req.checkBody('encryptContainer', helpers.checkIfRequired('Encrypt Container')).notEmpty();

                    req.checkBody('country', helpers.checkIfRequired('Country')).notEmpty()
                        .len(2, 50).withMessage(helpers.checkLength('Country', 2, 50));

                    if (req.body.referralCode && req.body.referralCode !== '') {
                        req.checkBody('referralCode', helpers.checkIfRequired('Referral Code')).notEmpty()
                            .len(8,8).withMessage(helpers.checkLength('Referral Code', 8, 8));
                    }

                    req.checkBody('ethereumAddress', helpers.checkIfRequired('Ethereum Address')).notEmpty();

                    req.checkBody('telephoneNumber', helpers.checkIfRequired('Number')).notEmpty()
                        .len(4, 15).withMessage(helpers.checkLength('Number', 4, 15));

                    break;

                case 'verifyemailotp' :
                    req.checkBody('user', helpers.checkIfRequired('User')).notEmpty()
                        .isMongoId().withMessage(helpers.checkIfValidMongoId('User'));

                    req.checkBody('email', helpers.checkIfRequired('Email')).notEmpty()
                        .isEmail().withMessage(helpers.checkIfEmail('Email'));

                    req.checkBody('OTP', helpers.checkIfRequired('OTP')).notEmpty()
                        .isInt().withMessage(helpers.checkInt('OTP'))
                        .len(6, 6).withMessage(helpers.checkLength('OTP', 6, 6));

                    break;

                case 'resendemailotp' :
                    req.checkBody('userId', helpers.checkIfRequired('User ID')).notEmpty()
                        .isMongoId().withMessage(helpers.checkIfValidMongoId('User ID'));

                    req.checkBody('email', helpers.checkIfRequired('Email')).notEmpty()
                        .isEmail().withMessage(helpers.checkIfEmail('Email'));

                    break;

                case 'forgotPassword' :
                    req.checkBody('email', helpers.checkIfRequired('Email')).notEmpty()
                        .isEmail().withMessage(helpers.checkIfEmail('Email'));
                    break;

                case 'resetPassword' :
                    req.checkBody('email', helpers.checkIfRequired('Email')).notEmpty()
                        .isEmail().withMessage(helpers.checkIfEmail('Email'));
                    break;

                    req.checkBody('newPassword', helpers.checkIfRequired('New Password')).notEmpty();

            }
            req.getValidationResult().then( result => {
                var errors = result.useFirstErrorOnly();
                if (! errors.isEmpty()) {
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.PARAM_MISSING,
                        { 'error' : errors.array()[0].msg }
                    );
                } else {
                    next();
                }
            });
        }
    },

    userRouteValidate:function (method) {
        return function (req, res, next) {
            switch(method) {
                case 'index' :
                    if (typeof req.query.search !== 'undefined' && req.query.search)
                        req.checkQuery('search', helpers.checkIfValidJSON('search')).isJSON();
                    break;

                case 'show' :
                    req.checkParams('objectId', helpers.checkIfRequired('objectId')).notEmpty()
                        .isMongoId().withMessage(helpers.checkIfValidMongoId('objectId'));
                    break;

                case 'updateUserDetails' :
                    if (req.body.telephoneNumber) {
                        req.checkBody('telephoneNumber', helpers.checkIfRequired('Number')).notEmpty()
                            //.isNumeric().withMessage(helpers.checkIfNumeric('telephoneNumber Number'))
                            .len(4, 15).withMessage(helpers.checkLength('Number', 4, 15));
                    } else {
                        req.checkBody('oldPassword', helpers.checkIfRequired('Old Password')).notEmpty();
                        req.checkBody('status', helpers.checkIfRequired('Status')).notEmpty()
                            .isIn([true, false]).withMessage(helpers.checkIfValidEnum('Status', [true, false]));
                        if (req.body.status === 'true') {
                            req.checkBody('newPassword', helpers.checkIfRequired('New Password')).notEmpty()
                                .notEquals(req.body.oldPassword, req.body.newPassword).withMessage(helpers.checkIfNotEquals('Old password', 'new password'));
                        } else {
                            req.checkBody('newPassword', helpers.checkIfRequired('New Password')).notEmpty();
                        }
                        req.checkBody('encryptContainer', helpers.checkIfRequired('Encrypt Container')).notEmpty();
                    }
                    break;

                case 'updateSecureLogin' :
                    req.checkBody('password', helpers.checkIfRequired('Password')).notEmpty();
                    req.checkBody('status', helpers.checkIfRequired('status')).notEmpty()
                        .isIn([true, false]).withMessage(helpers.checkIfValidEnum('status', [true, false]));
                break;
            }
            req.getValidationResult().then( result => {
                var errors = result.useFirstErrorOnly();
                if (! errors.isEmpty()) {
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.PARAM_MISSING,
                        { 'error' : errors.array()[0].msg }
                    );
                } else {
                    next();
                }
            });
        }
    },

    transactionRouteValidate:function (method) {
        return function (req, res, next) {
            switch(method) {
                case 'index' :
                    if (typeof req.query.search !== 'undefined' && req.query.search)
                        req.checkQuery('search', helpers.checkIfValidJSON('search')).isJSON();
                    break;

                case 'store' :
                    req.checkBody('type', helpers.checkIfRequired('Type')).notEmpty();
                    req.checkBody('date', helpers.checkIfRequired('Date')).notEmpty();
                    req.checkBody('description', helpers.checkIfRequired('Description')).notEmpty();
                    req.checkBody('transactionHash', helpers.checkIfRequired('Transaction Hash')).notEmpty();
                    req.checkBody('status', helpers.checkIfRequired('Status')).notEmpty();
                    req.checkBody('amount', helpers.checkIfRequired('Amount')).notEmpty();

                    break;

                case 'show' :
                    req.checkParams('objectId', helpers.checkIfRequired('objectId')).notEmpty()
                        .isMongoId().withMessage(helpers.checkIfValidMongoId('objectId'));
                    break;

                case 'update' :
                    req.checkParams('objectId', helpers.checkIfRequired('objectId')).notEmpty()
                        .isMongoId().withMessage(helpers.checkIfValidMongoId('objectId'));

                    req.checkBody('status', helpers.checkIfRequired('status')).notEmpty();
                    break;
            }
            req.getValidationResult().then( result => {
                var errors = result.useFirstErrorOnly();
                if (! errors.isEmpty()) {
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.PARAM_MISSING,
                        { 'error' : errors.array()[0].msg }
                    );
                } else {
                    next();
                }
            });
        }
    },

    refercodeRouteValidate:function (method) {
        return function (req, res, next) {
            switch(method) {
                case 'index' :
                    if (typeof req.query.search !== 'undefined' && req.query.search)
                        req.checkQuery('search', helpers.checkIfValidJSON('search')).isJSON();
                    break;

                case 'store' :
                    req.checkBody('email', helpers.checkIfRequired('Email')).notEmpty()
                        .isEmail().withMessage(helpers.checkIfEmail('Email'))
                        .len(3, 100).withMessage(helpers.checkLength('Email', 3, 100));
                    req.checkBody('ethereumAddress', helpers.checkIfRequired('Ethereum Address')).notEmpty();

                    break;

                case 'show' :
                    req.checkParams('objectId', helpers.checkIfRequired('objectId')).notEmpty()
                        .isMongoId().withMessage(helpers.checkIfValidMongoId('objectId'));
                    break;
            }
            req.getValidationResult().then( result => {
                var errors = result.useFirstErrorOnly();
                if (! errors.isEmpty()) {
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.PARAM_MISSING,
                        { 'error' : errors.array()[0].msg }
                    );
                } else {
                    next();
                }
            });
        }
    },

    useJWTMiddleware:function() {
        return function (req, res, next) {
            var token = req.headers['authorization']; // Parse token from header
            if (token) {
                token = token.split(' ')[1];
                jwt.verify(token, config.JWT_SECRET, function(err, decoded) {
                    if (err) {
                        log('Error in JWT Middleware : ', err.message);
                        helpers.createResponse(res, constants.UNAUTHORIZED,
                            messages.PARAM_MISSING,
                            { 'error' : messages.INVALID_TOKEN}
                        );
                    }
                    else {
                        next();
                    }
                });
            } else {
                log('Token not provided');
                helpers.createResponse(res, constants.UNAUTHORIZED,
                    messages.PARAM_MISSING,
                    { 'error' : messages.ACCESS_TOKEN_REQUIRED }
                );
            }
        }
    },

    allowGuestRequests:function() {
        return function (req, res, next) {
            var token = req.headers['authorization']; // Parse token from header
            if (token) {
                token = token.split(' ')[1];
                jwt.verify(token, config.JWT_SECRET, function(err, decoded) {
                    if (err) {
                        if (token == constants.STATIC_TOKEN)
                            next();
                        else {
                            log('Error in Token : ', err.message);
                            helpers.createResponse(res, constants.UNAUTHORIZED,
                                messages.PARAM_MISSING,
                                { 'error' : messages.INVALID_TOKEN}
                            );
                        }
                    }
                    else {
                        next();
                    }
                });
            } else {
                log('Token not provided');
                helpers.createResponse(res, constants.UNAUTHORIZED,
                    messages.PARAM_MISSING,
                    { 'error' : messages.ACCESS_TOKEN_REQUIRED }
                );
            }
        }
    },

    secureOpenRoutes:function () {
        return function (req, res, next) {
            var token = req.headers['authorization']; // Parse token from header
            if (token) {
                token = token.split(' ')[1];
                if (token == constants.STATIC_TOKEN)
                    next();
                else {
                    log('Validator.js => Invalid token.');
                    helpers.createResponse(res, constants.UNAUTHORIZED,
                        messages.PARAM_MISSING,
                        {'error' : messages.INVALID_TOKEN}
                    );
                }
            } else {
                log('Token not provided');
                helpers.createResponse(res, constants.UNAUTHORIZED,
                    messages.PARAM_MISSING,
                    { 'error' : messages.ACCESS_TOKEN_REQUIRED }
                );
            }
        }
    },

    validatePaginationParams:function() {
        return function (req, res, next) {
            if (typeof req.query.records !== 'undefined' && req.query.records) {
                req.checkQuery('records', helpers.checkIfEqualsAll('records')).equals('all');
            } else {
                if (typeof req.query.sortOrder !== 'undefined' && req.query.sortOrder)
                    req.checkQuery('sortOrder', helpers.checkIfValidSortOrder('sortOrder', ['asc', 'desc'])).isIn(['asc', 'desc']);
                if (typeof req.query.pageNumber !== 'undefined' && req.query.pageNumber)
                    req.checkQuery('pageNumber', helpers.checkIfValidPageNumber('pageNumber')).isInt({min:1});
                if (typeof req.query.recordsPerPage !== 'undefined' && req.query.recordsPerPage)
                    req.checkQuery('recordsPerPage', helpers.checkIfValidPageNumber('recordsPerPage')).isInt({min:1});
            }
            req.getValidationResult().then( result => {
                var errors = result.useFirstErrorOnly();
                if (! errors.isEmpty()) {
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.PARAM_MISSING,
                        { 'error' : errors.array()[0].msg }
                    );
                } else {
                    next();
                }
            });
        }
    },

    checkAdminRole:function () {
        return function (req, res, next) {
            try {
                var user = jwt.verify(req.headers['authorization'].split(' ')[1], config.JWT_SECRET);
                if (typeof user.role === 'undefined' || user.role !== 'admin') {
                    log('Validator.js => User is not permitted for operation.');
                    helpers.createResponse(res, constants.UNAUTHORIZED,
                        messages.UNAUTHORIZED_ACCESS,
                        {'error' : messages.UNAUTHORIZED_ACCESS}
                    );
                } else {
                    next();
                }
            } catch (err) {
                //JWT Expiration error handled
                log('Validator.js => checkAdminRole catch : ', err);
                helpers.createResponse(res, constants.UNAUTHORIZED,
                    messages.INVALID_TOKEN,
                    {'error' : messages.INVALID_TOKEN}
                );
            }
        }
    },

    checkUserRole:function () {
        return function (req, res, next) {
            try {
                var user = jwt.verify(req.headers['authorization'].split(' ')[1], config.JWT_SECRET);
                if (typeof user.role === 'undefined' || user.role !== 'user') {
                    log('Validator.js => User is not permitted for operation.');
                    helpers.createResponse(res, constants.UNAUTHORIZED,
                        messages.UNAUTHORIZED_ACCESS,
                        {'error' : messages.UNAUTHORIZED_ACCESS}
                    );
                } else {
                    next();
                }
            } catch (err) {
                //JWT Expiration error handled
                log('Validator.js => checkUserRole catch : ', err);
                helpers.createResponse(res, constants.UNAUTHORIZED,
                    messages.INVALID_TOKEN,
                    {'error' : messages.INVALID_TOKEN}
                );
            }
        }
    }
};