/*const Web3 = require('Web3');
var express = require('express'); 

var fs = require('fs');*/
import * as Web3 from 'Web3';
import  express from 'express';
import * as fs from 'fs';
import * as ipfs from 'ipfs-core';

var app = express();

const hostname = '127.0.0.1';
const port = 3000; 

/*const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.sendFile('views/index.html', {root: __dirname })
});*/

app.get('/', function(req, res) {
  res.sendFile('views/index.html', {root: "." })
});

app.post('/certInfo', function(req, res) {
  res.redirect('/?status=valid');
});

app.get('*.js', function(req, res) {
  res.sendFile(`views/${req.originalUrl.split('?').shift()}`, {root: "." });
});

app.get('*.css', function(req, res) {
  res.sendFile(`views/${req.originalUrl.split('?').shift()}`, {root: "." });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});