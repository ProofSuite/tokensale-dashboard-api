'use strict';

// constant messages
module.exports = {

    //All list(index) method messages
    MODULE_LIST_SUCCESS: function (module) {
        return module + ' list.';
    },
    MODULE_LIST_ERROR: function (module) {
        return 'Error while listing '+ module +'.';
    },

    //All store method messages
    MODULE_STORE_SUCCESS: function (module) {
        return module + ' has been added successfully !';
    },
    MODULE_EXISTS: function (module) {
        return 'The ' +  module + ' is already exists in the list.';
    },
    MODULE_STORE_ERROR: function (module) {
        return 'Error while storing ' +  module + '.';
    },

    //All show method messages
    MODULE_SHOW_SUCCESS: function (module) {
        return module + ' details.';
    },
    MODULE_NOT_FOUND: function (module) {
        return 'The ' + module + ' you are looking for is not found.';
    },
    MODULE_SHOW_ERROR:function (module) {
        return 'Error during ' + module + ' details.';
    },

    // All update method messages
    MODULE_UPDATE_SUCCESS: function (module) {
        return module + ' details has been updated successfully!';
    },
    MODULE_UPDATE_ERROR: function (module) {
        return 'Error while updating '+ module +'.';
    },

    //All delete(destroy/status change) method messages
    MODULE_STATUS_CHANGE:function (module, status) {
        return module + ' has been ' + status + ' successfully!';
    },
    MODULE_DELETE_ERROR: function (module) {
        return 'Error while deleting ' + module;
    },

    //file upload
    FILE_TYPE_MISMATCH: function (module) {
        return 'The ' + module + ' must be a valid image file from (.jpg, .png or .svg).';
    },

    // Status Change Messages
    TEXT_DISABLED           : 'disabled',
    TEXT_ENABLED            : 'enabled',

    //Authnetication messages
    CHANGE_PASSWORD_ERROR   : 'Error during change password.',
    CHANGE_PASSWORD_SUCCESS : 'Your password has been changed successfully.',
    PASSWORD_MISMATCH       : 'Incorrect old password.',
    USER_UNAUTHORIZED       : 'You are not authorized for this operation.',
    LOGIN_ERROR             : 'Error during login.',
    LOGIN_SUCCESS           : 'Login Successful !',
    LOGIN_ACCOUNT_DISABLED  : 'You have not authenticated your account yet!',
    ACCOUNT_NOT_VERIFIED    : 'You have not verified your account yet. Please verify or Sign Up again.',
    SECURE_VERIFICATION     : 'Secure login has enabled for this account. Please enter One-Time-Password to login.',
    ACCOUNT_EXISTS          : 'This email is already exists with us. Please choose another email address to register.',
    INCORRECT_PASSWORD      : 'Your Password is incorrect.',
    SIGN_UP_ERROR           : 'Error during user sign up.',
    REGISTRATION_SUCCESS    : 'We have sent an One-Time-Password on your email. Please verify your email address.',
    SIGN_UP_SUCCESS         : 'Congrats! You have successfully registered.',
    VERIFY_OTP_ERROR        : 'Error during verify One-Time-Password.',
    ALREADY_VERIFIED        : 'This account has already been already verified.',
    VERIFY_OTP_EXPIRED      : 'Your One-Time-Password has been expired.',
    VERIFY_OTP_SUCCESS      : 'One-Time-Password verification has been completed successfully!',
    VERIFY_OTP_MISMATCH     : 'You have entered wrong One-Time-Password',
    FORGOT_PASSWORD_ERROR   : 'Error during forgot password.',
    FORGOT_PASSWORD_SUCCESS : 'New One-Time-Password has been sent.',
    RESET_PASSWORD_ERROR    : 'Error during reset password.',
    RESET_PASSWORD_SUCCESS  : 'Your request has been processed successfully.',
    OTP_SENT_SUCCESS        : 'One-Time-Password has been sent successfully.',
    PHONE_UPDATE_SUCCESS    : 'Telephone Number has been updated successfully.',
    ACC_VERIFICATION_PENDING: 'You have not verified your account yet. Please verify to login.',
    REFERCODE_EXISTS        : 'This email has already been registered.',

    //File upload
    FILE_UPLOAD_ERROR       : 'Error during file upload.',

    //Token Errors
    INVALID_TOKEN           : 'Your access token is invalid or expired.',
    ACCESS_TOKEN_REQUIRED   : 'Please provide the access token.',

    //Invalid JSON
    INVALID_JSON            : 'Invalid JSON. Failed to parse JSON',
    UNAUTHORIZED_ACCESS     : 'You are not allowed for this operation.',


    LOGIN_USER_LIST         : 'Error during login user list.',
    PARAM_MISSING           : 'Request parameter missing.',
    SERVER_ERROR_MESSAGE    : 'Server Error.',
    INVALID_EMAIL           : 'The selected email is invalid.',
    SIGNUP_USER_LIST        : 'Error during signup user list',
    ERROR_USER_LIST         : 'Error during user list.',
    SUCCESS_USER_LIST       : 'User List.',
    WRONG_CREDENTIALS       : 'Email and password does not match.',
    REFERCODE_SUCCESS       : 'Refer Code has been generated successfully.',

    URL_NOT_FOUND           : 'The URL you are looking for is not found!',
    USER_NOT_FOUND          : 'The User you are looking for is not found!',
    INVALID_MONGO_OBJECT_ID : 'The ObjectId is not a valid mongoId.',
    INVALID_STATUS          : 'The status is not valid status.',

    USER_DESTROY_ERROR      : 'Error during user destroy',
    USER_DESTROY_ENABLED    : 'User status has been enabled successfully.',
    USER_DESTROY_DISABLED   : 'User status has been disabled successfully.',

    MOBILE_NO_EXISTS        : 'The selected mobile number has already been registered.',
    EMAIL_EXISTS            : 'The email has already been taken.',
    NAME_EXISTS             : 'The name has already been taken',
    TRANSACTION_UPDATE_SUCCESS : 'Transaction status has been updated successfully.',

    //common function
    FIND_ONE_ERROR          : 'Error during finding single record.',
    FIND_AND_UPDATE_ERROR   : 'Error during finding single record and updating it.',
    FIND_ALL_DATA_ERROR     : 'Error during finding all records',
    FIND_BY_ID_ERROR        : 'Error during finding record by ID.',
    COUNT_RECORDS_ERROR     : 'Error during counting records.'
};

