var express = require('express');
var app = express();
var cp = require('cookie-parser');
var firebase = require("firebase");
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var config = {
    apiKey: "AIzaSyD4hFHqjK0g8dDh44tkWpRXp5Jo__SW16A",
    authDomain: "beat-bd6ed.firebaseapp.com",
    databaseURL: "https://beat-bd6ed.firebaseio.com",
    projectId: "beat-bd6ed",
    storageBucket: "beat-bd6ed.appspot.com",
    messagingSenderId: "190578562172"
};
firebase.initializeApp(config);

var port = process.env.PORT || 8080;

app.use(cp());
var patho = __dirname + '/public/';
app.get('/', function(req, res) {
    // res.clearCookie('token');
    if(req.cookies.token) {
        res.sendFile(patho + 'index.html');
    } else {
        res.redirect('/login');
    }
});
app.use(express.static(patho));

app.get('/login', function(req, res) {
    if(!req.cookies.token) {
        res.sendFile(patho + 'login.html');
    } else {
        res.redirect('/');
    }
});

app.get('/logout',function (req,res) {
    res.clearCookie('token');
    res.redirect('/login');
})

app.post('/login', function(req, res) {
    var token = req.body.token;
    res.cookie('token', token);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));
    console.log('Redirected to /');
});

app.listen(port, function() {
    console.log('app running');
});
