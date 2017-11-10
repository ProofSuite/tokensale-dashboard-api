validator = require('express-validator');

module.exports = {
    customValidators: {
        notEmptyArray : function(value) {
            if (value === null || typeof value === 'undefined') {
                return false;
            } else {
                try {
                    var a = JSON.parse(value);
                    if (a.length > 0)
                        return true;
                    else
                        return false;
                } catch(err) {
                    log(err);
                    return false;
                }
            }
        },
        notEquals: function (value1, value2) {
            try {
                if (value1 === value2)
                    return false;
                else
                    return true;
            } catch (err) {
                log('Error during notEquals validator :', err);
                return false;
            }
        }
    }
};