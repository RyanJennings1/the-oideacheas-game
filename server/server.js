require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var morgan = require('morgan');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(morgan('combined'));

// use JWT auth to secure the api
// app.use(expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register', '/api/questions/register', '/api/questions/authenticate', '/api/scores/register', '/api/scores/authenticate'] }));
app.use(expressJwt({ secret: config.secret }).unless({ path: /\/api/i}));

// routes
app.use('/api/users', require('./controllers/users.controller'));
app.use('/api/questions', require('./controllers/questions.controller'));
app.use('/api/scores', require('./controllers/scores.controller'));

// start server
var port = process.env.NODE_ENV === 'production' ? 8080 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
