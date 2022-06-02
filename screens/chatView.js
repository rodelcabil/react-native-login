import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import { useIsFocused, useRoute } from '@react-navigation/native';
import ChatAppBar from './ReusableComponents/ChatAppBar';
var width = Dimensions.get('window').width - 20;

const ChatView = ({ message, onSendMessage, name, type, first_name, last_name, roomId, userID }) => {
    const isFocused = useIsFocused();
    const [messages, setMessages] = useState('');
    const [myUuid, setMyUuid] = useState(uuid.v4());
    const [searchQuery, setSearchQuery] = useState('');
    const [myID, setMyID] = useState('');

    const myRef = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        const getUserDetails = async () => { 
            const value = await AsyncStorage.getItem('userDetails')
            const data = JSON.parse(value)
            setMyID(data?.id)
        }

        getUserDetails();
        
    },[isFocused])

    const onChangeSearch = query => { setSearchQuery(query) };

    const newList = searchQuery === "" ? message : message.filter(item => { return String(item?.message).includes(searchQuery) });


    const handleSendMessage = async () => {
        onSendMessage(messages, moment().calendar(), myID);

        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        console.log("User ID", userID, "Room ID: ",  roomId, "Message", messages);
        const resp =   await axios({
            method: 'post',
            url: `https://beta.centaurmd.com/api/chat/group/${roomId}`,
            data: {
               sender_id: userID,
               message: messages,
            },
            headers: { 'Accept': 'application/json','Authorization': 'Bearer ' + tokenget, },
         });

         if(resp.status === 200){
            console.log(resp.data);
         }
         else{
             console.log("error");
         }

        myRef.current.clear();
        setMessages('')
    }

    const _keyExtractor = item => item.id;

    const renderItem = ({ item }) => {
        const action = item.action;
        const name = item.name;
        const date = item.date;
        const uuid = item.uuid;

        if (action == 'join') {
            return <View style={styles.inOutContainer}><Text style={styles.joinPart}>{name} has joined</Text></View>;
        } else if (action == 'part') {
            return <View style={styles.inOutContainer}><Text style={styles.joinPart}>{name} has left</Text></View>;
        } else if (action == 'message') {
            return uuid === myUuid ?
                <View style={{ flex: 1, padding: 5, flexDirection: 'column', alignItems: 'flex-end', marginBottom: 5, marginRight: 10, }}>
                    <Text style={{ textAlign: 'right', maxWidth: 200, fontSize: 12 }}>{date}</Text>
                    <Text style={styles.bubbleChatOwn}>{item.message}</Text>

                </View>


                :
                <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-start', marginBottom: 5, }}>
                    <View style={styles.othersChat}>
                        <Avatar.Text size={45} label={item.name[0]} />
                        <View style={{ flexDirection: 'column', marginLeft: 10, alignItems: 'flex-start' }}>

                            <Text style={{ maxWidth: 300, textAlign: 'left', fontSize: 12 }}>{name}, {date} </Text>
                            <Text style={styles.bubbleChatOthers}>{item.message}</Text>

                        </View>
                    </View>
                </View>;
        }
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <ChatAppBar title={name} type={type} first_name={first_name} last_name={last_name} roomId={roomId}/>
                <View style={{ backgroundColor: '#fff', }} >
                    <Searchbar
                        style={{ width: Dimensions.get('window').width - 20, alignSelf: 'center', marginBottom: 10, shadowOpacity: 0, elevation: 0, backgroundColor: '#e3e3e3' }}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        inputStyle={{ fontSize: 15 }}
                        autoFocus={false}
                        showSoftInputOnFocus={false}

                    />
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        ref={scrollRef}
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                    >
                        <View>
                            {newList.map((item, key) => {
                                return <>
                                {
                                    /* {item?.action == 'join' ? <View key={key} style={styles.inOutContainer}><Text style={styles.joinPart}>{item?.name} has joined</Text></View>
                                    :
                                    item?.action == 'part' ? <View key={key} style={styles.inOutContainer}><Text style={styles.joinPart}>{item?.name} has left</Text></View>
                                        :
                                        item?.action == 'message' ? 
                                         */}
                                       { item?.sender_id === myID ?
                                            <View key={key} style={{ flex: 1, padding: 5, flexDirection: 'column', alignItems: 'flex-end', marginBottom: 5, marginRight: 10, }}>
                                                <Text style={{ textAlign: 'right', maxWidth: 200, fontSize: 12 }}>{item?.created_at}</Text>
                                                <Text style={styles.bubbleChatOwn}>{item?.message}</Text>

                                            </View>
                                            :
                                            <View key={key} style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-start', marginBottom: 5, }}>
                                                <View style={styles.othersChat}>
                                                    <Avatar.Text size={45} label={"S"} />
                                                    <View style={{ flexDirection: 'column', marginLeft: 10, alignItems: 'flex-start' }}>

                                                        <Text style={{ maxWidth: 300, textAlign: 'left', fontSize: 12 }}>{item?.first_name + " " + item?.last_name}, {item?.created_at} </Text>
                                                        <Text style={styles.bubbleChatOthers}>{item?.message}</Text>

                                                    </View>
                                                </View>
                                            </View>
                                            
                                       }
                                {/* } */}
                                </>


                            })}
                        </View>


                    </ScrollView>
                </View>

                <View style={styles.textInputContainer}>
                    <KeyboardAvoidingView>
                        <TextInput
                            autoFocus={false}
                            keyboardType="default"
                            returnKeyType="done"
                            enablesReturnKeyAutomatically
                            placeholder='Type a message'
                            style={{
                                width: messages.length === 0 ? Dimensions.get('window').width - 20 : Dimensions.get('window').width - 60,

                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                marginLeft: 5,
                                marginRight: 5,
                                marginVertical: 10,
                                fontSize: 14,
                                borderRadius: 10,
                                backgroundColor: '#e3e3e3',
                            }}
                            blurOnSubmit={false}
                            // onSubmitEditing={this.handleSendMessage}
                            value={messages}
                            onChangeText={message => { setMessages(message) }}
                            ref={myRef}
                            multiline={true}
                        />
                    </KeyboardAvoidingView>
                    <Icon name='send-circle' size={40} color="#3a87ad" onPress={() => handleSendMessage()} style={{ display: messages.length === 0 ? 'none' : 'flex', marginBottom: 12.6 }} />
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    ownChat: {
        alignItems: 'flex-end',
        marginTop: 10,
        width: Dimensions.get('window').width - 60,
        marginLeft: 30,
    },
    othersChat: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 30,
        width: Dimensions.get('window').width - 60,
        flexDirection: 'row',
    },
    bubbleChatOwn: {
        backgroundColor: "#d6f5ff",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        borderRadius: 15,
        maxWidth: 300,

    },
    bubbleChatOthers: {
        backgroundColor: "#f0f2f0",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        borderRadius: 15,
        textAlign: 'left',
        maxWidth: 300,

    },


    container: {
        flex: 1,
        backgroundColor: '#fff',

        // paddingTop: Constants.statusBarHeight
    },
    username: {

        width: Dimensions.get('window').width - 60,
        alignSelf: 'stretch',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 10,
        fontSize: 14,
        borderRadius: 10,
        backgroundColor: '#e3e3e3',

    },
    messages: {
        flexDirection: 'row',
        color: 'black',
        background: 'orange',
        marginBottom: 60,
        width: Dimensions.get('window').height - 100,

    },
    input: {
        alignSelf: 'stretch',

    },
    joinPart: {
        fontStyle: 'italic',
    },
    inOutContainer: {
        padding: 5,
        width: Dimensions.get('window').width,
        alignItems: 'center'
    },

    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        borderTopWidth: 0.6,
        borderColor: '#e3e3e3',
        justifyContent: 'space-evenly'
    },
    icon: {
        marginBottom: 12.6
    }
});
export default ChatView