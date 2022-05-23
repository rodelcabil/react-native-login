import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AllChat = ({ navigation, route, id }) => {

    const [userList, setUserList] = useState([]);
    useEffect(() => {
        const getUserList = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/users/${id}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    setUserList(response.data)

                    console.log("USER LIST: ", response.data)
                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
        
        }
        getUserList()
    }, []);
    const getInitials = (first_name, last_name) => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }



    return (
        <View style={styles.container}>
           <Text>All Chats</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
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

});

export default AllChat