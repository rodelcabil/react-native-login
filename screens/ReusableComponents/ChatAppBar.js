import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Image, TextInput, Text, SafeAreaView, Button, KeyboardAvoidingView , TouchableHighlight} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
import RNRestart from 'react-native-restart'; 

const ChatAppBar = ({title, type, first_name, last_name}) => {

    const navigation = useNavigation();

    const getInitials = () => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.headerWrapper}> 
                    <View style={{flexDirection: 'row', alignItems: 'center', fontFamily: 'Roboto'}}>
                    
                        <IonIcon name="arrow-back" size={30} color="black"  onPress={()=> navigation.goBack()}/>
                        {
                            type === 'group' ? <Avatar.Icon size={35} icon="account-group"  style={styles.avatar}/>
                            :
                            <Avatar.Text size={35} label={getInitials()} style={styles.avatar}/>
                        }
                       
                        <Text style={{marginLeft: 10 , fontSize: 16, fontWeight: 'bold', color: 'black'}}>{title}</Text>
                    </View>
                    <Icon name="information" size={30} color="#3a87ad"/>
                </View>
            </SafeAreaView>
        </View>

     
    );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
       
    },
    avatar: {
        backgroundColor: '#3a87ad',
        marginLeft: 10
    },
    containerMenu:{
        width: 200,
    },
    containerMenuItem:{
        backgroundColor: '#075DA7',
        height: 160,
        resizeMode: 'contain',
        alignItems: 'center',
        padding: 20,
    },
    profileImageItem:{
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    headerWrapper:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        alignItems: 'center',
    },
    profileImage:{
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    textLogOut: {
        fontSize: 15,
        color: 'red',
    },
    textEmail: {
        paddingTop: 15,
        paddingBottom: 15,
        fontSize: 15,
        color: 'white',
    },
  
  });
  
  export default ChatAppBar;