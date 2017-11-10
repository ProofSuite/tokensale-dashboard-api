'use strict';

const nodemailer   = require('nodemailer');
const sgTransport  = require('nodemailer-sendgridv3-transport');

var options = {
	auth: {
		api_user: 'prooftokensale',
		api_key: process.env.SENDGRID_API_KEY
	}
};

var transporter = nodemailer.createTransport(sgTransport(options));

module.exports.transporter = transporter;