import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Image, Dimensions, Button, TouchableHighlight, Animated, Modal } from 'react-native'
import AppBar from '../../ReusableComponents/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Form, FormItem, Label } from 'react-native-form-component';
import * as Animatable from 'react-native-animatable';
import MultiSelect from 'react-native-multiple-select';
import { useIsFocused } from '@react-navigation/native';
import LoaderSmall from '../../ReusableComponents/LottieLoader-FullScreen';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Dots from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { id } from 'date-fns/locale';

const ChatSetting = ({ route }) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation(); 
    const [userList, setUserList] = useState([]);
    const [membersId, setMembersId] = useState([]);
    const [loader, setAddLoader] = useState(true);

    useEffect(() => {
        const getUserList = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            const users = [];
            const ids = []; 

            await axios.get(
                `https://beta.centaurmd.com/api/chat/client-group-user?group_id=${route.params.roomId}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                    response.data.map((data) =>{
                        ids.push(data.user_id)
                    })
                    console.log("data ids ", ids);
                    setMembersId(ids);
            })

            await axios.get(
                `https://beta.centaurmd.com/api/users/2`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                    response.data.map((data) => {
                        users.push({
                            name: data.first_name + " " + data.last_name,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            avatar: data.avatar,
                            email_address: data.email_address,
                            id: data.id
                        })
                    });
                    console.log("data details ", users);

                    const newArr = [];
                    for(let x = 0; x<=ids.length; x++){
                        const add = users.filter(item => { return item.id === ids[x] });
                        newArr.push(add)
                    }
                    const newData = [].concat(...newArr);
                    setUserList(newData)
                    console.log('new arr ',newArr);

            })

        }
        getUserList()
        
    }, [isFocused]);

    const getInitials = (first_name, last_name) => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }

    const [visible, setVisible] = useState(false);
    const hideMenu = () => setVisible(false);
    const showMenu = () => setVisible(true);


    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}> 
                    <Icon name="arrow-back" size={30} color="black"  onPress={()=> navigation.goBack()}/>
                    <Menu
                        style={styles.containerMenu}
                        visible={visible}
                        anchor={
                          <Dots name="dots-three-vertical" size={22} color="black"  onPress={showMenu}/>
                        }
                        onRequestClose={hideMenu}
                    >
                    <MenuItem onPress={hideMenu}>Add Member</MenuItem>
                    <MenuDivider />
                    </Menu>
            </View>
            
            <View style={{width: Dimensions.get('window').width, backgroundColor: '#e8e8e8', alignItems: 'center', padding: 30}}>
                <Avatar.Icon size={100} icon="account-group" style={styles.avatar}/>
                <Text style={{marginTop: 10, fontSize: 20, color: 'black', textAlign: 'center', fontWeight: 'bold'}}>
                    {route.params.user_name}
                </Text>
            </View>
            <ScrollView >
            <Text style={{marginTop: 15, marginLeft: 15, fontSize: 18, color: 'black',}}>
                Members
            </Text>

            <View style={{margin: 15, flex: 1}}>
            {loader !== true ? <View style={{ height: '100%', justifyContent: 'center' }}><LoaderSmall /></View> :
                   userList.map((item, i) => {
                                return (
                                <View style={{flex:1}}>
                                <View style={{flexDirection: 'row', marginBottom: 8, alignItems: 'center'}}  key={i} >
                                    <Avatar.Text size={45} label={getInitials(item.first_name, item.last_name)} />
                                    <Text style={{marginLeft: 10, fontSize: 15}}>{item.first_name +" " + item.last_name }</Text>
                                </View>
                                </View>
                                )
                    })
                }
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
    headerWrapper:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    header:{
        width: Dimensions.get('window').width,
        //backgroundColor: '#3a87ad',
        paddingTop: 25,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    card: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        width: '100%',
        marginVertical: 10,
      },
      shadowProp: {
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8
      },
    formText:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Poppins-Bold'
    },
    formContainer: {
        alignSelf: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        width: Dimensions.get('window').width-10,
        //backgroundColor: '#3a87ad',
    },
    headerText:{
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
        //color: '#3a87ad',
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
    inputContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        alignItems: 'center',
        fontSize: 13,
        backgroundColor: 'white',
    },
    errorMsg: {
        color: 'red',
        fontSize: 13,
        marginBottom: 10,
    },
    buttonCont: {
        marginHorizontal: 5,
        marginTop: 10,
        backgroundColor: 'green'
    },
    modalBackGround: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        width: '70%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20,
      },

});

export default ChatSetting