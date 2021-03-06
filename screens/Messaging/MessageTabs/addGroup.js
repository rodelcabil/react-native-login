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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'

const AddGroup = ({ route, userID}) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation(); 
    const [userList, setUserList] = useState([]);
    const [userList2, setUserList2] = useState([]);
    const [title, setTitle] = useState("");
    const [addLoader, setAddLoader] = useState(false);

    const [showErrorTitle, setShowErrorTitle] = useState(false);
    const [showErrorListMember, setShowErrorListMember] = useState(false);

    const [creator, setCreator] = useState([]);

    const [userList3, setUserList3] = useState([]);

    useEffect(() => {
        console.log("ID ",userID);
        const getUserList = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;
            const userList = [];
            const userListNew = [];
            await axios.get(
                `https://beta.centaurmd.com/api/users/2`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                     response.data.map((data, index) => {
                        const id = data.id
                        const name = data.first_name + " " + data.last_name
                        const avatar = data.avatar
                        const first_name = data.first_name;
                        const last_name = data.last_name;
                        if(id !== route.params.userID){
                            userList.push({
                                id: id,
                                name: name,
                                avatar: avatar,
                                last_name: last_name,
                                first_name: first_name,
                            });
                            userListNew.push({
                                id: id,
                                item: first_name + " " + last_name,
                            });
                        }
                        else{
                           /* selectedMemberDisplay.push({
                                id: id,
                                name: name,
                                avatar: avatar,
                                last_name: last_name,
                                first_name: first_name,
                            })*/
                            creator.push({
                                id: id,
                                name: name,
                                avatar: avatar,
                                last_name: last_name,
                                first_name: first_name,
                            })
                        }
                    });
                    setUserList(userList)
                    setUserList2(userList);
                    setUserList3(userListNew)
                })
                console.log("USER LIST: ", userList)
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

    const addGroup = async () => {
        setAddLoader(true);
        selectedMember.push(route.params.userID)
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
            if(resp.data.status === "failed"){
                setAddLoader(false);
                alert(resp.data.message)
            }
            else{
            //alert("Added Successfully");
            let groupID = '';
            await axios.get(
                `https://beta.centaurmd.com/api/chat/client-group`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                    console.log(response.data)
                    response.data.map((data, index) => {
                        const id = data.group.id
                        if(data.group.name === title){
                            groupID = id
                            console.log(id, "success get id");
                        }
                    });

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
                        if (resp.status === 200) {
                            console.log('Member ', memberId , " added");
                        }
                        else{
                            alert("Error, Adding Members");
                        }
                    }
                    
                    for(let x = 0; x<selectedMember.length; x++){
                        addMemberFunction(groupID, selectedMember[x]);
                    }
                    setAddLoader(false);
                    setVisibleAdd(true);
                    setTimeout(() => {navigation.goBack();}, 1000)
                })

         }} else {
         alert("Error, please try again");
       }
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

    const [visibleAdd, setVisibleAdd] = useState(false);

    const ModalPoup = ({visible, children}) => {
        const [showModalAdd, setShowModalAdd] = React.useState(visible);
        const scaleValue = React.useRef(new Animated.Value(0)).current;
        React.useEffect(() => {
          toggleModal();
        }, [visible]);
        const toggleModal = () => {
          if (visible) {
            setShowModalAdd(true);
            Animated.spring(scaleValue, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }).start();
          } else {
            setTimeout(() => setShowModalAdd(false), 200);
            Animated.timing(scaleValue, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }).start();
          }
        };
        return (
          <Modal transparent visible={showModalAdd}>
            <View style={styles.modalBackGround}>
              <Animated.View
                style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
                {children}
              </Animated.View>
            </View>
          </Modal>
        );
    };

    const DialogBox = () =>{
      return(
          <ModalPoup visible={visibleAdd}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/sucess.png')}
              style={{height: 120, width: 120, marginVertical: 10}}
            />
          </View>
  
          <Text style={{marginBottom: 20, fontSize: 20, color: 'black', textAlign: 'center'}}>
             Group Created Successfully
          </Text>
        </ModalPoup>
      );
  }

  const [selectedMem, setSelectedMem] = useState([])
  
    function onMultiChange() {
        return (item) => setSelectedMem(xorBy(selectedMem, [item], 'id'))
    }


    return (
        <View style={styles.container}>
            <DialogBox/>   
            <AppBar title={""} showMenuIcon={true} />
            <ScrollView >
            <View style={styles.header}>
                <Avatar.Image size={50} source={require('../../../assets/addgroup.png')} 
                     style={{backgroundColor: 'white', marginRight: 10}} />
                <Text style={styles.headerText}>Add Group</Text>
            </View>

            <View style={{flexDirection: 'row',  marginLeft: 25, marginTop: 10}}>
                      <Text style={{fontSize: 15, color: 'black'}}>All fields marked with </Text>
                      <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                      <Text style={{fontSize: 15,  color: 'black'}}> are required.</Text>
            </View>

            <View style={styles.formContainer}>

                <View style={[styles.card, styles.shadowProp]}>
                    <View style={{flexDirection: 'row'}}>
                          <Text style={styles.formText}>Group Name</Text>
                          <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                    </View>
                    {showErrorTitle === true ? 
                                    <Animatable.View animation='fadeInLeft' duration={500}>
                                    <Text style={styles.errorMsg}>Please enter Group Name</Text>
                                    </Animatable.View>
                            :<></>}

                            <FormItem
                                value={title}
                                placeholder='Enter Group Name'
                                style={styles.inputContainer}
                                onChangeText={titleInp => setTitle(titleInp)}
                                asterik />


                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                          <Text style={styles.formText}>Creator</Text>
                    </View>
                    
                    {
                        creator.length === 0? <></> :
                        <View style={{flexDirection: 'row', marginBottom: 15, alignItems: 'center'}}>
                            <Avatar.Text size={35} label={getInitials(creator[0].first_name, creator[0].last_name)} />
                            <Text style={{marginLeft: 10, fontSize: 15}}>{creator[0].first_name + "  " + creator[0].last_name}</Text>
                        </View>
                    }


                    <View style={{flexDirection: 'row'}}>
                          <Text style={styles.formText}>Members</Text>
                          <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                    </View>

                    <View style={{marginTop: 10,}}>
                        <ScrollView>
                        {selectedMemberDisplay.map((item, i) => {
                           return <View  key={i}  style={{flexDirection: 'row', marginBottom: 8, justifyContent: 'space-between'}}>
                               <View style={{flexDirection: 'row', marginBottom: 8, alignItems: 'center'}}>
                                <Avatar.Text size={35} label={getInitials(item.first_name, item.last_name)} />
                                <Text style={{marginLeft: 10, fontSize: 15}}>{item.id === route.params.userID ? item.name + " ( Creator )" : item.name }</Text>
                            </View>
                            
                            {item.id === route.params.userID ? <></> :
                            <TouchableHighlight
                                    activeOpacity={0.6}
                                    underlayColor="#DDDDDD"
                                    style={{alignSelf: 'center'}}
                                    onPress={() => handleRemoveItem(item.id)}
                                >
                                <Avatar.Image size={15} source={require('../../../assets/x.png')} 
                                    style={{backgroundColor: 'white', alignSelf: 'center', marginRight: 10, marginLeft: 10}} />

                            </TouchableHighlight>

                            }


                           </View>
                        })}
                        </ScrollView>
                    </View>
                    
                {showErrorListMember === true ? 
                                <Animatable.View animation='fadeInLeft' duration={500}>
                                  <Text style={styles.errorMsg}>Please select Group Members</Text>
                                </Animatable.View>
                          :<></>}
               
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
                    tagTextColor='black'
                    selectedItemIconColor='green'
                    selectedItemTextColor='green'
                    itemTextColor='#000'
                    displayKey='name'
                    searchInputStyle={{color: 'black'}}
                    submitButtonColor='blue'
                    submitButtonText='Submit'
                />

                     {/* <SelectBox
                        width= '100%'
                        labelStyle={{fontSize: 0, color: 'transparent'}}
                        inputFilterStyle={{fontSize: 15}}
                        options={userList3}
                        selectedValues={selectedMem}
                        onMultiSelect={onMultiChange()}
                        onTapClose={onMultiChange()}
                        multiOptionContainerStyle={{backgroundColor: '#075DA7'}}
                        multiOptionsLabelStyle={{fontSize: 15}}
                        arrowIconColor='gray'
                        searchIconColor='gray'
                        toggleIconColor='#075DA7'
                        isMulti
                    />*/}
                    {addLoader === true? 
                          <LoaderSmall/> : 
                           <View style={{marginTop: 20}}>
                            <Button 
                                style={styles.buttonCont}
                                title="Submit" 
                                onPress={() => {
                                  if(title !== "" && selectedMember.length !== 0){
                                     setShowErrorTitle(false) 
                                     setShowErrorListMember(false) 
                                     addGroup();
                                  }
                                  else{
                                    if(title === ""){
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
        paddingTop: 15,
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

export default AddGroup