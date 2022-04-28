import React, { useState, useRef } from 'react'
import { View, Text, TextInput, StyleSheet,FlatList, Form } from 'react-native'
import { Dimensions } from "react-native";
var width = Dimensions.get('window').width - 20;

const ChatView = ({message, onSendMessage}) => {

    const myRef = useRef();

    const handleSendMessage =(e)=> { 
        onSendMessage(e.nativeEvent.text);
        myRef.current.clear();
    }

    const renderItem = ({item}) => { 
      
        const action = item.action;
        if (action == 'message') {
            return <Text>{item.name}: {item.message}</Text>;
        }
     
    }

    return (
        <View style={styles.container}>
            <FlatList data={message}
                renderItem={renderItem}
                styles={styles.messages} />
            <TextInput autoFocus
                   keyboardType="default"
                   returnKeyType="done"
                   enablesReturnKeyAutomatically
                   placeholder='Enter Chat'
                style={styles.username}
                blurOnSubmit={false}
                onSubmitEditing={handleSendMessage}
                ref={myRef}
            />
        </View>
    )
};

const styles = StyleSheet.create({ // (5)
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center'
    },
    username: {
        position: 'absolute',
        bottom: 0,
        width: width,
        alignSelf: 'stretch',
        borderWidth: 1.5,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginVertical: 10,
        fontSize: 16,
        borderColor: '#3a87ad',
        borderRadius: 10
    },
    messages: {
        alignSelf: 'stretch',
        backgroundColor: 'green'
      },
});

export default ChatView