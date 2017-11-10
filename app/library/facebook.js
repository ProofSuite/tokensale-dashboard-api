'use strict';

var FB = require('fb');

var fb = new FB.Facebook();

FB.options({version: 'v2.8', appId: config.FB_APP_ID, appSecret: config.FB_APP_SECRET});

module.exports = fb;