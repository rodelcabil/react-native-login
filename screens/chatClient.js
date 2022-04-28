import React, { useState, useEffect } from 'react'
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../pusher.json'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import ChatView from './chatView';

const ChatClient = ({ name }) => {
    // const [messages, setMessages] = useState([{name: 'rodel', action: 'message', message: 'hello'}]);
    const [messages, setMessages] = useState([]);

    const pusher = new Pusher(pusherConfig.key, pusherConfig);
    const chatChannel = pusher.subscribe('chat_channel');
    chatChannel.bind('pusher:subscription_succeeded', () => {
        chatChannel.bind('join', () => { // (4)
            handleJoin();
        });
        chatChannel.bind('part', () => { // (5)
            handlePart();
        });
        chatChannel.bind('message', (data) => {
            handleMessage(data.message);
        });
    });

    useEffect(() => {
        console.log("MESSAGE: ", messages)
        componentDidMount();
        componentWillUnmount();
    }, [messages])


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


    const handleMessage = (message) => {
        const my_messages = messages.slice();
        messages.push({ action: 'message', name: 'Rodel', message: message });
        setMessages(my_messages);
    }

    const handleJoin =()=> { // (4)
        const messages = this.state.messages.slice();
        messages.push({ action: 'join', name: name });
        setMessages(my_messages);
    }

    const handlePart =()=> { // (5)
        const messages = this.state.messages.slice();
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
            <Text>Name: {name}</Text>
            <ChatView message={messages} onSendMessage={onSendMessage} />
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