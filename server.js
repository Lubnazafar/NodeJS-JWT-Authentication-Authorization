const express = require('express');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const user = require('./models/userModel')
const routes = require('./routes/route.js');
const config = require('./config/config.js');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');


const app = express();

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  host: 'localhost:4000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/route.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Using SSL for securing HTTP path
const privateKey = fs.readFileSync('./key.pem');
const certificate = fs.readFileSync('./cert.pem');
const passphrase = 'whatisthis';

const credentials = {
  key: privateKey,
  cert: certificate,
  passphrase: passphrase
};

const PORT = config.PORT || 4000;
// check mysql connection
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'socka'
});
db.connect((err) =>{
  if(err) throw err;
  console.log('Successfully connected to MYSQL DB'); 
});
//Check mongo DB connection
mongoose.connect(config.URL, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");    
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

app.use(bodyParser.urlencoded({ extended: true }));

// debugger;

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    try {
      const accessToken = req.headers["x-access-token"];
      const { userId, exp } = await jwt.verify(accessToken, config.JWT_SECRET);
      // If token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: "JWT token has expired, please login again"
        });
      }
      res.locals.loggedInUser = await user.findById(userId);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});
// app.get('/', function(req, response){
//    response.send('hello world');
// });
app.use('/', routes);
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})