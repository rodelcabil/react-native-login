import React, { useState, useEffect } from 'react'
import Pusher from 'pusher-js/react-native';
import pusherConfig from '../pusher.json'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import ChatView from './Messaging/GroupChatView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatClient = ({ name, route, chatMateName, clientID, type, first_name, last_name, roomId, myID }) => {
    // const [messages, setMessages] = useState([{name: 'rodel', action: 'message', message: 'hello'}, {name: 'Jim', action: 'message', message: 'hi'}]);
    const [messages, setMessages] = useState([]);
    const [loader, setLoader] = useState(true)
    const [ddate, setdDate] = useState();
    const [my_uuid, setUuid] = useState();


    useEffect(() => {
        componentDidMount();
        const pusher = new Pusher(pusherConfig.key, pusherConfig);
        const chatChannel = pusher.subscribe(`${roomId}`);
        chatChannel.bind('pusher:subscription_succeeded', () => {
            chatChannel.bind('join', (data) => { // (4)
                handleJoin(data.name);
            });
            chatChannel.bind('part', (data) => { // (5)
                handlePart(data.name);
            });
            chatChannel.bind('message', (data) => {
                handleMessage(data.id, data.message, data.sender_id, data.roomId, data.created_at, data.updated_at, data.first_name, data.last_name, data.channelName);
            });
        });

        return () => {
            componentWillUnmount();
            pusher.unsubscribe("presence-channel");
        };
    }, [])


    const getMessages = async () => {
        console.log("MY NAME: ", name)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;
        await axios.get(
            `https://beta.centaurmd.com/api/chat/client-group-message?group_id=${roomId}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setMessages(response.data)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/users/${clientID}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {



                const tempArr = [];
                const temp = response.data.map((user) => {
                    const userID = user.id;


                    messages.map((item) => {
                        const senderID = item.sender_id;

                        if (senderID === userID) {
                            tempArr.push({
                                ...item,
                                first_name: user.first_name,
                                last_name: user.last_name
                            })
                        }

                    })

                    return tempArr
                })

                console.log("TEMP ARR: ", temp)


                let sort = temp.sort(function (a, b) {
                    return (a.created_at > b.created_at) - (a.created_at < b.created_at);
                });
                console.log("UNMOUNTED SORTED DATA:", sort)

                setMessages(sort);
                setLoader(false);

            })
    }

    const componentDidMount = async () => { // (7)
        console.log("MY NAME: ", name)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;
        await axios.get(
            `https://beta.centaurmd.com/api/chat/client-group-message?group_id=${roomId}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setMessages(response.data)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/users/${clientID}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {



                const tempArr = [];
                response.data.map((user) => {
                    const userID = user.id;


                    messages.map((item) => {
                        const senderID = item.sender_id;

                        if (senderID === userID) {
                            tempArr.push({
                                ...item,
                                first_name: user.first_name,
                                last_name: user.last_name
                            })
                        }

                    })

                    return tempArr
                })

                


                let sort = tempArr.sort(function (a, b) {
                    return (a.created_at > b.created_at) - (a.created_at < b.created_at);
                });
                console.log("UNMOUNTED SORTED DATA:", sort)

                setMessages(sort);
                setLoader(false);

            })
        fetch(`${pusherConfig.restServer}/users/${name}`, {
            method: 'PUT'
        });
    }

    const componentWillUnmount = async () => { // (8)
        console.log("MY NAME: ", name)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;
        await axios.get(
            `https://beta.centaurmd.com/api/chat/client-group-message?group_id=${roomId}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setMessages(response.data)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/users/${clientID}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {



                const tempArr = [];
                response.data.map((user) => {
                    const userID = user.id;


                    messages.map((item) => {
                        const senderID = item.sender_id;

                        if (senderID === userID) {
                            tempArr.push({
                                ...item,
                                first_name: user.first_name,
                                last_name: user.last_name
                            })
                        }

                    })

                    return tempArr
                })

             


                let sort = tempArr.sort(function (a, b) {
                    return (a.created_at > b.created_at) - (a.created_at < b.created_at);
                });
                console.log("UNMOUNTED SORTED DATA:", sort)

                setMessages(sort);
                setLoader(false);

            })
        fetch(`${pusherConfig.restServer}/users/${name}`, {
            method: 'DELETE'
        });

    }

    const handleMessage = (id, message, sender_id, roomId, created_at, updated_at, first_name, last_name) => {
        const my_messages = messages.slice();
        my_messages.push({
            created_at: created_at,
            first_name: first_name,
            group_id: roomId,
            id: id,
            last_name: last_name,
            message: message,
            sender_id: sender_id,
            updated_at: updated_at,
        });

        setMessages(my_messages)
    }

    const handleJoin = () => { // (4)
        const my_messages = messages.slice();
        my_messages.push({ action: 'join', name: name, channelName: roomId });
        setMessages(my_messages);
        console.log(name, " JOINED");
    }

    const handlePart = () => { // (5)
        const my_messages = messages.slice();
        my_messages.push({ action: 'part', name: name, channelName: roomId });
        setMessages(my_messages)
    }

    const onSendMessage = (id, message, sender_id, created_at, updated_at, roomId, first_name, last_name) => {
        console.log("called onSendMessage");
        const payload = {
            id: id,
            group_id: roomId,
            sender_id: sender_id,
            message: message,
            created_at: created_at,
            updated_at: updated_at,
            first_name: first_name,
            last_name: last_name,
            channelName: roomId
        };
        try {
            fetch(`${pusherConfig.restServer}/users/${name}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
        }
        catch (error) {
            console.log(error);
        }
        console.log("Message:", message, "Message ID:", id, "Sender ID:", sender_id, 'Created at:', created_at, 'Updated at:', updated_at, 'Group ID:', roomId, 'First Name:', first_name, 'Last Name:', last_name);
    }


    const handleSendMessage = (text) => {
        onSendMessage(text)
    }



    return (
        <>

            <ChatView message={messages} onSendMessage={onSendMessage} name={chatMateName} type={type} first_name={first_name} last_name={last_name} roomId={roomId} userID={myID} loader={loader} />
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