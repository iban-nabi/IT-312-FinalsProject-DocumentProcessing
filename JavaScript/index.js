const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require('express-session');
// const dbservice = require("./dbservice");
const server = express();

dotenv.config();

// Use Pug for views
server.set("views","./views");
server.set("view engine", "pug");

// Use 'public' for static routes
server.use('/public', express.static('public'));

// Use middleware to parse POST request bodies
server.use(bodyParser.text());
server.use(bodyParser.urlencoded({ extended: true }));

// Set up sessions
server.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

server.get('/', (req, res) => {
    res.redirect('/login');
});

//COMMON
const loginRoute = require('./routes/common/login');
server.use('/login', loginRoute);

const logoutRoute = require('./routes/common/logout');
server.use('/logout', logoutRoute);

//REQUESTER
const requesterRoute = require('./routes/requester/requester-home');
server.use('/requester-home', requesterRoute);

const uploadRoute = require('./routes/requester/submit-document');
server.use('/submit-document', uploadRoute);

const viewDocumentSubmission = require('./routes/requester/view-submission-details');
server.use('/document-details', viewDocumentSubmission);

const notification = require('./routes/requester/notification');
server.use('/notification', notification);

//REVIEWER

const reviewerRoute = require('./routes/reviewer/reviewer-home');
server.use('/reviewer-home', reviewerRoute);

const revRoute = require('./routes/reviewer/doc-review');
server.use('/document-review', revRoute);

const pdfRoute = require('./routes/reviewer/pdf-route');
server.use('/pdf', pdfRoute);

const annotationHandler = require('./routes/reviewer/annotation-handler');
server.use('/annotation-handler.js', annotationHandler)

//SERVER RUNNING
server.listen(process.env.PORT, process.env.IP_ADDR, ()=>{ // from .env file ung process.env.PORT etc etc
    console.log(`server is running in port ${process.env.PORT}`);
});