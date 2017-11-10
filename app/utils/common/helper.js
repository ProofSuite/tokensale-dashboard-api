'use strict';

var jwt     = require('jsonwebtoken');
var hbs     = require('handlebars');
const nodemailer   = require('nodemailer');
const sgMail = require('@sendgrid/mail');


module.exports = {
    //create function for response
    createResponse: function (res, status, message, payload, pager) {
        pager = typeof pager !== 'undefined' ? pager : {};
        return res.status(status).json({
            'status'    : status,
            'message'   : message,
            'payload'   : payload,
            'pager'     : pager
        });
    },

    generateToken: function (user) {
        return jwt.sign(user, config.JWT_SECRET, {
            expiresIn: config.TOKEN_EXPIRY,
            algorithm: config.JWT_ALGORITHEM
        });
    },

    checkIfRequired: function (fieldName) {
        return 'The ' + fieldName + ' field is required.';
    },

    checkIfNotEquals: function (value1, value2) {
        return value1 + ' and ' + value2 + ' can not be same.';
    },

    checkIfURL: function (fieldName) {
        return 'The ' + fieldName + ' must be a valid URL.';
    },

    checkIfAlphaNumeric:  function(fieldName) {
        return 'The ' + fieldName + ' must be alpha numeric.';
    },

    checkIfNumeric: function (fieldName) {
        return 'The ' + fieldName + ' field must be numeric.';
    },

    checkImageExtension: function (fieldName) {
        return 'The ' + fieldName + ' field must have extension jpg, jpeg, png, gif or svg.';
    },

    checkIfValidDate: function (fieldName) {
        return 'The ' + fieldName + ' must be a valid date.';
    },

    checkIfEmail: function (fieldName) {
        return 'The ' + fieldName + ' must be a valid email address.';
    },

    checkInt: function (fieldName) {
        return 'The ' + fieldName + ' must be a valid integer.';
    },

    checkFloat: function (fieldName) {
        return 'The ' + fieldName + ' must be a valid float value.';
    },

    checkIntAndMinMax: function (fieldName, min, max) {
        return 'The ' + fieldName + ' must be integer and between ' + min + ' and ' + max + '.';
    },

    checkIfValidEnum: function (fieldName, enumArray) {
        return 'The ' + fieldName + ' must have a valid value from ' + enumArray;
    },

    checkIfValidSortOrder: function (fieldName, enumArray) {
        return 'The ' + fieldName + ' must have a valid value from ' + enumArray;
    },

    checkIfValidPageNumber: function (fieldName) {
        return 'The ' + fieldName + ' field must be integer and greater than 1.';
    },

    checkIfValidJSON: function (fieldName) {
        return 'The ' + fieldName + ' field must be a valid JSON String.';
    },

    checkIfValidMongoId: function (fieldName) {
        return 'The ' + fieldName + ' field must be a valid value.';
    },

    checkIfEqualsAll: function (fieldName) {
        return 'The ' + fieldName + ' field must have value as all';
    },

    checkIfArray: function (fieldName) {
        return 'The ' + fieldName + ' must not be empty and it should be a valid array.'
    },

    checkIfValidOrderFields: function (fieldName) {
        return 'The ' + fieldName + ' does not have correct fields.'
    },

    isArray: function (value) {
        console.log(Array.isArray(value));
        return Array.isArray(value);
    },

    checkLength: function (fieldName, min, max) {
        min = typeof min !== 'undefined' ? min : '';
        max = typeof max !== 'undefined' ? max : '';

        if (min == max)
            return 'The ' + fieldName + ' must be exact ' + max + ' characters.';
        else if (max == '')
            return 'The ' + fieldName + ' must be at least ' + min + ' characters.';
        else if (min == '')
            return 'The ' + fieldName + ' may not be greater than ' + max + ' characters.';
        else
            return 'The ' + fieldName + ' must be between ' + min + ' to ' + max + ' characters.';
    },

    getRandom: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },

    randomStr: function (length) {
        var possible = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var randomText = '';
        for (var i=0; i<length; i++)
            randomText += possible.charAt(Math.floor(Math.random() * new Date().getSeconds().toString()));
        //log(new Date().getSeconds());
        return randomText;
    },

    referCode: function (length) {
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var randomText = '';
        for (var i=0; i < length; i++)
            randomText += possible.charAt(Math.floor(Math.random() * possible.length));
        //log(new Date().getSeconds());
        return randomText;
    },

    generateUserName: function (name) {
        var code           = '';
        var userName       = name.replace(/\s+/g, '');
        var userNameLength = userName.length;
        var code = '';
        if (userNameLength == 3)
            code = userName + '' + helpers.randomStr(7);
        else if (userNameLength == 4)
            code = userName + '' + helpers.randomStr(6);
        else
            code = userName.substr(0,5) + '' + helpers.randomStr(5);

        return code;
    },

    checkIfUserCodeExists: function (res, collectionName, code) {
        helpers.findOneData(res, constants.USER_MODEL_NAME, collectionName,
            {'referCode.code': code}, false, function (user) {
                if (user)
                    return true;
                else
                    return false;
            }
        );
    },

    parseJWTToken: function (req) {
        try {
            var decoded = jwt.verify(req.headers['authorization'].split(' ')[1], config.JWT_SECRET);
            return decoded;
        } catch (err) {
            return false;
        }
    },

    //get sortBy
    getSortBy: function(req) {
        return  (typeof req.query.sortBy !== 'undefined')
            ? req.query.sortBy
            : constants.SORT_BY;
    },

    //get sortOrder
    getSortOrder: function(req) {
        return  (typeof req.query.sortOrder !== 'undefined')
            ? req.query.sortOrder
            : constants.SORT_ORDER;
    },

    //get pageNumber
    getPageNumber: function(req) {
        return  (typeof req.query.pageNumber !== 'undefined')
            ? req.query.pageNumber
            : constants.PAGE_NUMBER;
    },

    //get recordsPerPage
    getRecordsPerPage: function(req) {
        return  (typeof req.query.recordsPerPage !== 'undefined')
            ? req.query.recordsPerPage
            : constants.RECORDS_PER_PAGE;
    },

    // findOne Common Function
    findOneData: function (res, collectionName, collection, values, existsCheckFlag, callback) {
        collection.findOne(values)
            .exec(function (err, result) {
                if (err) {
                    log('Error in helpers.findOneData function : ', err.message);
                    helpers.createResponse(res, constants.SERVER_ERROR,
                        messages.SERVER_ERROR_MESSAGE,
                        {'error': messages.FIND_ONE_ERROR}
                    );
                    return;
                } else if ((! result) && existsCheckFlag){
                    log(collectionName + ' not found.');
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.MODULE_NOT_FOUND(collectionName),
                        {'error': messages.MODULE_NOT_FOUND(collectionName)}
                    );
                    return;
                } else if (result && (! existsCheckFlag)){
                    if (collectionName === 'User')
                        callback(result);
                    else {
                        log(collectionName + ' is already exists.');
                        helpers.createResponse(res, constants.UNPROCESSED,
                            messages.MODULE_EXISTS(collectionName),
                            {'error': messages.MODULE_EXISTS(collectionName)}
                        );
                        return;
                    }
                } else {
                    callback(result);
                }
            });
    },

    //findOneAndUpdate common function
    findOneAndUpdateData: function (res, collectionName, collection, findQuery, setValues, outputType, callback) {
        collection.findOneAndUpdate(findQuery, setValues, {new: outputType, runValidators: true})
            .exec(function (err, result) {
                if (err) {
                    log('Error in helpers.findOneAndUpdateData function : ', err.message);
                    helpers.createResponse(res, constants.SERVER_ERROR,
                        messages.SERVER_ERROR_MESSAGE,
                        {'error': messages.FIND_AND_UPDATE_ERROR}
                    );
                    return;
                } else if (! result){
                    log('Data not found');
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.MODULE_NOT_FOUND(collectionName),
                        {'error': messages.MODULE_NOT_FOUND(collectionName)}
                    );
                    return;
                } else {
                    callback(result);
                }
            });
    },

    //findAllData common function
    findAllData: function (res, collection, findQuery, selectFields ,limit, skip, sortData, callback) {
        collection.find(findQuery)
            .select(selectFields)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort(sortData)
            .exec(function (err, result) {
                if (err) {
                    log('Error in helpers.findData function : ', err.message);
                    helpers.createResponse(res, constants.SERVER_ERROR,
                        messages.SERVER_ERROR_MESSAGE,
                        {'error': messages.FIND_ALL_DATA_ERROR}
                    );
                    return;
                } else {
                    callback(result);
                }
            });
    },

    //findByIdData common function
    findByIdData: function (res, collectionName, collection, value, callback) {
        collection.findById({_id: value})
            .exec(function (err, result) {
                if (err) {
                    log('Error in helpers.findByIdData function : ', err.message);
                    helpers.createResponse(res, constants.SERVER_ERROR,
                        messages.SERVER_ERROR_MESSAGE,
                        {'error': messages.FIND_BY_ID_ERROR}
                    );
                    return;
                } else if (! result){
                    log(collectionName + ' data not found');
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.MODULE_NOT_FOUND(collectionName),
                        {'error': messages.MODULE_NOT_FOUND(collectionName)}
                    );
                    return;
                } else {
                    callback(result);
                }
            });
    },

    //count total records function
    countRecords: function (res, collection, filterQuery, callback) {
        collection.count(filterQuery)
            .exec(function (err, result) {
                if (err) {
                    log('Error in helpers.findData function : ', err.message);
                    helpers.createResponse(res, constants.SERVER_ERROR,
                        messages.SERVER_ERROR_MESSAGE,
                        {'error': messages.COUNT_RECORDS_ERROR}
                    );
                    return;
                } else {
                    callback(result);
                }
            });
    },

    /**
     * This is for finding out the document with query match if not then insert otherwise
     * update the document.
     *
     * @param <String> model - Schema model name
     * @param <Object> query - object of the query
     * @param <Object> update - object of the data we want to update
     * @param <Object> options - object of the option
     *
     * @return callback
     */
    findOneUpdateOrInsert: function (res, model, modelName, query, update, options, callback) {
        model.findOneAndUpdate(query, update, options, function(err, result) {
            if (err) {
                log('Error in helpers.findOneUpdateOrInsert function : '+ modelName + '=>', err.message);
                helpers.createResponse(res, constants.SERVER_ERROR,
                    messages.SERVER_ERROR_MESSAGE,
                    {'error': messages.FIND_AND_UPDATE_ERROR});
            } else {
                callback(result);
            }
        });
    },

    /**
     * This is for finding out the single document with query match
     *
     * @param <String> model - model name
     * @param <Object> query - Object of the query
     * @param <Object> options - Object of the options
     *
     * @return callback
     */
    findOne : function(res, model, modelName, query, options, callback) {
        model.findOne(query, options, function(err, result) {
            if (err) {
                log("error in " + modelName + ' findOne query : ', + err.message );
                helpers.createResponse(res, constants.SERVER_ERROR,
                    messages.SERVER_ERROR_MESSAGE,
                    {'error': messages.SERVER_ERROR_MESSAGE}
                );
            } else {
                callback(result);
            }
        });
    },

    getIndianDate : function() {
        var d = new Date();
        var localTime = d.getTime();

        var localOffset = d.getTimezoneOffset() * 60000;

        var utc = localTime + localOffset;

        var offset = 5.5;
        var india = utc + (offset * 3600000);
        var newDate = moment(new Date(india)).format('DD-MM-YY HH:mm:ss');
        return newDate;
    },

    /**
     * It will send email
     * @param <object> data - like. {username : 'ravi'}
     * @param <String> to - like. davdaravi007@gmail.com,ravi.davda@gmail.com
     * @param <String> subject - Subject of the email
     * @param <String> templateUrl - It is the path of the template.
     *
     */
    sendHtmlMail : function(data, to, subject, templateUrl) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        readHTMLFile(templateUrl, function(err, html) {
            var template = hbs.compile(html);
            var replacements = data;
            var htmlToSend = template(replacements);
            var msg = {
                from: 'tokensale@proofsuite.com',
                to: to,
                subject: subject,
                html: htmlToSend,//if you want to send html file
            };
            sgMail.send(msg)
        });
    }
};

function readHTMLFile(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            callback(err);
        } else {
            callback(null, html);
        }
    });
}