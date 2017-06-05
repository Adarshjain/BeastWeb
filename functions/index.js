'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
// const validateFirebaseIdToken = (req, res, next) => {
//   console.log('Check if request is authorized with Firebase ID token');

//   if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
//       !req.cookies.__session) {
//     console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
//         'Make sure you authorize your request by providing the following HTTP header:',
//         'Authorization: Bearer <Firebase ID Token>',
//         'or by passing a "__session" cookie.');
//     res.status(403).send('Unauthorized');
//     return;
//   }

//   let idToken;
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
//     console.log('Found "Authorization" header');
//     // Read the ID Token from the Authorization header.
//     idToken = req.headers.authorization.split('Bearer ')[1];
//   } else {
//     console.log('Found "__session" cookie');
//     // Read the ID Token from cookie.
//     idToken = req.cookies.__session;
//   }
//   admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
//     console.log('ID Token correctly decoded', decodedIdToken);
//     req.user = decodedIdToken;
//     next();
//   }).catch(error => {
//     console.error('Error while verifying Firebase ID token:', error);
//     res.status(403).send('Unauthorized');
//   });
// };

app.use(cors);
app.use(cookieParser);
// app.use(validateFirebaseIdToken);
console.log('started');
app.get('/', (req, res) => {
    console.log('requested hello');

    res.send(`Hello`);
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);













































// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
// const express = require('express');
// const cp = require('cookie-parser');
// const cors = require('cors')({origin: true});
// const app = express();
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(cors);
// app.use(cp());
// var patho = __dirname + '/public/';
// app.get('/', function(req, res) {
//     // res.clearCookie('token');
//     if(req.cookies.token) {
//         res.send('index');
//     } else {
//         res.redirect('/login');
//     }
// });
// app.use(express.static(patho));

// app.get('/login', function(req, res) {
//     if(!req.cookies.token) {
//         res.send('login');
//     } else {
//         res.redirect('/');
//     }
// });

// app.get('/logout',function (req,res) {
//     res.clearCookie('token');
//     res.redirect('/login');
// })

// app.post('/login', function(req, res) {
//     var token = req.body.token;
//     res.cookie('token', token);
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify({ a: 1 }));
//     console.log('Redirected to /');
// });

// exports.app = functions.https.onRequest(app);

// // app.use(validateFirebaseIdToken);
