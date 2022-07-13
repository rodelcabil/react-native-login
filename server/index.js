const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const pusherConfig = require('./pusher.json'); // (1)
const pusherClient = new Pusher(pusherConfig);

const app = express(); // (2)
app.use(bodyParser.json());

app.put('/users/:name', function (req, res) { // (3)
    console.log('User joined: ' + req.params.name);
    pusherClient.trigger(`${req.body.channelName}`, 'join', {
        name: req.params.name
    });
    res.sendStatus(204);
});

app.delete('/users/:name', function (req, res) { // (4)
    console.log('User left: ' + req.params.name);
    pusherClient.trigger(`${req.body.channelName}`, 'part', {
        name: req.params.name
    });
    res.sendStatus(204);
});

app.post('/users/:name/messages', function (req, res) {
    
    console.log("Message: ",req.body.message, "\nMessage ID: ", req.body.id,"\nSender ID: ", req.body.sender_id, '\nCreated at: ', req.body.created_at, '\nUpdated at: ', req.body.updated_at, '\nGroup ID: ', req.body.group_id, "\nFirst Name: ",  req.body.first_name, "\nLast Name: ",  req.body.last_name  + "\nAction",  req.body.action );
    pusherClient.trigger(`${req.body.channelName}`, 'group_message', {
        id: req.body.id,
        group_id: req.body.roomId,
        message: req.body.message,
        sender_id: req.body.sender_id,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        roomId: req.body.roomId,
        action: req.body.action,
    });
    res.sendStatus(204);
});

    console.log("Single Message: ",req.body.message, "\nMessage ID: ", req.body.id,"\nSender ID: ", req.body.sender_id, "\nReceiver ID: ", req.body.receiver_id, '\nCreated at: ', req.body.created_at, '\nUpdated at: ', req.body.updated_at, '\nGroup ID: ', req.body.group_id, "\nFirst Name: ",  req.body.first_name, "\nLast Name: ",  req.body.last_name  + "\n");
    pusherClient.trigger(`${req.body.channelName}`, 'single_message', {
        id: req.body.id,
        roomId: req.body.roomId,
        message: req.body.message,
        sender_id: req.body.sender_id,
        receiver_id: req.body.receiver_id,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    });
  


app.listen(4000, function () { // (6)
    console.log('App listening on port 4000');
});