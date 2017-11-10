require('dotenv').config()

express 	= module.exports = require('express');
helmet      = module.exports = require('helmet');
bodyParser  = module.exports = require('body-parser');
morgan      = module.exports = require('morgan');
mongoose    = module.exports = require('mongoose');
fileUpload  = module.exports = require('express-fileupload');
validator   = module.exports = require('express-validator');
_           = module.exports = require('underscore');
fs          = module.exports = require('fs');
hbs         = module.exports = require('express-handlebars');
path        = module.exports = require('path');
moment      = module.exports = require('moment');
util        = module.exports = require('util');
async       = module.exports = require('async');
RateLimit   = module.exports = require('express-rate-limit');
nodemailer  = module.exports = require('nodemailer');



BASE_PATH   = module.exports = __dirname;

//create app instance
app         = module.exports = express();

// view engine setup
app.engine('hbs', hbs({extname:'hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

config          = module.exports = require(BASE_PATH + '/config/env'); // get our config file
constants       = module.exports = require(BASE_PATH + '/app/utils/common/constants'); // get our constants file
messages        = module.exports = require(BASE_PATH + '/app/utils/common/message.js'); // get messages
helpers         = module.exports = require(BASE_PATH + '/app/utils/common/helper.js'); // response
validatorClass  = module.exports = require(BASE_PATH + '/app/utils/common/validator.js'); //validator
customValidator = module.exports = require(BASE_PATH + '/app/utils/common/customValidator'); //custom validator
cors            = module.exports = require(BASE_PATH + '/app/utils/common/cors'); //cors validator

app.use(helmet()); // secure app with helmet
app.use(bodyParser.urlencoded({extended : false})); // extended false will accept only string and array
app.use(bodyParser.json());
app.use(validator(customValidator)); // allow to use custom validator from file
app.use(function (req, res, next) { cors.checkCORS(req, res, next) });
app.use(fileUpload());

//create public directory
var publicDir = BASE_PATH + '/public';
if (!fs.existsSync(publicDir))
    fs.mkdirSync(publicDir);

var logDir = BASE_PATH + '/log';
if (!fs.existsSync(logDir))
    fs.mkdirSync(logDir);


log = module.exports = function (arr) {
    var date = helpers.getIndianDate();
    var data = '\n _________ ' + date + ' _________ ';

    console.log(data);
    for (var i = 0; i < arguments.length; i++){
        console.log(util.inspect(arguments[i], {depth: null, colors: true}) );
        fs.appendFile(logDir + '/log.txt', '\n' + date + " : " + arguments[i], function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
};

mongoose.Promise = global.Promise;

/*

Mongoose Configuration 

Mongoose connects to your locally installed mongo database and sends
user and referral information there.  Check out the mongo documentation
for more information on how to build your database check out 

https://docs.mongodb.com/manual/reference/connection-string/

EXAMPLE 1:
mongoose.connect(''mongodb://localhost/myDB'', {useMongoClient: true});


EXAMPLE 2:
mongoose.connect(
                'mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]',
                {useMongoClient: true}
                );


*/

try {
    conn_string = 'mongodb://' + config.DB_USERNAME+ ':'+ config.DB_PASSWORD+'@'+ config.DB_HOST+ ':'+ config.DB_PORT+ '/'+ config.DB_NAME;
} catch (err) {
    conn_string = "mongodb://localhost:27017/" + config.DB_NAME;
}

mongoose.connect(
                conn_string,
                {useMongoClient: true}
                );


/* END MONGOOSE CONFIGURATION */

var publicRoutes      = require(BASE_PATH + '/routes/index.js');
var userRoutes        = require(BASE_PATH + '/app/components/User/UserRoute');
var transactionRoutes = require(BASE_PATH + '/app/components/Transaction/TransactionRoute');
var refercodeRoutes   = require(BASE_PATH + '/app/components/Refercode/RefercodeRoute');

app.use('/api/transaction', validatorClass.useJWTMiddleware(), transactionRoutes); //transaction routes
app.use('/api/user', validatorClass.useJWTMiddleware(), userRoutes); //user routes

//Keep this route to last route as we need static token for this route
app.use('/api/referrals', validatorClass.allowGuestRequests(), refercodeRoutes); //refercode routes
app.use('/api', validatorClass.secureOpenRoutes() , publicRoutes);

app.listen(config.PORT, function () {
    log('RESTful API server started on : ' + config.PORT);
});

//welcome message
app.get('/', function (req, res, next) {
    res.send('Welcome to Proof Token Sale Dashboard API');
});

app.use(function (req, res) {
    helpers.createResponse(res, constants.NOT_FOUND,
        messages.URL_NOT_FOUND,
        {error : messages.URL_NOT_FOUND}
    );
});

