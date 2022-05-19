import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import AppBar from '../ReusableComponents/AppBar'
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import { sr } from 'date-fns/locale';
import ChatClientClass from './ChatClientClass';

const ChatList = ({navigation}) => {
    return (
        <View style={styles.container}>
            <AppBar title={"Messages"} showMenuIcon={false} />
            <ScrollView>
                <View style={styles.body}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={()=>{ 
                            navigation.navigate('Chat Client');
                        }}
                    >
                        <View style={styles.rowContainer}>
                            <Avatar.Text size={45} label="SN" />
                            <View style={styles.columnContainer}>
                                <Text style={styles.name}>Sample Name</Text>
                                <Text style={styles.message}>Sample Chats</Text>
                            </View>
                            <Text style={styles.date}>{moment(new Date(Date.now())).format("YYYY-MM-DD")}</Text>
                        </View>
                    </TouchableOpacity>

                   
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

});
export default ChatList