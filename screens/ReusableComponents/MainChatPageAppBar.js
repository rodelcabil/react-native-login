import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, SafeAreaView, Dimensions, TouchableHighlight, Image } from 'react-native'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'

const MainChatPageAppBar = ({ searchQuery, onChangeSearch }) => {

    const [searchBG, setSearchBG] = useState('#fff');
    const [visible, setVisible] = useState(false);
    const [firstName, setFirstName] = useState("")
    const [diplayName, setDiplayName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [email, setEmail] = useState(null)
    const [userName, setUserName] = useState(null)

    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);

    const navigation = useNavigation(); 

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

  
    useEffect(() => {
        const getUserDetails = async () => { 
            const value = await AsyncStorage.getItem('userDetails')
            const data = JSON.parse(value)
            setFirstName(data?.first_name)
            setDiplayName(data?.name)
            setLastName(data?.last_name)
            setEmail(data?.email_address)
            setUserName(data?.username)
            // console.log("ACCOUNT - USER DETAILS: ", userDetails)
        }
        getUserDetails();
        
        
    },[])
    const getInitials = (first_name, last_name) => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }

    return (
        <SafeAreaView >
            <View style={styles.headerWrapper}>
                <Searchbar
                    style={{ width: Dimensions.get('window').width - 80, shadowOpacity: 0, elevation: 0, backgroundColor: searchBG, color: "white", borderRadius: 100 }}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    inputStyle={{ fontSize: 15 }}
                    onFocus={() => {
                        setSearchBG('#e3e3e3')
                    }}
                    onBlur={() => {
                        setSearchBG('#fff')
                    }}
                />

                <Menu
                    style={styles.containerMenu}
                    visible={visible}
                    anchor={
                        <TouchableHighlight onPress={showMenu}>
                            <Avatar.Text size={35} label={getInitials(firstName, lastName)} style={styles.avatar} />
                        </TouchableHighlight>
                    }
                    onRequestClose={hideMenu}
                >
                    <View style={styles.containerMenuItem}>
                        <Avatar.Text size={100} label={getInitials(firstName, lastName)} style={styles.avatar} />
                        <Text style={styles.textEmail}>{firstName} {lastName}</Text>
                    </View>
                    <MenuItem onPress={hideMenu}>View Profile</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={signOut}><Text style={styles.textLogOut}>Log Out</Text></MenuItem>
                </Menu>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    textLogOut: {
        fontSize: 15,
        color: 'red',
    },
    textEmail: {
        fontSize: 18,
        color: 'white',
    },
    containerMenu: {
        width: 200,
    },
    containerMenuItem: {
        backgroundColor: '#075DA7',
        height: 150,
        resizeMode: 'contain',
        alignItems: 'center',
        padding: 20,
    },
    profileImageItem: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatar: {
        backgroundColor: '#3a87ad'
    }
})

export default MainChatPageAppBar