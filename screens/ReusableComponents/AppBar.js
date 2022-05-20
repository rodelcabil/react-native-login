import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Image, TextInput, Text, SafeAreaView, Button, KeyboardAvoidingView , TouchableHighlight} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
import RNRestart from 'react-native-restart'; 

const AppBar = ({title, showMenuIcon}) => {
    const [visible, setVisible] = useState(false);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);

    const navigation = useNavigation(); 

    const logout = async() =>{
        await AsyncStorage.removeItem('token')
        signOut();
        navigation.replace('LoginPage')
    }

    const signOut = async () => {
        try{
          await AsyncStorage.removeItem('token')
          await AsyncStorage.removeItem('userDetails');
          const isSignedIn = await GoogleSignin.isSignedIn();
          if(!isSignedIn){
            RNRestart.Restart();
          }
          else{
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            RNRestart.Restart();
          }
        }
        catch(error){
          console.log('Error', error);
        }
      }

    getUserInfo = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log(token, "token");
        await fetch('https://beta.centaurmd.com/api/user-info', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        }).then(res => res.json())
        .then(resData => {
            console.log(resData);
        });
    };


    getSchedule = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log(token, "token");
        await fetch('https://beta.centaurmd.com/api/schedules', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        }).then(res => res.json())
        .then(resData => {
            console.log(resData);
        });
    };


    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.headerWrapper}> 
                <View style={{flexDirection: 'row', alignItems: 'center', fontFamily: 'Roboto'}}>
                    <Icon name="arrow-back" size={30} color="black" style={{display: showMenuIcon === true? 'flex' : 'none'}} onPress={()=> navigation.goBack()}/>
                    <Text style={{marginLeft: showMenuIcon === true? 10 : 0 , fontSize: 16, color: 'black'}}>{title}</Text>
                </View>
              
                <Menu
                    style={styles.containerMenu}
                    visible={visible}
                    anchor={
                    <TouchableHighlight onPress={showMenu}>
                        <Image
                            style={styles.profileImage}
                            source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/194/194915.png',
                            }}
                        />
                    </TouchableHighlight>
                    }
                    onRequestClose={hideMenu}
                >
                    <View style={styles.containerMenuItem}>
                        <Image
                            style={styles.profileImageItem}
                            source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/194/194915.png',
                            }}
                        />
                        <Text style={styles.textEmail}>Dr. Sample Name</Text>
                    </View>
                    <MenuItem onPress={hideMenu}>View Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={signOut}><Text style={styles.textLogOut}>Log Out</Text></MenuItem>
                </Menu>
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
    containerMenu:{
        width: 200,
    },
    containerMenuItem:{
        backgroundColor: '#075DA7',
        height: 150,
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
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
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15,
        color: 'white',
    },
  
  });
  
  export default AppBar;