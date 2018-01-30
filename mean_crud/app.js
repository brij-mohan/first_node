//import modules


var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();
const route = require('./routes/route');

//Connection to mongodb database
mongoose.connect('mongodb://localhost:27017/contactlist');

//Check whether connection is made or not
mongoose.connection.on('connected', ()=>{
    console.log('Connect to mongo db database');
});

mongoose.connection.on('error', (err)=>{
  if(err){
        console.log('Error in connection establish' + err);
  }

});

//Port No
const port = 3001;

//Adding middleware cors
app.use(cors());

//Body parser middleware
app.use(bodyparser.json());

//Static file
app.use(express.static(path.join(__dirname,'public')));

app.use('/api',route);

//Testing route
app.get('/',(req,res)=>{
    res.send('foobar');
});

app.listen(port, ()=>{
    console.log('server started at port' + port);
});
