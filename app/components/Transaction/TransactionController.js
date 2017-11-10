'use strict';

var Transaction      = require('./TransactionSchema');
var TransactionModel = require('./TransactionModel');

module.exports = {

    /**
     * index() returns a result for resource (all and paginated)
     * based on passed query parameters
     *
     * @url {{URL}}/transaction
     * @param <String> sortOrder, sortBy, type, description, status
     * @param <String> date
     * @param <Number> amount
     * @param <Integer> pageNumber, recordsPerPage
     * @return <Element> Array of Transactions
     */

    index: function (req, res) {
        try {
            var search       = {};

            var sortBy       = helpers.getSortBy(req);
            var sortOrder    = helpers.getSortOrder(req);
            var sortData     = {}; //create an empty object
            var allowFields = ['userId'];

            // assign that object  now
            sortData[sortBy] = sortOrder;

            var query = Transaction.find({}).select(TransactionModel.getFields());
            query.sort(sortData);

            //search filteration
            if (typeof req.query.search !== 'undefined') {
                var search = JSON.parse(req.query.search);

                for (var key in search) {
                    if (allowFields.includes(key)) {
                        if (mongoose.Types.ObjectId.isValid(search[key]) || key === 'userId') {
                            query.where(key, search[key]);
                        } else {
                            query.where(key).regex(new RegExp('.*' + search[key] + ('.*'), 'i')).exists();
                        }
                    }
                }
            }

            //if records all then send all the records
            if (typeof req.query.records !== 'undefined' && req.query.records === 'all') {
                query.exec(function(err, transactionData) {
                    if (err) {
                        log('Error in transaction => index API : ', err);
                        helpers.createResponse(res, constants.SERVER_ERROR,
                            messages.SERVER_ERROR_MESSAGE,
                            { 'error' : messages.SERVER_ERROR_MESSAGE }
                        );
                    } else {
                        log('Transaction list');
                        helpers.createResponse(res, constants.SUCCESS,
                            messages.MODULE_LIST_SUCCESS(constants.TRANSACTION_MODEL_NAME),
                            {'data' : transactionData}
                        );
                    }
                });
            } else {
                //pagination paramter
                var pageNumber      = parseInt(helpers.getPageNumber(req));
                var recordsPerPage  = parseInt(helpers.getRecordsPerPage(req));
                var skip            = (pageNumber - 1) * recordsPerPage;
                var totalRecords    = 0;

                query.exec(function(err, transactionCountData) {
                    if (err) {
                        log('Error in Transaction => index API : ', err.message);
                        helpers.createResponse(res, constants.SERVER_ERROR,
                            messages.SERVER_ERROR_MESSAGE,
                            { 'error' : messages.SERVER_ERROR_MESSAGE }
                        );
                    } else {
                        totalRecords = transactionCountData.length;

                        query.limit(recordsPerPage);
                        query.skip(skip);

                        query.exec(function (err, transactionData) {
                            if (err) {
                                log('Error in Transaction => index API : ', err.message);
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
                                    'filteredRecords' : parseInt(transactionData.length),
                                    'totalRecords'    : totalRecords
                                };
                                helpers.createResponse(res, constants.SUCCESS,
                                    messages.MODULE_LIST_SUCCESS(constants.TRANSACTION_MODEL_NAME),
                                    {'data' : transactionData}, pager
                                );
                            }
                        });
                    }
                });
            }
        } catch (err) {
            log('Error in Transaction => index API : ', err);
            helpers.createResponse(res, constants.SERVER_ERROR,
                messages.SERVER_ERROR_MESSAGE,
                {'error': messages.SERVER_ERROR_MESSAGE}
            );
        }
    }, // index function close

    /**
     * store() stores a new resource
     * based on passed query parameters
     *
     * @url {{URL}}/transaction
     * @param <String> type, description, status
     * @param <Date> date
     * @param <Number> amount
     * @return <String> Success or Error message
     */

    store: function (req, res) {
        try {
            var loggedInUser = helpers.parseJWTToken(req);
            if (! loggedInUser) {
                log('Error in parsing JWT : ', err);
                helpers.createResponse(res, constants.SERVER_ERROR,
                    messages.SERVER_ERROR_MESSAGE,
                    {'error': messages.SERVER_ERROR_MESSAGE}
                );
            } else {
                var newTransaction = new Transaction({
                    type            : req.body.type,
                    date            : req.body.date,
                    description     : req.body.description,
                    status          : req.body.status,
                    transactionHash : req.body.transactionHash,
                    amount          : req.body.amount,
                    userId          : loggedInUser._id
                });
                newTransaction.save(function (err, transaction) {
                    if (err) {
                        log('Error in Transaction store => save : ', err.message);
                        helpers.createResponse(res, constants.SERVER_ERROR,
                            messages.MODULE_STORE_ERROR(constants.TRANSACTION_MODEL_NAME),
                            {'error': messages.SERVER_ERROR_MESSAGE}
                        );
                    } else {
                        log('Transaction added successfully !');
                        helpers.createResponse(res, constants.SUCCESS, null, {'data': null});
                    }
                });
            }
        } catch (err) {
            log('Error in transaction => store API : ', err);
            helpers.createResponse(res, constants.SERVER_ERROR,
                messages.SERVER_ERROR_MESSAGE,
                {'error': messages.SERVER_ERROR_MESSAGE}
            );
        }
    }, // store function close

    /**
     * show() get details of particular resource
     * based on passed resource id
     *
     * @url {{URL}}/transaction/resourceId
     * @param <ObjectId> resourceId
     * @return <Element> Resource Details
     */

    show: function (req, res) {
        helpers.findOne(res, Transaction, constants.TRANSACTION_MODEL_NAME,
            {'_id': req.params.objectId}, {},
            function (transaction) {
                if (!transaction || typeof transaction === 'undefined') {
                    log("Transaction does not exist for " + req.params.objectId + " in show method :");
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.MODULE_NOT_FOUND(constants.TRANSACTION_MODEL_NAME),
                        {'error': messages.MODULE_NOT_FOUND(constants.TRANSACTION_MODEL_NAME)});
                } else {
                    log('Transaction show API Success!');
                    helpers.createResponse(res, constants.SUCCESS,
                        messages.MODULE_SHOW_SUCCESS(constants.TRANSACTION_MODEL_NAME),
                        { 'data' : transaction }
                    );
                }
            }
        );
    }, //show function close

    /**
     * update() update details of particular resource
     * based on passed resource id
     *
     * @url {{URL}}/transaction/resourceId
     * @param <String> resourceId, resource data
     * @return <Element> update or failure message
     */

    update: function (req, res) {
        helpers.findOne(res, Transaction, constants.TRANSACTION_MODEL_NAME,
            {'_id': req.params.objectId}, {},
            function (transaction) {
                if (!transaction || typeof transaction === 'undefined') {
                    log("Transaction does not exist for " + req.params.objectId + " in update method :");
                    helpers.createResponse(res, constants.UNPROCESSED,
                        messages.MODULE_NOT_FOUND(constants.TRANSACTION_MODEL_NAME),
                        {'error': messages.MODULE_NOT_FOUND(constants.TRANSACTION_MODEL_NAME)});
                } else {
                    helpers.findOneUpdateOrInsert(res, Transaction, constants.TRANSACTION_MODEL_NAME,
                        {_id: req.params.objectId}, {$set: {status: req.body.status}},
                        {new: true, runValidators: true},
                        function (updatedStatus) {
                            log('Transaction status has been updated successfully !');
                            helpers.createResponse(res, constants.SUCCESS, null, {'data': null});
                        }
                    )
                }
            }
        );
    }, //show function close
};