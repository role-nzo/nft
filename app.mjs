/*const Web3 = require('Web3');
var express = require('express'); 
var fs = require('fs');*/
import * as ipfs from 'ipfs-core';
console.log(p)
//var app = express();

const hostname = '127.0.0.1';
const port = 3000; 

/*const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.sendFile('views/index.html', {root: __dirname })
});*/
/*
app.get('/', function(req, res) {
  res.sendFile('views/index.html', {root: __dirname })
});

app.post('/certInfo', function(req, res) {
  res.redirect('/?status=valid');
});

app.get('*.js', function(req, res) {
  res.sendFile(`views/${req.originalUrl.split('?').shift()}`, {root: __dirname });
});

app.get('*.css', function(req, res) {
  res.sendFile(`views/${req.originalUrl.split('?').shift()}`, {root: __dirname });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/