'use strict';

var authController = require(BASE_PATH + '/app/auth/AuthController');
var router  = express.Router();

module.exports = (function() {
    router.post('/login', validatorClass.publicRouteValidate('login'), function (req, res, next) {
        authController.login(req, res);
    });

    router.post('/signup', validatorClass.publicRouteValidate('signup'), function (req, res, next) {
        authController.signup(req, res);
    });

    router.post('/verifyemailotp', validatorClass.publicRouteValidate('verifyemailotp'), function (req, res, next) {
        authController.verifyEmailOTP(req, res);
    });

    router.put('/resendemailotp', validatorClass.publicRouteValidate('resendemailotp'), function(req, res, next) {
        authController.resendEmailOtp(req, res);
    });

    router.post('/forgotPassword', validatorClass.publicRouteValidate('forgotPassword'), function(req, res, next) {
        authController.forgotPassword(req, res);
    });

    router.post('/resetPassword', validatorClass.publicRouteValidate('resetPassword'), function(req, res, next) {
        authController.resetPassword(req, res);
    });

    return router;
})();