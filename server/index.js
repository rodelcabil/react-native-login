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

app.post('/api/chat/group/:roomId', function(req, res) { // (5)
   const { message, sender_id, channelName } = req.body;   
   console.log("Working")
   console.log(' sent message: ' +message + " sender_id: ", sender_id, `Channel Name ${channelName}`);
    pusherClient.trigger(`${channelName}`, 'message', {
        message: message,
        sender_id: sender_id
    });
    res.sendStatus(204);
});

app.listen(4000, function() { // (6)
    console.log('App listening on port 4000');
});