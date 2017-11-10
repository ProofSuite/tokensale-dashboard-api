'use strict';

var User        = require('./UserSchema');
var UserModel   = require('./UserModel');

module.exports = {

    /*/!**
     * index() returns a result for resource (all and paginated)
     * based on passed query parameters
     *
     * @url {{URL}}/transaction
     * @param <String> sortOrder, sortBy, userId
     * @param <Integer> pageNumber, recordsPerPage
     * @return <Element> Array of Transactions
     *!/

    index: function (req, res) {
        try {
            var search       = {};

            var sortBy       = helpers.getSortBy(req);
            var sortOrder    = helpers.getSortOrder(req);
            var sortData     = {}; //create an empty object
            var allowFields = ['referredBy'];

            // assign that object  now
            sortData[sortBy] = sortOrder;

            var query = User.find({}).select(UserModel.getFields());

            query.sort(sortData);

            //search filteration
            if (typeof req.query.search !== 'undefined') {
                var search = JSON.parse(req.query.search);

                for (var key in search) {
                    if (allowFields.includes(key)) {
                        if (mongoose.Types.ObjectId.isValid(search[key]) || key === 'referredBy') {
                            if (key === 'referredBy')
                                query.where('referredBy.code', search[key]);
                            else
                                query.where(key, search[key]);
                        } else {
                            query.where(key).regex(new RegExp('.*' + search[key] + ('.*'), 'i')).exists();
                        }
                    }
                }
            }

            //if records all then send all the records
            if (typeof req.query.records !== 'undefined' && req.query.records === 'all') {
                query.exec(function(err, userData) {
                    if (err) {
                        log('Error in user => index API : ', err);
                        helpers.createResponse(res, constants.SERVER_ERROR,
                            messages.SERVER_ERROR_MESSAGE,
                            { 'error' : messages.SERVER_ERROR_MESSAGE }
                        );
                    } else {
                        log('User list');
                        helpers.createResponse(res, constants.SUCCESS,
                            messages.MODULE_LIST_SUCCESS(constants.USER_MODEL_NAME),
                            {'data' : userData}
                        );
                    }
                });
            } else {
                //pagination paramter
                var pageNumber      = parseInt(helpers.getPageNumber(req));
                var recordsPerPage  = parseInt(helpers.getRecordsPerPage(req));
                var skip            = (pageNumber - 1) * recordsPerPage;
                var totalRecords    = 0;

                query.exec(function(err, userCountData) {
                    if (err) {
                        log('Error in User => index API : ', err.message);
                        helpers.createResponse(res, constants.SERVER_ERROR,
                            messages.SERVER_ERROR_MESSAGE,
                            { 'error' : messages.SERVER_ERROR_MESSAGE }
                        );
                    } else {
                        totalRecords = userCountData.length;

                        query.limit(recordsPerPage);
                        query.skip(skip);

                        query.exec(function (err, userData) {
                            if (err) {
                                log('Error in User => index API : ', err.message);
                                helpers.createResponse(res, constants.SERVER_ERROR,
                                    messages.SERVER_ERROR_MESSAGE,
                                    { 'error' : messages.SERVER_ERROR_MESSAGE }
                                );
                            } else {
                                var pager = {
                                    'sortBy'          : sortBy,
                                    'sortOrder'       : sortOrder,
                                    'pageNumber'      : pageNumber,
                                    'recordsPerPage'  : recordsPerPage,
                                    'filteredRecords' : parseInt(userData.length),
                                    'totalRecords'    : totalRecords
                                };
                                helpers.createResponse(res, constants.SUCCESS,
                                    messages.MODULE_LIST_SUCCESS(constants.USER_MODEL_NAME),
                                    {'data' : userData}, pager
                                );
                            }
                        });
                    }
                });
            }
        } catch (err) {
            log('Error in User => index API : ', err);
            helpers.createResponse(res, constants.SERVER_ERROR,
                messages.SERVER_ERROR_MESSAGE,
                {'error': messages.SERVER_ERROR_MESSAGE}
            );
        }
    }, // index function close*/

    /**
     * updateUserDetails() allows user to change password or
     * update telephoneNumber
     *
     * @url {{URL}}/user/updateuserdetails
     * @param <String> oldpassword, newpassword, encryptContainer or Telephone Number
     * @return <String> Change Password success message
     */

    updateUserDetails:function(req, res) {
        try {
            var loggedInUser = helpers.parseJWTToken(req);
            if (! loggedInUser) {
                log('Error in parsing JWT token');
                helpers.createResponse(res, constants.SERVER_ERROR,
                    messages.SERVER_ERROR_MESSAGE,
                    {'error': messages.SERVER_ERROR_MESSAGE}
                );
            } else {
                helpers.findOne(res, User, constants.USER_MODEL_NAME,
                    {_id: loggedInUser._id}, {},
                    function (user) {
                        if (!user || typeof user === 'undefined') {
                            log('User does not exist');
                            helpers.createResponse(res, constants.SERVER_ERROR,
                                messages.SERVER_ERROR_MESSAGE,
                                {'error': messages.SERVER_ERROR_MESSAGE}
                            );
                        } else {
                            if (req.body.telephoneNumber) {
                                helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                                    {_id: user.id},
                                    {$set : {telephoneNumber: req.body.telephoneNumber}},
                                    {new: true, runValidators: true},
                                    function (upadatedUser) {
                                        var sendData = upadatedUser.getUser();
                                        log('Telephone Number has been updated successfully!');
                                        helpers.createResponse(res, constants.SUCCESS,
                                            messages.PHONE_UPDATE_SUCCESS,
                                            { data : sendData }
                                        );
                                    }
                                )
                            } else {
                                if (req.body.status && user.password !== req.body.oldPassword) {
                                    log('Password mismatch => updateUserDetails on UserController ');
                                    helpers.createResponse(res, constants.UNPROCESSED,
                                        messages.PASSWORD_MISMATCH,
                                        {'error': messages.PASSWORD_MISMATCH}
                                    );
                                } else {
                                    helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                                        {_id: user._id},
                                        {
                                            $set:
                                                {
                                                    password: req.body.newPassword,
                                                    encryptContainer: req.body.encryptContainer
                                                }
                                        },
                                        {new: true, runValidators: true},
                                        function (updatedUser) {
                                            var sendData = updatedUser.getUser();
                                            log('Password has been changed successfully!');
                                            helpers.createResponse(res, constants.SUCCESS,
                                                messages.CHANGE_PASSWORD_SUCCESS,
                                                { data : sendData }
                                            );
                                        }
                                    );
                                }
                            }
                        }
                    }
                );
            }
        } catch (err) {
            log('Error during updateProfileDetails => catch block');
            helpers.createResponse(res, constants.SERVER_ERROR,
                messages.SERVER_ERROR_MESSAGE,
                {'error': messages.SERVER_ERROR_MESSAGE}
            );
        }
    },

    /**
     * updateSecureLogin() allows user to update setting for 2FA
     *
     * @url {{URL}}/user/updatesecurelogin
     * @param <String> password, status
     * @return <String> Change status of is2FAOn after validating password
     */

    updateSecureLogin:function(req, res) {
        try {
            var loggedInUser = helpers.parseJWTToken(req);
            if (! loggedInUser) {
                log('Error in parsing JWT token');
                helpers.createResponse(res, constants.SERVER_ERROR,
                    messages.SERVER_ERROR_MESSAGE,
                    {'error': messages.SERVER_ERROR_MESSAGE}
                );
            } else {
                helpers.findOne(res, User, constants.USER_MODEL_NAME,
                    {_id: loggedInUser._id}, {},
                    function (user) {
                        if (!user || typeof user === 'undefined') {
                            log('User does not exist');
                            helpers.createResponse(res, constants.SERVER_ERROR,
                                messages.SERVER_ERROR_MESSAGE,
                                {'error': messages.SERVER_ERROR_MESSAGE}
                            );
                        } else {
                            if (user.password !== req.body.password) {
                                log('Password mismatch => updateSecureLogin on UserController ');
                                helpers.createResponse(res, constants.UNPROCESSED,
                                    messages.PASSWORD_MISMATCH,
                                    {'error': messages.PASSWORD_MISMATCH}
                                );
                            } else {
                                helpers.findOneUpdateOrInsert(res, User, constants.USER_MODEL_NAME,
                                    {_id: user._id},
                                    {$set: {is2FAOn: req.body.status}},
                                    {new: true, runValidators: true},
                                    function (updatedUser) {
                                        var sendData = updatedUser.getUser();
                                        var text = '';
                                        if (req.body.status === 'true')
                                            text = messages.TEXT_ENABLED;
                                        else
                                            text = messages.TEXT_DISABLED;
                                        log('2FA has been ' + text + 'successfully !');
                                        helpers.createResponse(res, constants.SUCCESS,
                                            messages.MODULE_STATUS_CHANGE('2FA', text),
                                            { data : sendData }
                                        );
                                    }
                                );
                            }
                        }
                    }
                );
            }
        } catch (err) {
            log('Error during password change => catch block');
            helpers.createResponse(res, constants.SERVER_ERROR,
                messages.SERVER_ERROR_MESSAGE,
                {'error': messages.SERVER_ERROR_MESSAGE}
            );
        }
    }
};