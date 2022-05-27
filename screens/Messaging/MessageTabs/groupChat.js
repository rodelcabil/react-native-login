import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Image, Dimensions } from 'react-native'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GroupChat = ({ navigation, route, filterData, loader, groupList }) => {


    const newList = filterData === "" ? groupList : groupList.filter(item => { return String(item.name.toUpperCase()).includes(filterData.toUpperCase()) });

    return (
        loader === true ? <View style={{ height: '100%', justifyContent: 'center' }}><LoaderSmall /></View> :


            <View style={styles.container}>
                <ScrollView >
                    <View style={styles.body}>
                        {newList.map((item, i) => {

                            return <TouchableOpacity
                                key={i}
                                activeOpacity={0.6}
                                onPress={() => {
                                    console.log(item);
                                    navigation.navigate('Chat Client',{
                                        user_name: item.name,
                                        type: 'group',
                                        roomId: item.id,
                                    });

                                }}
                            >
                                <View style={styles.rowContainer}>
                                    <Avatar.Icon size={45} icon="account-group"  style={styles.avatar}/>
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
                <TouchableOpacity activeOpacity={0.5}
                    onPress={() => {
                        navigation.navigate('Add Group', {
                            route: route,
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


