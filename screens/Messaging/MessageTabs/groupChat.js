import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Image, Dimensions } from 'react-native'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GroupChat = ({ navigation, route, filterData, loader, groupList, myID, userList }) => {
    const newList = filterData === "" ? groupList : groupList.filter(item => { return String(item.name.toUpperCase()).includes(filterData.toUpperCase()) });

    return (
        loader === true ? <View style={{ height: '100%', justifyContent: 'center' }}><LoaderSmall /></View> :
            <View style={styles.container}>
                <ScrollView >
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

                                console.log(diffDuration.days() , "DIFF");
                                
                                if (diffDuration.days() >= 7) {
                                    return `${dateget}`;
                                } 
                                else if (diffDuration.days()  > 0) {
                                  return `${diffDuration.days() } day(s) ago`;
                                } else if (diffDuration.hours()  > 0) {
                                  return `${diffDuration.hours()} hour(s) ago`;
                                } else if (diffDuration.minutes()  > 0) {
                                  return `${diffDuration.minutes()} minute(s) ago`;
                                } else if (diffDuration.seconds()  > 0) {
                                  return `${diffDuration.seconds()} second(s) ago`;
                                } else {
                                  return 'just now';
                                }
                              }

                            return <TouchableOpacity
                                key={i}
                                activeOpacity={0.6}
                                onPress={() => {
                                    console.log(item);
                                    navigation.navigate('Chat Client', {
                                        user_name: item.group.name,
                                        type: 'group',
                                        roomId: item.group.id,
                                        userID: myID,
                                        groupName: item.group.name
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
                                                    }) : "No message yet. Start Conversation"}</Text>

                                            </View>
                                            <Text style={item.last_message !== null ? styles.date : styles.dateHide}>{item.last_message !== null ? convertToAgoChatScreen(moment(getLastMessageDetails.created_at))  : 
                                              moment(Date.now()).format('L') }</Text>
                                    </View>

                                    <View style={{ width: 50 }} />
                                </View>
                            </TouchableOpacity>
                        })}
                    </View>

                </ScrollView>
                <TouchableOpacity activeOpacity={0.5}
                    onPress={() => {
                        navigation.navigate('Add Group', {
                            route: route,
                            userID: userID,
                        });
                    }}>
                    <Avatar.Icon
                        size={55}
                        style={styles.fab}
                        icon={() => <Icon name='group-add' size={30} color="#fff" />}


                    />
                </TouchableOpacity>

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
    },
    dateHide: {
        fontSize: 13,
        color: 'white'
    },
    buttonGPlusStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a87ad',
        borderWidth: 0.5,
        borderColor: 'gray',
        height: 40,
        borderRadius: 5,
        margin: 5,
        justifyContent: 'center',
    },
    buttonImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 30,
        width: 30,
        resizeMode: 'stretch',
    },
    buttonTextStyle: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        padding: 0,
        borderColor: '#fff',
        borderWidth: 2,
        backgroundColor: '#3a87ad',
        shadowColor: 'black',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    avatar: {
        backgroundColor: '#3a87ad'
    }
});

export default GroupChat


