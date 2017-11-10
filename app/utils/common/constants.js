'use strict';

// httpStatuses constant
module.exports = {

    SUCCESS                     : 200,
    ACCEPTED                    : 202,
    BAD_REQUEST                 : 400,
    UNAUTHORIZED                : 401,
    FORBIDDEN                   : 403,
    NOT_FOUND                   : 404,
    METHOD_NOT_ALLOWED          : 405,
    UNPROCESSED                 : 422,
    TOO_MANY_REQUEST            : 429,
    SERVER_ERROR                : 500,
    
    // static token
    STATIC_TOKEN                : 'YOUR_TOKEN_HERE',
    THROTTLE_MESSAGE            : JSON.stringify({'status' : 429, 'message' : 'You have exceeded maximum request limit! Try again after some time.'}),

    //pagination parameters
    SORT_BY                     : 'createdAt',
    SORT_ORDER                  : 'desc',
    PAGE_NUMBER                 : 1,
    RECORDS_PER_PAGE            : 10,

    //Model Constants
    USER_MODEL_NAME             : 'User',
    TRANSACTION_MODEL_NAME      : 'Transaction',
    REFERCODE_MODEL_NAME        : 'Refer Code',

    //otp verification time in minutes
    LOGIN_OTP_TIME              : 10,
    SIGNUP_OTP_TIME_EMAIL       : 1440,
};
