import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Image, Dimensions, Button, TouchableHighlight, Animated, Modal } from 'react-native'
import AppBar from '../../ReusableComponents/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Form, FormItem, Label } from 'react-native-form-component';
import * as Animatable from 'react-native-animatable';
import MultiSelect from 'react-native-multiple-select';
import { useIsFocused } from '@react-navigation/native';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Dots from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { id } from 'date-fns/locale';

const AddMembers = ({ route }) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation(); 
    const [userList, setUserList] = useState([]);
    const [userList2, setUserList2] = useState([]);
    const [membersId, setMembersId] = useState([]);
    const [addLoader, setAddLoader] = useState(false);

    const [showErrorListMember, setShowErrorListMember] = useState(false);

    useEffect(() => {
        setUserList([]);
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

                    let Users = users.filter((itemA)=> {
                        return !ids.find((itemB)=> {
                            return itemA.id === itemB;
                        })
                      })

                    const newData = [].concat(...Users);
                    setUserList(newData)
                    setUserList2(newData)
                    console.log('new arr ',Users);

            })

        }
        getUserList()
        
    }, []);

    const getInitials = (first_name, last_name) => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }

    const [selectedMember, setSelectedMember] = useState([]);

    const [selectedMemberDisplay, setSelectedMemberDisplay] = useState([]);

    const onSelectedItemsChange = (selectedItem) => {
        setSelectedMember(selectedItem);
        console.log('Members', selectedItem);
        
        let Users = userList2.filter((itemA)=> {
            return selectedItem.find((itemB)=> {
                return itemA.id === itemB;
            })
          })

        const newData2 = [].concat(...Users);
        setSelectedMemberDisplay(newData2)

        let Users2 = userList.filter((itemA)=> {
            return !selectedItem.find((itemB)=> {
                return itemA.id === itemB;
            })
          })

        const newData = [].concat(...Users2);
        setUserList(newData)

    } 

    const addMembers = async () => {
        setAddLoader(true);
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const addMemberFunction = async (groupId, memberId) => {
            const addMembers = await axios({
                method: 'post',
                url: 'https://beta.centaurmd.com/api/chat/group/add',
                data: {
                    group_id: groupId,
                    user_id: memberId
                },
                headers: { 'Accept': 'application/json','Authorization': 'Bearer ' + tokenget, },
            });

            console.log(addMembers.data);
        }
        
        for(let x = 0; x<selectedMember.length; x++){
            addMemberFunction(route.params.roomId, selectedMember[x]);
        }
        setAddLoader(false);
        setTimeout(() => {navigation.goBack();}, 1000)
    }
    

    const handleRemoveItem = (id) => {
        const newArr = [...selectedMember];
        newArr.splice(newArr.findIndex(item => item === id), 1)
        setSelectedMember(newArr)

        const newArr2 = [...selectedMemberDisplay];
        newArr2.splice(newArr2.findIndex(item => item.id === id), 1)
        setSelectedMemberDisplay(newArr2)

        let Users2 = userList2.filter((itemA)=> {
            return !newArr.find((itemB)=> {
                return itemA.id === itemB;
            })
          })

        const newData = [].concat(...Users2);
        setUserList(newData)

        console.log("Updated Memebrs", selectedMember);
        console.log("Updated Memebrs List", selectedMemberDisplay);
    }
    

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}> 
                    <Icon name="arrow-back" size={30} color="black"  onPress={()=> navigation.goBack()}/>
                    <Text style={{marginLeft: 10 , fontSize: 16, fontWeight: 'bold', color: 'black'}}>Add Member</Text>
            </View>
            <View
                style={{
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5,
                    elevation: 1
                }}
                />
            <ScrollView >

            <View style={{marginLeft: 15, marginRight: 15, flex: 1}}>

            <View style={{
                borderWidth: 2,
                borderColor: '#c7c6c5',
                padding: 8,
                borderRadius: 15,
                marginTop: 15
            }}>

            <MultiSelect
                    hideTags
                    hideSubmitButton
                    items={userList}
                    uniqueKey='id'
                    //ref={(component) => {this.multiSelect = component}}
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedMember}
                    selectText='Select People'
                    searchInputPlaceholderText='Search Name'
                    onChangeInput={(text) => console.log(text)}
                    altFontFamily='ProximaNova-Light'
                    tagRemoveIconColor='red'
                    tagBorderColor='#CCC'
                    tagTextColor='#CCC'
                    selectedItemIconColor='green'
                    selectedItemTextColor='green'
                    itemTextColor='#000'
                    displayKey='name'
                    searchInputStyle={{color: 'transparent'}}
                    submitButtonColor='blue'
                    submitButtonText='Submit'
                    styleMainWrapper={{borderColor: 'white', fontSize: 15,}}
                />
            </View>
            {showErrorListMember === true ? 
                                <Animatable.View animation='fadeInLeft' duration={500}>
                                  <Text style={styles.errorMsg}>Please select People</Text>
                                </Animatable.View>
                          :<></>}
            </View>

            <View style={{marginLeft: 15, marginRight: 15, marginBottom: 15, flex: 1}}>
            {
                selectedMemberDisplay.map((item, i) => {
                    return (
                    <View style={[styles.card, styles.shadowProp]}>
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', }} key={i}>
                        <View style={{flexDirection: 'row',  alignItems: 'center'}}  key={i} >
                            <Avatar.Text size={45} label={getInitials(item.first_name, item.last_name)} />
                            <Text style={{marginLeft: 10, fontSize: 15}}>{item.first_name +" " + item.last_name }</Text>
                        </View>
                        <TouchableHighlight
                                    activeOpacity={0.6}
                                    underlayColor="#DDDDDD"
                                    style={{alignSelf: 'center'}}
                                    onPress={() => handleRemoveItem(item.id)}
                                >
                                <Avatar.Image size={20} source={require('../../../assets/x.png')} 
                                    style={{backgroundColor: 'white', alignSelf: 'center', marginRight: 10, marginLeft: 10}} />

                            </TouchableHighlight>
                    </View>
                    </View>
                    )
                })
            }
            </View> 

            {addLoader === true? 
                          <LoaderSmall/> : 
                           <View style={{marginTop: 10, marginLeft: 20, marginRight: 20, marginBottom: 20}}>
                            <Button 
                                style={styles.buttonCont}
                                title="Submit" 
                                onPress={() => {
                                  if(selectedMember.length !== 0){
                                     addMembers();
                                  }
                                  else{
                                    if(selectedMember.length === 0){
                                       setShowErrorListMember(true)
                                    }
                                    else{
                                       setShowErrorListMember(false) 
                                    }
                                  }
                                }}
                            />
                          </View>}



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
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        width: '100%',
        marginVertical: 5,
      },
      shadowProp: {
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3
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
        marginTop: 10,
        marginLeft: 15
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

export default AddMembers