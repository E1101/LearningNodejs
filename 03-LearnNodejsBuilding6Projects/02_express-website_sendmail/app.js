const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: false}) );
app.use( express.static(path.join(__dirname, 'public')) );

app.get('/', function(req, res) {
	res.render('index', {title: 'Computer Not Working?'});
});

app.get('/about', function(req, res) {
	res.render('about');
});

app.get('/contact', function(req, res) {
	res.render('contact');
});

app.post('/contact/send', function(req, res) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			//type: 'login',
			user: 'garyngreig@gmail.com',
			pass: ''
		}
	});

	let mailOptions = {
		from: 'Gary Greig <garyngreig@gmail.com>',
		to: 'techinfoguy@gmail.com',
		subject: 'Website Submission',
		text: 'You have 1_understand_async submission with the following details... Name: ' + req.body.name + 'Email: ' + req.body.email + 'Message: ' + req.body.message,
		html: '<p>You have 1_understand_async submission with the following details...</p><ul><li>' + req.body.name + '</li><li>Email: ' + req.body.email + '</li><li>Message: ' + req.body.message + '</li></ul>'
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error)
			console.log(error);
		else
			console.log('Message Sent: '+info.response);

		res.redirect('/');
	});
});

app.listen(3000);

console.log('Server is running on port 3000');