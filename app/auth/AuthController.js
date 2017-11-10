'use strict';

var User        = require(BASE_PATH + '/app/components/User/UserSchema');
var mail        = require(BASE_PATH + '/app/mailer/mail');
var Refercode   = require(BASE_PATH + '/app/components/Refercode/RefercodeSchema');

module.exports = {

    /**
     * login() allows user to login to the
     * system if credentials are correct
     *
     * @url {{URL}}/login
     * @param <String> email, password
     * @return <Element> User element with login token
     */

    login:function(req, res) {
        helpers.findOne(res, User, constants.USER_MODEL_NAME,
            {email: new RegExp(req.body.email, 'i'), password: req.body.password}, {},
            function (user) {
                if (!user) {
                    log('Email and password does not match.');
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.WRONG_CREDENTIALS,
                        {'error': messages.WRONG_CREDENTIALS}
                    );
                } else {
                    if (! user.isAuthenticated) {
                        log('User is not yet authenticated.');
                        var OTPCode = helpers.getRandom(100000, 999999);
                        helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                            {_id: user._id},
                            {$set: {emailOtp  : OTPCode, emailOtpCreatedAt : Date.now()}},
                            {new: true, runValidators: true},
                            function (updatedUser) {
                                var sendData = {
                                    userId: updatedUser._id,
                                    email: updatedUser.email
                                };
                                helpers.sendHtmlMail(
                                    {
                                        otp: OTPCode,
                                        firstName: updatedUser.firstName,
                                        lastName: updatedUser.lastName
                                    },
                                    updatedUser.email, 'Login Email - Proof Token Sale', BASE_PATH + '/views/emails/verifyEmailOtp.hbs'
                                );
                                helpers.createResponse(res, constants.SUCCESS,
                                    messages.ACC_VERIFICATION_PENDING,
                                    {'data': sendData}
                                );
                            }
                        );
                    } else if (user.is2FAOn) {
                        var OTPCode = helpers.getRandom(100000, 999999);
                        helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                            {_id: user._id},
                            {$set: {emailOtp  : OTPCode, emailOtpCreatedAt : Date.now()}},
                            {new: true, runValidators: true},
                            function (updatedUser) {
                                var sendData = {
                                    userId : updatedUser._id,
                                    email  : updatedUser.email
                                };
                                helpers.sendHtmlMail(
                                    {
                                        otp: OTPCode,
                                        firstName : updatedUser.firstName,
                                        lastName : updatedUser.lastName
                                    },
                                    updatedUser.email, 'Login Email - Proof Token Sale', BASE_PATH + '/views/emails/verifyEmailOtp.hbs'
                                );
                                log('2FA is on! Please ask for OTP.');
                                helpers.createResponse(res, constants.SUCCESS,
                                    messages.SECURE_VERIFICATION,
                                    {'data': sendData}
                                );
                            }
                        );
                    } else {
                        var sendData = user.getUser();
                        var jwtToken = {
                            _id       : user._id,
                            firstName : user.firstName,
                            lastName  : user.lastName,
                            email     : user.email
                        };
                        log('Login Successful : ');
                        helpers.createResponse(res, constants.SUCCESS,
                            messages.LOGIN_SUCCESS,
                            {'data' :
                                {
                                    'token': helpers.generateToken(jwtToken),
                                    'user' : sendData
                                }
                            }
                        );
                    }
                }
            }
        );
    },

    /**
     * signup() allows user to signup to the
     * system with input data
     *
     * @url {{URL}}/signup
     * @param <String> firstName, lastName, email, password, country
     * @param <Number> telephoneNumber
     * @return <Element> New Signed Up user
     */

    signup: function (req, res) {
        helpers.findOne(res, User, constants.USER_MODEL_NAME,
            {
                'email' : req.body.email
            }, {}, function(user) {
                if (user) {
                    log('User already exists in system => Signup API');
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.ACCOUNT_EXISTS,
                        {'error': messages.ACCOUNT_EXISTS}
                    );
                } else {
                    var referredBy = {};
                    async.series([
                        function (callback) {
                            if (req.body.referralCode && req.body.referralCode !== '') {
                                helpers.findOne(res, Refercode, constants.REFERCODE_MODEL_NAME,
                                    {code: req.body.referralCode}, {},
                                    function (referCode) {
                                        if (!referCode || typeof referCode === 'undefined') {
                                            log("Refercode does not exist.");
                                            callback(new Error());
                                        } else {
                                            referredBy.email = referCode.email;
                                            referredBy.code  = referCode.code;
                                            callback();
                                        }
                                    }
                                );
                            } else {
                                callback();
                            }
                        }
                    ], function (err) {
                        if (err) {
                            helpers.createResponse(res, constants.UNPROCESSED,
                                messages.MODULE_NOT_FOUND(constants.REFERCODE_MODEL_NAME),
                                {'error': messages.MODULE_NOT_FOUND(constants.REFERCODE_MODEL_NAME)}
                            );
                        } else {
                            //get random number

                            var OTPCode = helpers.getRandom(100000, 999999);

                            var newUser = new User({
                                firstName           : req.body.firstName,
                                lastName            : req.body.lastName,
                                email               : req.body.email,
                                ethereumAddress     : req.body.ethereumAddress,
                                ipAddress           : req.connection.remoteAddress,
                                password            : req.body.password,
                                emailOtp            : OTPCode,
                                emailOtpCreatedAt   : Date.now(),
                                encryptContainer    : req.body.encryptContainer,
                                telephoneNumber     : req.body.telephoneNumber,
                                country             : req.body.country

                            });
                            if (Object.getOwnPropertyNames(referredBy).length !== 0)
                                newUser.referredBy = referredBy;
                            newUser.save(function (err, newUser) {
                                if (err) {
                                    console.log('Error in user signup : ', err.message);
                                    helpers.createResponse(res, constants.SERVER_ERROR,
                                        messages.SIGN_UP_ERROR,
                                        {'error': messages.SERVER_ERROR_MESSAGE}
                                    );
                                } else {

                                    var sendData = newUser.getUser();
                                    helpers.sendHtmlMail(
                                        {
                                            otp: OTPCode,
                                            firstName : newUser.firstName,
                                            lastName : newUser.lastName
                                        },
                                        newUser.email, 'Verify Email - ProofTokensale', BASE_PATH + '/views/emails/verifyEmailOtp.hbs');
                                    log('Signup successful !');
                                    helpers.createResponse(res, constants.SUCCESS,
                                        messages.REGISTRATION_SUCCESS,
                                        {'data': sendData}
                                    );
                                }
                            });
                        }
                    });
                }
            }
        );
    }, // sign up function end

    /**
     * verifyEmailOTP() allows user to verify account
     * by entering OTP that has sent to user
     *
     * @url {{URL}}/verifyemailotp
     * @param <String> email, OTP
     * @return <String> Account Verification completed success message
     */

    verifyEmailOTP:function (req, res) {
        helpers.findOne(res, User, constants.USER_MODEL_NAME,
            {
                _id : req.body.user,
                email : req.body.email
            }, {}, function(user) {
                if (!user) {
                    log('User not found');
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.MODULE_NOT_FOUND('User'),
                        {'error': messages.MODULE_NOT_FOUND('User')}
                    );
                } else {
                    //check if otp is correct or not
                    if (user.emailOtp === parseInt(req.body.OTP)) {
                        var currentDate = moment(new Date());
                        var otpDate = moment(user.emailOtpCreatedAt);
                        log(otpDate);
                        var newDiff = currentDate.diff(otpDate, 'seconds');
                        if (newDiff > constants.SIGNUP_OTP_TIME_EMAIL * 60) {
                            log('OTP has been expired.');
                            helpers.createResponse(res, constants.UNPROCESSED,
                                messages.VERIFY_OTP_EXPIRED,
                                {'error': messages.VERIFY_OTP_EXPIRED}
                            );
                        } else {
                            if (user.is2FAOn) {
                                var expiredTime = user.emailOtpCreatedAt;
                                expiredTime.setHours(expiredTime.getHours() - 24);
                                helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                                    {_id: req.body.user},
                                    {$set : {emailOtpCreatedAt : expiredTime}},
                                    {new: true, runValidators: true},
                                    function (user) {
                                        var jwtToken = {
                                            _id       : user._id,
                                            firstName : user.firstName,
                                            lastName  : user.lastName,
                                            email     : user.email
                                        };
                                        var sendData = user.getUser();
                                        log('Verification Successful : ');
                                        helpers.createResponse(res, constants.SUCCESS,
                                            messages.LOGIN_SUCCESS,
                                            { 'data' :
                                                {
                                                    'token': helpers.generateToken(jwtToken),
                                                    'user': sendData
                                                }
                                            }
                                        );
                                    }
                                );
                            } else {
                                helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                                    {_id: req.body.user},
                                    {$set : {isAuthenticated : true}},
                                    {new: true, runValidators: true},
                                    function (user) {
                                        var jwtToken = {
                                            _id       : user._id,
                                            firstName : user.firstName,
                                            lastName  : user.lastName,
                                            email     : user.email
                                        };
                                        var sendData = user.getUser();
                                        log('Verification Successful : ');
                                        helpers.createResponse(res, constants.SUCCESS,
                                            messages.SIGN_UP_SUCCESS,
                                            { 'data' :
                                                {
                                                    'token': helpers.generateToken(jwtToken),
                                                    'user': sendData
                                                }
                                            }
                                        );
                                    }
                                );
                            }
                        }
                    } else {
                        log('Invalid OTP.');
                        helpers.createResponse(res, constants.UNPROCESSED,
                            messages.VERIFY_OTP_MISMATCH,
                            {'error': messages.VERIFY_OTP_MISMATCH}
                        );
                    }
                }
            });
    },

    /**
     * resendEmailOtp() - It will resend otp on registered email
     * for the signup verification
     *
     * @url {{URL}}/resendemailotp
     * @param <String> email
     * @param <ObjectId> userId
     * @return <String> message
     */
    resendEmailOtp : function(req, res) {
        try {
            //check if user exist with given email
            helpers.findOne(res, User, constants.USER_MODEL_NAME,
                {
                    '_id'   : req.body.userId,
                    'email' : req.body.email
                }, {}, function(user) {
                    //if user does not exist in the system
                    if (!user || typeof user === 'undefined') {
                        helpers.createResponse(res, constants.UNPROCESSED,
                            messages.MODULE_NOT_FOUND('User'),
                            {'error' : messages.MODULE_NOT_FOUND('User')}
                        );
                    } else {
                        //when user exist
                        //check request comes in within specific time
                        var currentDate = moment(new Date());
                        var otpDate = moment(user.emailOtpCreatedAt);

                        var newDiff = currentDate.diff(otpDate, 'seconds');
                        if (newDiff > constants.LOGIN_OTP_TIME * 60) {
                            //otp verification time expires
                            //update new otp and send new otp
                            var OTPCode = helpers.getRandom(100000, 999999);
                            helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                                { '_id' : user._id},
                                {
                                    $set : {
                                        'emailOtp' : OTPCode,
                                        'emailOtpCreatedAt': new Date()
                                    }
                                }, {new : true, runValidators: true},
                                function(user) {
                                    //send email
                                    helpers.sendHtmlMail(
                                        {
                                            otp: user.emailOtp,
                                            firstName: user.firstName,
                                            lastName: user.lastName
                                        },
                                        user.email, 'Verify Email - ProofTokenSale', BASE_PATH + '/views/emails/verifyEmailOtp.hbs'
                                    );

                                    //var sendData = {'otp': OTPCode};
                                    helpers.createResponse(res, constants.SUCCESS,
                                        messages.OTP_SENT_SUCCESS,
                                        { message: messages.OTP_SENT_SUCCESS }
                                    );
                                }
                            );
                        } else {
                            var OTPCode = user.emailOtp;
                            //send email
                            helpers.sendHtmlMail(
                                {
                                    otp: user.emailOtp,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                },
                                user.email, 'Verify Email - ProofTokenSale', BASE_PATH + '/views/emails/verifyEmailOtp.hbs'
                            );

                            //var sendData = {'otp': OTPCode};
                            helpers.createResponse(res, constants.SUCCESS,
                                messages.OTP_SENT_SUCCESS,
                                { message: messages.OTP_SENT_SUCCESS }
                            );
                        }
                    }
                });
        } catch (err) {
            helpers.createResponse(res, constants.SERVER_ERROR,
                messages.SERVER_ERROR_MESSAGE,
                { 'error' : messages.SERVER_ERROR_MESSAGE }
            );
        }
    }, //resendEmailOtp method end

    /**
     * forgotPassword() allows user to resend otp and
     * allow later user to reset password
     *
     * @url {{URL}}/forgotpassword
     * @param <String> email
     * @return <String> OTP send message or failure
     */

    forgotPassword:function (req, res) {
        helpers.findOne(res, User, constatns.USER_MODEL_NAME,
            {email: req.body.email}, {},
            function (user) {
                if (!user) {
                    log('User not found');
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.MODULE_NOT_FOUND(constants.USER_MODEL_NAME),
                        {'error': messages.MODULE_NOT_FOUND(constants.USER_MODEL_NAME)}
                    );
                } else {
                    if (! user.isAuthenticated) {
                        log('Your account is not authenticated yet!');
                        helpers.createResponse(res, constants.UNPROCESSED,
                            messages.LOGIN_ACCOUNT_DISABLED,
                            {'error': messages.LOGIN_ACCOUNT_DISABLED}
                        );
                    } else {
                        var OTPCode = helpers.getRandom(100000,999999);
                        helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                            {email: req.body.email},
                            {$set : {emailOtp : OTPCode, emailOtpCreatedAt : new Date()}},
                            {new: true, runValidators: true},
                            function (err, success) {
                                if (err) {
                                    log('Error in updating forgot password fields to DB : ', err.message);
                                    helpers.createResponse(res, constants.SERVER_ERROR,
                                        messages.FORGOT_PASSWORD_ERROR,
                                        {'error': messages.SERVER_ERROR_MESSAGE}
                                    );
                                } else {
                                    log('OTP has been send to provided email !');
                                    helpers.createResponse(res, constants.SUCCESS,
                                        messages.FORGOT_PASSWORD_SUCCESS,
                                        {'data': messages.FORGOT_PASSWORD_SUCCESS}
                                    );
                                }
                            }
                        );
                    }
                }
            }
        );
    },

    /**
     * resetPassword() allows user to reset and enter new password
     *
     * @url {{URL}}/resetpassword
     * @param <String> email, newpassword
     * @return <String> Reset Password success message
     */

    resetPassword:function (req, res) {
        helpers.findOne(res, User, constants.USER_MODEL_NAME,
            {email: req.body.email}, {},
            function (user) {
                if (!user) {
                    log('User not found');
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.MODULE_NOT_FOUND(constants.USER_MODEL_NAME),
                        {'error': messages.MODULE_NOT_FOUND(constants.USER_MODEL_NAME)}
                    );
                } else {
                    if (! user.isAuthenticated) {
                        log('Your account is not authenticated yet.');
                        helpers.createResponse(res, constants.UNPROCESSED,
                            messages.LOGIN_ACCOUNT_DISABLED,
                            {'error': messages.LOGIN_ACCOUNT_DISABLED}
                        );
                    } else {
                        helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                            {email: req.body.email},
                            {$set : {password : req.body.newPassword}},
                            {new: true, runValidators: true},
                            function (updatedUser) {
                                log('Your Password has been changed was successfully !');
                                helpers.createResponse(res, constants.SUCCESS,
                                    messages.RESET_PASSWORD_SUCCESS,
                                    {message : messages.RESET_PASSWORD_SUCCESS}
                                );
                            }
                        );
                    }
                }
            }
        );
    }
};