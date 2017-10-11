'use strict';

var CryptoJS = require("crypto-js");
var express = require("express");
var bodyParser = require('body-parser');
const p2p = require('./src/p2p');
const chain = require('./src/chain');
const MessageType = require('./src/data/messageType');

var http_port = process.env.HTTP_PORT || 3001;
var initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
      res.send(chain.listBlocks())
    });

    app.post('/mineBlock', (req, res) => {
        chain.mineBlock();
        res.send();
    });
    app.get('/peers', (req, res) => {
      res.send(p2p.listPeers());
    });
    app.post('/addPeer', (req, res) => {
        console.log('ADDING PEER!!!!!!!');
        p2p.connectToPeers([req.body.peer]);
        res.send();
    });
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};

p2p.connectToPeers(initialPeers);
initHttpServer();
p2p.initP2PServer();
