'use strict';

var userController = require('./UserController');
var router  = express.Router();

module.exports = (function() {

    router.put('/updateuserdetails', [validatorClass.useJWTMiddleware(), validatorClass.userRouteValidate('updateUserDetails')], function (req, res, next) {
        userController.updateUserDetails(req, res);
    });

    router.put('/updatesecurelogin', [validatorClass.useJWTMiddleware(), validatorClass.userRouteValidate('updateSecureLogin')], function (req, res, next) {
        userController.updateSecureLogin(req, res);
    });

    return router;
})();