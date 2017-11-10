'use strict';

var refercodeController = require('./RefercodeController');
var router              = express.Router();

module.exports = (function () {

    router.get('/', [validatorClass.validatePaginationParams(), validatorClass.refercodeRouteValidate('index')], function (req, res, next) {
        refercodeController.index(req, res);
    });

    router.post('/', [validatorClass.refercodeRouteValidate('store')], function (req, res, next) {
        refercodeController.store(req, res);
    });

    /*router.get('/:objectId', [validatorClass.refercodeRouteValidate('show')], function (req, res, next) {
        refercodeController.show(req, res);
    });*/

    return router;
})();