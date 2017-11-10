'use strict';

var transactionController = require('./TransactionController');
var router                = express.Router();

module.exports = (function () {

    router.get('/', [validatorClass.validatePaginationParams(), validatorClass.transactionRouteValidate('index')], function (req, res, next) {
        transactionController.index(req, res);
    });

    router.post('/', [validatorClass.transactionRouteValidate('store')], function (req, res, next) {
        transactionController.store(req, res);
    });

    router.get('/:objectId', [validatorClass.transactionRouteValidate('show')], function (req, res, next) {
        transactionController.show(req, res);
    });

    router.put('/:objectId', [validatorClass.transactionRouteValidate('update')], function (req, res, next) {
        transactionController.update(req, res);
    });

    return router;
})();