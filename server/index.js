const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const pusherConfig = require('./pusher.json'); // (1)
const pusherClient = new Pusher(pusherConfig);

const app = express(); // (2)
app.use(bodyParser.json());

app.put('/users/:name', function(req, res) { // (3)
    console.log('User joined: ' + req.params.name);
    pusherClient.trigger(`${req.body.channelName}`, 'join', {
        name: req.params.name
    });
    res.sendStatus(204);
});

app.delete('/users/:name', function(req, res) { // (4)
    console.log('User left: ' + req.params.name);
    pusherClient.trigger(`${req.body.channelName}`, 'part', {
        name: req.params.name
    });
    res.sendStatus(204);
});

app.post('/users/:name/messages', function(req, res) { // (5)
    console.log('User ' + req.params.name + ' sent message: ' + req.body.message + " Time: ", req.body.date + " uuid: ", req.body.uuid, `Channel Name ${req.body.channelName}`);
    pusherClient.trigger(`${req.body.channelName}`, 'message', {
        name: req.params.name,
        message: req.body.message,
        date: req.body.date,
        uuid: req.body.uuid
    });
    res.sendStatus(204);
});

app.listen(4000, function() { // (6)
    console.log('App listening on port 4000');
});