import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, StyleSheet, VirtualizedList, ScrollView } from 'react-native'
import { Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import { useIsFocused, useRoute } from '@react-navigation/native';
import ChatAppBar from '../ReusableComponents/ChatAppBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LoaderSmall from '../ReusableComponents/LottieLoader-Small';
import { ca } from 'date-fns/locale';
var width = Dimensions.get('window').width - 20;

const GroupChatView = ({ message, onSendMessage, name, type, first_name, last_name, roomId, loader }) => {

    const [myMessage, setMyMessage] = useState('');
    const [myUuid, setMyUuid] = useState(uuid.v4());
    const [searchQuery, setSearchQuery] = useState('');
    const [myID, setMyID] = useState('');
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [offset,setOffset] = useState(0);
    const myRef = useRef();
    const scrollRef = useRef(scrollRef => scrollRef.current?.scrollToEnd({ animated: true }));

    useEffect(() => {
        const getUserDetails = async () => {
            const value = await AsyncStorage.getItem('userDetails')
            const data = JSON.parse(value)
            setMyID(data?.id)
            setFirstName(data?.first_name)
            setLastName(data?.last_name)

        }

       

        const replace = strReplace('2022-06-08 03:47:15 +0000')
        const convert = convertTZ(replace, 'Asia/Singapore');

        
        console.log("CHECK DATE: ", moment(convert).calendar())
        getUserDetails();
        // getGroupMessages();
    }, [])


    function convertTZ(date, tzString) {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
    }

    function strReplace(str) {
        var newStr = str.replace(/-/g, "/");

        return newStr;
    }

    const convertDate =(str)=>{
        const replace = strReplace(str+' +0000');
        const convertedDate = convertTZ(replace, "Asia/Singapore")

        return convertedDate
    }


    const onChangeSearch = query => { setSearchQuery(query) };

    const newList = searchQuery === "" ? message : message.filter(item => { return String(item?.message).includes(searchQuery) });


    const handleSendMessage = async () => {


        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;
        
        try {

            const resp = await axios({
                method: 'post',
                url: `https://beta.centaurmd.com/api/chat/group/${roomId}`,
                data: {
                    sender_id: myID,
                    message: myMessage,
                },
                // body: JSON.stringify(payload),
                headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + tokenget, },
            });

            if (resp.status === 200) {
                console.log(resp.data);
              
                const replace = strReplace(moment(Date.now()).format("YYYY-MM-DD hh:mm:ss +9"));
                const convertedDate = convertTZ(replace , "America/Chicago")
                const fixDate = moment(convertedDate).format("YYYY-MM-DD hh:mm:ss")
                console.log("DATE: ", fixDate)
                onSendMessage(uuid.v4(), myMessage, myID, fixDate, fixDate, roomId, firstName, lastName)
                myRef.current.clear();
                setMyMessage('')
            }
        }
        catch (error) {
            console.log("Error here: ", error);
        }

      
    }

    const _keyExtractor = item => item.id;

    const renderItem = ({ item }) => {

        const sender_id = item.sender_id;

        return sender_id === myID ?
            <View style={{ flex: 1, padding: 5, flexDirection: 'column', alignItems: 'flex-end', marginBottom: 5, marginRight: 10, }}>
                <Text style={{ textAlign: 'right', maxWidth: 200, fontSize: 12 }}>{moment.utc(item?.created_at).format('LLL')}</Text>
                <Text style={styles.bubbleChatOwn}>{item?.message}</Text>
            </View>
            :
            <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-start', marginBottom: 5, }}>
                <View style={styles.othersChat}>
                    <Avatar.Text size={45} label={getInitials(item?.first_name, item?.last_name)} />
                    <View style={{ flexDirection: 'column', marginLeft: 10, alignItems: 'flex-start' }}>

                        <Text style={{ maxWidth: 300, textAlign: 'left', fontSize: 12 }}>{item?.first_name + " " + item?.last_name}, {moment.utc(item?.created_at).format('LLL')} </Text>
                        <Text style={styles.bubbleChatOthers}>{item?.message}</Text>

                    </View>
                </View>
            </View>



    }

    const getInitials = (first_name, last_name) => {

        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }

    const getItem = (data, index) => ({
        id: Math.random().toString(12).substring(0),
        title: `Item box ${index+1}`
      });

    return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <ChatAppBar title={name} type={type} first_name={first_name} last_name={last_name} roomId={roomId} />
                {loader === true ? <View style={{ height: '100%', justifyContent: 'center' }}><LoaderSmall /></View> :
                    <>
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
                                onContentSizeChange={() =>  scrollRef.current?.scrollToEnd({ animated: true })}
                            >
                                <View>
                                    {newList?.map((item, key) => {

                                      

                                        return <>

                                            {item?.sender_id === myID ?
                                                <View key={key} style={{ flex: 1, padding: 5, flexDirection: 'column', alignItems: 'flex-end', marginBottom: 5, marginRight: 10, }}>
                                                    <Text style={{ textAlign: 'right', maxWidth: 200, fontSize: 12 }}>{moment(item?.created_at).calendar()}</Text>
                                                    <Text style={styles.bubbleChatOwn}>{item?.message}</Text>
                                                </View>
                                                :
                                                <View key={key} style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-start', marginBottom: 5, }}>
                                                    <View style={styles.othersChat}>
                                                        <Avatar.Text size={45} label={getInitials(item?.first_name, item?.last_name)} />
                                                        <View style={{ flexDirection: 'column', marginLeft: 10, alignItems: 'flex-start' }}>

                                                            <Text style={{ maxWidth: 300, textAlign: 'left', fontSize: 12 }}>{item?.first_name + " " + item?.last_name}, {moment(item?.created_at).calendar()} </Text>
                                                            <Text style={styles.bubbleChatOthers}>{item?.message}</Text>

                                                        </View>
                                                    </View>
                                                </View>

                                            }

                                        </>


                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    </>
                }


                <View style={styles.textInputContainer}>
                <KeyboardAwareScrollView  keyboardShouldPersistTaps={'always'} ref={scrollRef}
                    style={{flex:1}}
                    showsVerticalScrollIndicator={false}>
                        <TextInput
                            autoFocus={false}
                            keyboardType="default"
                            returnKeyType="done"
                            enablesReturnKeyAutomatically
                            placeholder='Type a message'
                            style={{
                                
                                width: myMessage.length === 0 ? Dimensions.get('window').width - 10 : Dimensions.get('window').width - 60,

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
                            value={myMessage}
                            onChangeText={message => { setMyMessage(message) }}
                            ref={myRef}
                            multiline={true}
                        />
                    </KeyboardAwareScrollView>
                    <Icon name='send-circle' size={40} color="#3a87ad" onPress={() => handleSendMessage()} style={{ display: myMessage.length === 0 ? 'none' : 'flex', marginBottom: 12.6 }} />
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
export default GroupChatView