const express = require('express');
const hbs     = require('hbs');
const fs      = require('fs');

const app = express();

// Define HBS as view engine
//
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.set('view engine', 'hbs');


// Log server request
//
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;

  console.log(log);

  fs.appendFile('server.log', log + '\n', (err) => {
    if (err)
      console.log('Unable to append to server.log.');
  });

  next();
});

// Maintenance mode
//
app.use((req, res, next) => {
  res.render('maintenance.hbs');
});

// Server Static files
//
app.use(express.static(__dirname + '/public'));


// Define Routes
//
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs',{
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
    res.send({
      errorMessage: 'Unable to handle request'
    });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
