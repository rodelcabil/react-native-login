import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { set } from 'date-fns';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';

const AllChat = ({ navigation, route, clientID, filterData, loader, allChat }) => {

 
 




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
                            return item.type === 'user' ?
                                <TouchableOpacity
                                    key={i}
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        navigation.navigate('Chat Client', {
                                            user_name: item.first_name +' '+item.last_name,
                                            first_name: item.first_name,
                                            last_name: item.last_name,
                                            type: 'user'
                                        });

                                    }}
                                >
                                    <View style={styles.rowContainer}>
                                        <Avatar.Text size={45} label={getInitials(item.first_name, item.last_name)} style={styles.avatar}/>
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
                                        navigation.navigate('Chat Client',{
                                            user_name: item.name,
                                            type: 'group'
                                        });

                                    }}
                                >
                                    <View style={styles.rowContainer}>
                                        <Avatar.Icon size={45} icon="account-group" style={styles.avatar}/>
                                        <View style={styles.columnContainer}>
                                            <Text style={styles.name}>{item.name}</Text>
                                            {/* <Text style={styles.message}>{item.email_address}</Text> */}
                                        </View>
                                        {/* <Text style={styles.date}>{moment(new Date(Date.now())).format("YYYY-MM-DD")}</Text> */}
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
    columnContainer: {
        justifyContent: 'center'
    },
    name: {
        fontSize: 15,
        width: 250,
        color: 'black'
    },
    message: {
        fontSize: 13,
        maxWidth: 250,
    },
    date: {
        fontSize: 11,
    },
    avatar: {
        backgroundColor: '#3a87ad'
    }

});

export default AllChat