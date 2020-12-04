var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');

var app =  express();

const route = require('./route/routes');
const config = require('./config');

const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  }

const connectWithRetry = () => {
  console.log('Connection to mongoDb on uri: ' + config.mongo.uri);
  mongoose.connect(config.mongo.uri, options).then(()=>{
    console.log('MongoDB is connected at port 27017')
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
    setTimeout(connectWithRetry, 5000)
  })
}

connectWithRetry()

const PORT = 3000;

// add middleware 
// cors
app.use(cors());

// body-parser
app.use(bodyparser.json());

app.use('/api', route);

app.get('/',(req,res)=>{
    res.send('hello amr');
});

app.listen(PORT, ()=>{
    console.log('Server has been started at port:'+PORT);
});