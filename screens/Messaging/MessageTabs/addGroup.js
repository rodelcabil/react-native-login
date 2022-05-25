import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Image, Dimensions, Button } from 'react-native'
import AppBar from '../../ReusableComponents/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Form, FormItem, Label } from 'react-native-form-component';
import * as Animatable from 'react-native-animatable';
import MultiSelect from 'react-native-multiple-select';
import { useIsFocused } from '@react-navigation/native';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import { Avatar } from 'react-native-paper';

const AddGroup = ({ route }) => {
    const isFocused = useIsFocused();
    const [userList, setUserList] = useState([]);
    const [title, setTitle] = useState(null);
    const [addLoader, setAddLoader] = useState(false);

    const [showErrorTitle, setShowErrorTitle] = useState(false);
    const [showErrorListMember, setShowErrorListMember] = useState(false);

    useEffect(() => {
        const getUserList = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;
            const userDetails = [];
            await axios.get(
                `https://beta.centaurmd.com/api/users/2`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    const mappedData = response.data.map((data, index) => {
                        const id = data.id
                        const name = data.first_name + " " + data.last_name
                        const avatar = data.avatar
                        const first_name = data.first_name;
                        const last_name = data.last_name;
                        return {
                            id: id,
                            name: name,
                            avatar: avatar,
                            last_name: last_name,
                            first_name: first_name,

                        };
                    });
                    setUserList(mappedData)
                })
                console.log("USER LIST: ", userDetails)
        }
        getUserList()
    }, [isFocused]);

    const getInitials = (first_name, last_name) => {
        return first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }

    const [selectedMember, setSelectedMember] = useState([]);

    const [selectedMemberDisplay, setSelectedMemberDisplay] = useState([]);

    const onSelectedItemsChange = (selectedItem) => {
        setSelectedMember(selectedItem);
        console.log('Members', selectedItem);
        const newArr = [];
        for(let x = 0; x<=selectedItem.length; x++){
            const add = userList.filter(item => { return item.id === selectedItem[x] });
            newArr.push(add)
        }
        const newData = [].concat(...newArr);
        setSelectedMemberDisplay(newData);
        console.log(newData);
    } 

    const addGroup = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;
        console.log(title, tokenget);
        const resp = await axios({
            method: 'post',
            url: 'https://beta.centaurmd.com/api/chat/group/create',
            data: {
                group_name: title
            },
            headers: { 'Accept': 'application/json','Authorization': 'Bearer ' + tokenget, },
        });

          console.log(resp.data);

         if (resp.status === 200) {
            alert("Added Successfully");
       } else {
         alert("Error, please try again");
       }
    }

    return (
        <View style={styles.container}>
            <AppBar title={""} showMenuIcon={true} />
            <ScrollView >
            <View style={styles.header}><Text style={styles.headerText}>Add Group</Text></View>

            <View style={styles.formContainer}>
                <Text style={styles.formText}>Group Name</Text>

                {showErrorTitle === true ? 
                                <Animatable.View animation='fadeInLeft' duration={500}>
                                  <Text style={styles.errorMsg}>Please enter Group Name</Text>
                                </Animatable.View>
                          :<></>}

                        <FormItem
                            value={title}
                            style={styles.inputContainer}
                            onChangeText={titleInp => setTitle(titleInp)}
                            asterik />

                <Text style={styles.formText}>Members</Text>


                {showErrorListMember === true ? 
                                <Animatable.View animation='fadeInLeft' duration={500}>
                                  <Text style={styles.errorMsg}>Please select Group Members</Text>
                                </Animatable.View>
                          :<></>}
                <MultiSelect
                    hideTags
                    items={userList}
                    uniqueKey='id'
                    //ref={(component) => {this.multiSelect = component}}
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedMember}
                    selectText='Select Member'
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
                    searchInputStyle={{color: '#CCC'}}
                    submitButtonColor='blue'
                    submitButtonText='Submit'

                />

                    <View style={{flex: 1, height: 300,}}>
                        {selectedMemberDisplay.map((item, i) => {
                           return <View key={i} style={{flexDirection: 'row', marginBottom: 8, alignItems: 'center'}}>
                                <Avatar.Text size={45} label={getInitials(item.first_name, item.last_name)} />
                                <Text style={{marginLeft: 10, fontSize: 15}}>{item.name}</Text>
                            </View>
                        })}
                    </View>


                    {addLoader === true? 
                          <LoaderSmall/> : 
                           <View style={{marginTop: 10}}>
                            <Button 
                                style={styles.buttonCont}
                                title="Submit" 
                                onPress={() => {
                                  if(title !== null && selectedMember.length !== 0){
                                     setShowErrorTitle(false) 
                                     setShowErrorListMember(false) 
                                     addGroup();
                                  }
                                  else{
                                    if(title === null){
                                       setShowErrorTitle(true)
                                    }
                                    else{
                                       setShowErrorTitle(false) 
                                    }
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
    header:{
        width: Dimensions.get('window').width,
        //backgroundColor: '#3a87ad',
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 10,
    },
    formText:{
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5
    },
    formContainer: {
        alignSelf: 'center',
        padding: 15,
        width: Dimensions.get('window').width-30,
        //backgroundColor: '#3a87ad',
    },
    headerText:{
        fontSize: 25,
        fontWeight: 'bold',
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
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 5,
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

});

export default AddGroup