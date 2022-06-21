import React, { useEffect, useState, useTransition } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import { useNavigation } from '@react-navigation/native';
import EntypoIcon from 'react-native-vector-icons/Entypo';


const Colleagues = ({ navigation, filterData, loader, userList, userID, clientID }) => {
    // const navigation = useNavigation();

    const getInitials = (first_name, last_name) => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }

    const newList = filterData === "" ? userList : userList.filter(item => { return String(item.name.toUpperCase()).includes(filterData.toUpperCase()) });

    return (
        loader === true ? <View style={{ height: '100%', justifyContent: 'center' }}><LoaderSmall /></View> :
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.body}>
                        {newList.map((item, i) => {
                            return <TouchableOpacity
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
                        })}

                    </View>

                </ScrollView>
                <TouchableOpacity activeOpacity={0.5}
                    onPress={() => {
                        navigation.navigate('New Message',{
                            userID: userID,
                            clientID: clientID
                        });
                    }}>
                    <Avatar.Icon
                        size={55}
                        style={styles.fab}
                        icon={() => <EntypoIcon name='new-message' size={25} color="#fff" />}


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

});

export default Colleagues