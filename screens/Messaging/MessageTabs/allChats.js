import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { set } from 'date-fns';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';

const AllChat = ({ navigation, filterData, loader, allChat, lastMessage, userList, myID}) => {
    console.log(allChat);
    const getInitials = (first_name, last_name) => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }

    const newList = filterData === "" ? allChat : allChat?.filter(item => { return String(item.name.toUpperCase()).includes(filterData.toUpperCase()) });

    return (
        loader === true ? <View style={{ height: '100%', justifyContent: 'center' }}><LoaderSmall /></View> :
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.body}>
                        {newList.map((item, i) => {
                            const getIDMap = item.id;
                            const getLastMessageDetails = item.last_message !== null ? item.last_message : null;

                            return item.type === 'user' ?
                                <TouchableOpacity
                                    key={i}
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        navigation.navigate('Single Chat Client', {
                                            user_name: item.first_name + ' ' + item.last_name,
                                            first_name: item.first_name,
                                            last_name: item.last_name,
                                            id: item.id,
                                            type: 'user'
                                        });

                                    }}
                                >
                                    <View style={styles.rowContainer}>
                                        <Avatar.Text size={45} label={getInitials(item.first_name, item.last_name)} style={styles.avatar} />
                                        <View style={styles.columnContainer}>
                                            <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                                            <Text style={styles.message}>{item.email_address}</Text>
                                        </View>
                                        {/* <Text style={styles.date}>{moment(new Date(Date.now())).format("YYYY-MM-DD")}</Text> */}
                                        <View style={{ width: 50 }} />
                                    </View>
                                </TouchableOpacity>

                                :

                                <TouchableOpacity
                                    key={i}
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        navigation.navigate('Chat Client', {
                                            user_name: item.group.name,
                                            roomId: item.group.id,
                                            type: 'group'
                                        });

                                    }}
                                >
                                    <View style={styles.rowContainer}>
                                        <Avatar.Icon size={45} icon="account-group" style={styles.avatar} />
                                        <View style={styles.messageDetails}>
                                            <View style={styles.columnContainer}>
                                                <Text style={styles.name}>{item.group.name}</Text>
                                                <Text style={styles.message} numberOfLines={1} ellipsizeMode='tail'>{item.last_message !== null ?
                                                myID === item.last_message.sender_id ? "You: " + item.last_message.message :
                                                userList.filter(function (item) {
                                                    return item.id === getLastMessageDetails.sender_id;
                                                }).map(function ({ first_name, last_name }) {
                                                    return first_name + " " + last_name + ": " + getLastMessageDetails.message
                                                }) :  "No message yet. Start Conversation" }</Text>

                                            </View>
                                            <View>
                                                
                                             {/**
                                            {lastMessage.filter(function (item) {
                                                return item.groupID == getIDMap;
                                            }).map(function ({ date }) {
                                                return <Text style={styles.date}>{moment(date).format('L')}</Text>
                                            })}
                                              */}   
                                            </View>


                                        </View>
                                        <View style={{ width: 50 }} />
                                    </View>
                                </TouchableOpacity>
                        })}

                    </View>

                </ScrollView>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        flex: 1,
        padding: 10,
        // backgroundColor: 'orange'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10
    },
    messageDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10


    },
    columnContainer: {
        justifyContent: 'center'
    },
    name: {
        fontSize: 15,
        width: 250,
        color: 'black'
    },
    message: {
        fontSize: 14,
        maxWidth: 250,
    },
    date: {
        fontSize: 13,
        marginRight: 100
    },
    avatar: {
        backgroundColor: '#3a87ad'
    }

});

export default AllChat