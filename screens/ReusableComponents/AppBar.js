import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Image, TextInput, Text, SafeAreaView, Button, KeyboardAvoidingView , TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';


const AppBar = () => {
     
    const [visible, setVisible] = useState(false);

    const hideMenu = () => setVisible(false);
  
    const showMenu = () => setVisible(true);

    const navigation = useNavigation(); 

    const logout = async() =>{
        await AsyncStorage.removeItem('token')
        navigation.navigate('LoginPage')
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.headerWrapper}>
                <Icon name="menu" size={30} color="black"/>
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
                    <MenuItem onPress={hideMenu}>View Account</MenuItem>
                    {/*<MenuItem disabled>Disabled item</MenuItem> */}
                    <MenuDivider />
                    <MenuItem onPress={logout}><Text style={styles.textLogOut}>Log Out</Text></MenuItem>
                </Menu>
                </View>
            </SafeAreaView>
        </View>

     
    );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'fff',
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