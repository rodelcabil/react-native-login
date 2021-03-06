import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Dimensions } from 'react-native'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { set } from 'date-fns';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';

const AllChat = ({ navigation, filterData, loader, allChat, lastMessage, userList, myID}) => {
    
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

                            const convertToAgoChatScreen = (input) => {
                                const dateget = moment(input).format("YYYY-MM-DD");
                                function convertTZ(date, tzString) {
                                    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
                                }
                            
                                function strReplace(str) {
                                    var newStr = str.replace(/-/g, "/");
                            
                                    return newStr;
                                }
                                
                                const replace = strReplace(moment(Date.now()).format("YYYY-MM-DD hh:mm:ss +9"));
                                const convertedDate = convertTZ(replace, "America/Chicago")
                                const now = moment(convertedDate).format("YYYY-MM-DD hh:mm:ss")
                                const diff=  moment(now).diff(input); 
                                let diffDuration = moment.duration(diff);

                               {/* console.log(diffDuration.days() , "DIFF");  */}
                                if (diffDuration.days() >= 7) {
                                    return `${dateget}`;
                                } 
                                else if (diffDuration.days()  > 0) {
                                  return `${diffDuration.days() } day(s) ago`;
                                }else if (diffDuration.hours()  > 0) {
                                  return `${diffDuration.hours()} hour(s) ago`;
                                } else if (diffDuration.minutes()  > 0) {
                                  return `${diffDuration.minutes()} minute(s) ago`;
                                } else if (diffDuration.seconds()  > 0) {
                                  return `${diffDuration.seconds()} second(s) ago`;
                                } else {
                                  return 'just now';
                                }
                              }

                              

                            return item.type === 'user' ?
                                <TouchableOpacity
                                    key={i}
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        navigation.navigate('Single Chat Client', {
                                            user_name: item.user.first_name + ' ' + item.user.last_name,
                                            first_name: item.user.first_name,
                                            last_name: item.user.last_name,
                                            id: item.user.id,
                                            type: 'user'
                                        });

                                    }}
                                >
                                    <View style={styles.rowContainer}>
                                        <Avatar.Text size={45} label={getInitials(item.user.first_name, item.user.last_name)} style={styles.avatar} />
                                        <View style={styles.columnContainer}>
                                            <Text style={styles.name}>{item.user.first_name} {item.user.last_name}</Text>
                                            <Text style={styles.message}>{item.message}</Text>
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
                                            <Text style={styles.date}>{item.last_message !== null ?  convertToAgoChatScreen(moment(getLastMessageDetails.created_at)) : ""}</Text>
                                            <View>
                                                
                                            <Text style={styles.date}>{moment(item.created_at).format('L')}</Text>
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
        width: Dimensions.get('window').width,
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
        marginRight: 10,
        alignItems: 'center'
        

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