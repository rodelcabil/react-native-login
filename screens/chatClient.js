import React, { useState, useEffect } from 'react'
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../pusher.json'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import ChatView from './chatView';

const ChatClient = ({ name }) => {
    // const [messages, setMessages] = useState([{name: 'rodel', action: 'message', message: 'hello'}, {name: 'Jim', action: 'message', message: 'hi'}]);
    const [messages, setMessages] = useState([]);

    const pusher = new Pusher(pusherConfig.key, pusherConfig);
    const chatChannel = pusher.subscribe('chat_channel');
    chatChannel.bind('pusher:subscription_succeeded', () => {
        chatChannel.bind('join', (data) => { // (4)
            handleJoin(data.name);
        });
        chatChannel.bind('part', (data) => { // (5)
            handlePart(data.name);
        });
        chatChannel.bind('message', (data) => {
            handleMessage(data.name,data.message);
        });
    });

    // useEffect(() => {
    //     // console.log("MESSAGE: ", messages)
    //     componentDidMount();
    //     componentWillUnmount();
    // }, [])


    const componentDidMount = () => { // (7)
        fetch(`${pusherConfig.restServer}/users/${name}`, {
            method: 'PUT'
        });
    }

    const componentWillUnmount = () => { // (8)
        fetch(`${pusherConfig.restServer}/users/${name}`, {
            method: 'DELETE'
        });

    }

    const handleMessage = (name, message) => {
        console.log("send message")
        const messagess = messages.slice();
        messagess.push({ action: 'message', name: name, message: message });
        setMessages(messagess);
    }

    const handleJoin =()=> { // (4)
        const my_messages = messages.slice();
        messages.push({ action: 'join', name: name });
        setMessages(my_messages);
    }

    const handlePart =()=> { // (5)
        const my_messages = messages.slice();
        messages.push({ action: 'part', name: name });
        setMessages(my_messages);
    }

    const onSendMessage = (text) => {
        const payload = {
            message: text
        };
        fetch(`${pusherConfig.restServer}/users/${name}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
       
        console.log('message: ', text);
        console.log('name: ', name)
     
    }

    const handleSendMessage = (text) => {
        onSendMessage(text)
    }



    return (
        <>
           
            <ChatView message={messages} onSendMessage={handleSendMessage} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center'
    },

});

export default ChatClient