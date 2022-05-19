/* eslint-disable prettier/prettier */
import React, { useState, useEffect, memo  } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, SafeAreaView, TouchableOpacity, Modal, Button, ScrollView, Animated, Flatlist } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import { showNotification, handleScheduleNotification, handleCancel } from '../../ReusableComponents/notification.android'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { Dimensions } from "react-native";
import DoubleClick from 'react-native-double-tap';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
import axios from 'axios';
import SkeletonLoaderCard from '../../ReusableComponents/SkeletonLoader'
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

var width = Dimensions.get('window').width - 20;

export function Calendar ({ navigation, route }) {

    const isFocused = useIsFocused();
    const [checkSignIn, setCheckSignIn] = useState(false);

    const [items, setItems] = useState({});
    const [tempItems, setTempItems] = useState([]);
    const [dayGet, setDay] = useState(null);
    const [deviceID, setDeviceID] = useState();
    const [showModal, setShowModal] = useState(false);

    const [user, setUser] = useState(null);
    const [getTokenGC, setGetTokenGC] = useState(null);
    const [loggedIn, setloggedIn] = useState(false);

    
    const [loader, setLoader] = useState(true);
    const [gcSync, setGCSync] = useState(false);
    const [allowAdd, setAllowAdd] = useState(true);

    const [refreshCalender, setRefreshCalender] = useState(false);
      
    const getDeviceID = () => {
        var uniqueID = DeviceInfo.getUniqueId;
        setDeviceID(uniqueID);
    }

    useEffect(() =>{
        GoogleSignin.configure({
            scopes: [
              "profile",
              "email",
              "https://www.googleapis.com/auth/calendar.events"
            ],
            webClientId: '909386486823-jd4it3bachacc8fbmp8dfo5clnd4hmru.apps.googleusercontent.com',
            offlineAccess: true,
          });

        getDeviceID()
        isSignedIn();
        console.log("Items: ", items);
    }, []);

    useEffect(() => {
        getData();
    }, [isFocused, checkSignIn, user, getTokenGC]);



    const getData = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token; 

        setRefreshCalender(true);
        const arrTemp = {};

       //const isSignedIn = await GoogleSignin.isSignedIn();

        await axios.get(
            `https://beta.centaurmd.com/api/schedules`,
            { headers: { 'Accept': 'application/json','Authorization': 'Bearer ' + tokenget, },
            }).then(response => {
                setTempItems(response.data);
                const mappedData = response.data.map((data) => {
                    const date = data.date_from;
                    return {
                        ...data,
                        date: moment(date).format('YYYY-MM-DD')
                    };
                });


                mappedData.map(
                    (currentItem) => {
                        const { date, ...coolItem } = currentItem;
                        if (!arrTemp[date]) {
                            arrTemp[date] = [];
                        }
                        arrTemp[date].push(coolItem);
                    },
                );
                
                const SyncGoogleCalendar = async () =>{
                    console.log("Sync google calendar");
                    console.log(user);
                    console.log(user.user.email);
                    console.log(getTokenGC);
                    setGCSync(true);
                   // const userInfo = await GoogleSignin.signInSilently();
                    const userInfoToken =  await GoogleSignin.getTokens();
                    //const token = userInfoToken.accessToken;
        
                    await axios.get(
                        `https://www.googleapis.com/calendar/v3/calendars/${user.user.email}/events?access_token=${userInfoToken.accessToken}`
                    ).then(response =>{
                        const mappedData = response.data.items.map((data, index) => {
                            const date = data.start.dateTime
                            return {
                                ...data,
                                date: moment(date).format('YYYY-MM-DD')
                            };
                        });

                        mappedData.map(
                            (currentItem, index) => {
                                const { date, ...coolItem } = currentItem;
                                if (!arrTemp[date]) {
                                    arrTemp[date] = [];
                                }
                                arrTemp[date].push({
                                     title: coolItem.summary, 
                                     description: coolItem.description, 
                                     date_from:  moment(coolItem.start.dateTime).format("YYYY-MM-DD"), 
                                     time_from:  moment(coolItem.start.dateTime).format("HH:mm"), 
                                     date_to: moment(coolItem.end.dateTime).format("YYYY-MM-DD"), 
                                     time_to: moment(coolItem.end.dateTime).format("HH:mm"), 
                                     category: "Others",
                                     googleEventId: coolItem.id, 
                                     googleCalendar: true });
                            },
                        );
                        console.log(mappedData);
                        setItems({});
                        setItems(arrTemp);
                        setLoader(false);
                        setGCSync(false);
                    });
                } 
                
                if(checkSignIn === true){
                     SyncGoogleCalendar();
                }
                else{
                    setItems({});
                    setItems(arrTemp);
                    setLoader(false)
                    setGCSync(false);
                }
            }
        );
        setRefreshCalender(false);
    }

    const signIn = async () => {
        try{
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const userInfoToken = await GoogleSignin.getTokens();
          setUser(userInfo)
          setGetTokenGC(userInfoToken)

          setCheckSignIn(true);
          setLoader(true);
          setGCSync(true);
          getData();
          //yncGoogleCalendar(true);
        }
        catch(error){
          setCheckSignIn(false);
          setLoader(false);
          setGCSync(false);
          console.log('Message______', error.message);
          if(error.code === statusCodes.SIGN_IN_CANCELLED){
            console.log('User Cancelled the Login Flow.');
          }
          else if(error.code === statusCodes.IN_PROGRESS){
            console.log('Signing In.');
          }
          else if(error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE){
            console.log('Play Services not Available.');
          }
          else{
            console.log('Some other error message.');
          }
        }
    }
    
    const isSignedIn = async () => {
          const isSignedIn = await GoogleSignin.isSignedIn();
          if(!!isSignedIn){
            getCurrentUserInfo();
            setCheckSignIn(true);
          }
          else{
            setCheckSignIn(false);
            console.log('Please Login..');
          }
    }
    
    const getCurrentUserInfo = async () => {
        try{
          const userInfo = await GoogleSignin.signInSilently();
          const userInfoToken = await GoogleSignin.getTokens();
          setUser(userInfo);
          setGetTokenGC(userInfoToken)
          setCheckSignIn(true);
        }
        catch(error){
          if(error.code === statusCodes.SIGN_IN_REQUIRED){
            alert('User has not signed in yet');
            console.log('User has not signed in yet');
          }
          else{
            alert('Somethign went wrong');
            console.log('Somethign went wrong');
          }
          setCheckSignIn(false);
        }
    }


    const getAllSchedules = async () => {
        setLoader(true);
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token; 
        // console.log(token, "token");
        await fetch('https://beta.centaurmd.com/api/schedules', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + tokenget,
            },
        }).then(res => res.json())
            .then(resData => {
                // console.log("NEW DATA? ", resData)
                setTempItems(resData);
                const mappedData = resData.map((data) => {
                    const date = data.date_from;
                    return {
                        ...data,
                        date: moment(date).format('YYYY-MM-DD')
                    };
                });

                const reduced = mappedData.reduce(
                    (acc, currentItem) => {
                        const { date, ...coolItem } = currentItem;
                        acc[date] = [coolItem];

                        return acc;
                    },
                    {},
                );
                setItems(reduced);
                setLoader(false);

            });
    }

    const renderDay = (day, item) => {
        return (
            loader === true ? 
              <SkeletonLoaderCard/>
            :
            moment(item.date_from).format('YYYY-MM-DD') !== ( dayGet === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") :  dayGet ) ?  <></>
               : <TouchableHighlight
                    style={{ margin: 10, width: width }}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                    onPress={ async () => {
                        const isSignedIn = await GoogleSignin.isSignedIn();
                        if(!isSignedIn){
                            navigation.navigate('View Schedule', {
                                item: item,
                            });
                        }
                        else{
                            const accToken = await GoogleSignin.getTokens();
                            navigation.navigate('View Schedule', {
                                item: item,
                                accessToken: accToken.accessToken,
                                email: user.user.email,
                            });
                        }
                    }}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <Card style={{ borderLeftWidth: 5, borderColor: item.category === 'consults' ? '#da7331' : item.category === 'procedures' ? '#ffc000' : item.category === 'reminder' ? '#3a87ad' : '#81c784' }}>
                            {item.category === 'reminder' ?
                                <Card.Content>
                                    <View style={styles.columnContainer}>
                                        <Text style={styles.titleStyle}>{item.title}</Text>
                                        <View style={styles.rowContainer}>
                                            <Icon name="information" size={20} color="#3a87ad" style={{ marginRight: 5 }} />
                                            <Text style={styles.tagStyle}>{item.description}&nbsp;</Text>

                                        </View>

                                        <View style={styles.rowContainer}>
                                            <Icon name="calendar" size={20} color="#3a87ad" style={{ marginRight: 5 }} />
                                            <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                        </View>
                                    </View>
                                </Card.Content>

                                :

                                item.category === 'procedures' ?
                                    <Card.Content>
                                        <View style={styles.columnContainer}>
                                            <Text style={styles.titleStyle}>{item.procedures}</Text>
                                            <View style={styles.rowContainer}>
                                                <Icon name="information" size={20} color="#ffc000" style={{ marginRight: 5 }} />
                                                <Text style={styles.tagStyle}>{item.procedure_description}&nbsp;</Text>

                                            </View>

                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={20} color="#ffc000" style={{ marginRight: 5 }} />
                                                <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                            </View>
                                        </View>
                                    </Card.Content>

                                    :

                                    item.category === 'consults' ?
                                        <Card.Content>
                                            <View style={styles.columnContainer}>
                                                <Text style={styles.titleStyle}>{item.procedures}</Text>
                                                <View style={styles.rowContainer}>
                                                    <Icon name="information" size={20} color="#da7331" style={{ marginRight: 5 }} />
                                                    <Text style={styles.tagStyle}>{item.notes}&nbsp;</Text>

                                                </View>

                                                <View style={styles.rowContainer}>
                                                    <Icon name="calendar" size={20} color="#da7331" style={{ marginRight: 5 }} />
                                                    <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                </View>
                                            </View>
                                        </Card.Content>

                                        :

                                        <Card.Content>
                                            <View style={styles.columnContainer}>
                                                <Text style={styles.titleStyle}>{item.title}</Text>
                                                <View style={styles.rowContainer}>
                                                    <Icon name="information" size={20} color="#81c784" style={{ marginRight: 5 }} />
                                                    <Text style={styles.tagStyle}>{item.description}&nbsp;</Text>

                                                </View>

                                                <View style={styles.rowContainer}>
                                                    <Icon name="calendar" size={20} color="#81c784" style={{ marginRight: 5 }} />
                                                    <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                </View>

                                                {item.googleCalendar === true ?
                                                
                                                <View style={styles.googleIconContainer}>
                                                <Image
                                                    style={styles.gCalendarIcon}
                                                    source={require('../../../assets/google-calendar-icon.png')}
                                                />
                                                </View>
                                            : <></>}
                                            </View>
                                        </Card.Content>
                            }
                        </Card>
                    </SafeAreaView>
                </TouchableHighlight>
        );
    };

    const renderEmptyDate = () => {
        return (
            loader === true ? 
             <SkeletonLoaderCard/>
            :
            <View style={styles.itemEmptyContainer}>
                <Image
                    style={styles.logoImg}
                    source={require('../../../assets/calendar.png')}
                />
                <Text style={styles.text1}>You have no schedule at the moment for this day</Text>
            </View>
        );
    }

    const filterItems = (itemCategory) => {
        setLoader(true);
        const newList = tempItems.filter(item => { return item.category === itemCategory });
        // console.log("new list to: ", newList)
        const mappedData = newList.map((data) => {
            const date = data.date_from;
            return {
                ...data,
                date: moment(date).format('YYYY-MM-DD')
            };
        });

        const reduced = mappedData.reduce(
            (acc, currentItem) => {
                const { date, ...coolItem } = currentItem;
                acc[date] = [coolItem];

                return acc;
            },
            {},
        );

        console.log("filtered: ", reduced)
        setItems(reduced);
        setLoader(false);
    };


    const clickHandler = async () => {
        const accToken = await GoogleSignin.getTokens();
        navigation.navigate('Add Schedule', { 
            getdate: dayGet === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") : dayGet,
            user: user,
            accessToken: accToken.accessToken,
            email: user.user.email,
        })
        console.log(accToken.accessToken)
    };

    return (
        <View style={styles.container}>
            {gcSync === true ?
            <View style={styles.syncGC}>
            <Text style={styles.syncGCText}>Syncing... </Text>
            <View style={styles.syncGCImageCont}>
            <Image
                    source={require('../../../assets/google-calendar-icon.png')}
                    style={styles.syncGCImage}
                />
            </View></View>
            : <></>}
            {checkSignIn === false ?

            <TouchableOpacity style={styles.buttonGPlusStyle} activeOpacity={0.5} onPress={signIn}>
                <Image
                 source={require('../../../assets/Google_Calendar_icon.png')}
                 style={styles.buttonImageIconStyle}
                />
                <Text style={styles.buttonTextStyle}>Sign in with Google </Text>
            </TouchableOpacity>
             : <></>
            }
            <View style={styles.typesContainer}>
                {/* <TouchableHighlight
                    style={{ padding: 5, borderRadius: 5 }}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                    onPress={() => filterItems("consults")}
                > */}
                <DoubleClick
                    singleTap={() => {filterItems("consults")}}
                    doubleTap={() => {getAllSchedules()}}
                    delay={200}
                >
                    <View style={styles.types}>
                        <View style={styles.circleOrange}></View>
                        <Text style={styles.text2}>CONSULTS</Text>
                    </View>
                </DoubleClick>
                {/* </TouchableHighlight> */}

                <DoubleClick
                    singleTap={() => {filterItems("procedures")}}
                    doubleTap={() => {getAllSchedules()}}
                    delay={200}
                >
                    <View style={styles.types}>
                        <View style={styles.circleGY}></View>
                        <Text style={styles.text2}>PROCEDURES</Text>
                    </View>
                </DoubleClick>
                <DoubleClick
                    singleTap={() => {filterItems("reminder")}}
                    doubleTap={() => {getAllSchedules()}}
                    delay={200}
                >
                    <View style={styles.types}>
                        <View style={styles.circleBlue}></View>
                        <Text style={styles.text2}>REMINDER</Text>
                    </View>
                </DoubleClick>
                <DoubleClick
                    singleTap={() => {filterItems("other")}}
                    doubleTap={() => {getAllSchedules()}}
                    delay={200}
                >
                    <View style={styles.types}>
                        <View style={styles.circleLG}></View>
                        <Text style={styles.text2}>OTHER</Text>
                    </View>
                </DoubleClick>
            </View>

            <Agenda
                items={items}
                renderDay={renderDay}
                renderEmptyData={renderEmptyDate}
                refreshing={refreshCalender}
                onDayPress={day => {
                    setDay(day.dateString);
                    if(day.dateString < moment(new Date(Date.now())).format("YYYY-MM-DD")){
                        setAllowAdd(false);
                    }
                    else{
                        setAllowAdd(true);
                    }
                }}
                selected={Date.now()}
                theme={{
                    selectedDayBackgroundColor: '#075DA7',
                }}

            />

         {checkSignIn !== false & allowAdd === true ? 
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={
                    clickHandler
                }
                style={styles.touchableOpacityStyle}>
                <Image
                    source={require('../../../assets/addIcon.png')}
                    style={styles.floatingButtonStyle}
                />
            </TouchableOpacity>
            : <></> }

        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "Roboto",

    },
    columnContainer: {
        flexDirection: 'column',

    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 5,

    },
    titleStyle: {
        letterSpacing: 0.2,
        fontWeight: '800',
        color: '#0E2138',
        fontSize: 18,
        marginBottom: 10

    },
    tagStyle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#737A87',
        paddingLeft: 10


    },
    scheduleStyle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#737A87',
        paddingLeft: 10

    },
    itemEmptyContainer: {
        padding: 20,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text1: {
        marginTop: 15,
        marginBottom: 15,
        fontSize: 15,
    },
    text2: {
        fontSize: 12,
        color: 'black'
    },
    safeAreaViewContainer: {
        padding: 10,
        flex: 1,
        backgroundColor: '#F2F4F5'
    },
    logoImg: {
        width: 100,
        height: 100,
        opacity: 0.5,
        resizeMode: 'contain',
    },
    circleOrange: {
        marginRight: 10,
        height: 20,
        width: 20,
        borderRadius: 15,
        backgroundColor: "#da7331",
    },
    circleGY: {
        marginRight: 10,
        height: 20,
        width: 20,
        borderRadius: 15,
        backgroundColor: "#ffc000",
    },
    circleBlue: {
        marginRight: 10,
        height: 20,
        width: 20,
        borderRadius: 15,
        backgroundColor: "#3a87ad",
    },
    circleLG: {
        marginRight: 10,
        height: 20,
        width: 20,
        borderRadius: 15,
        backgroundColor: "#81c784",
    },
    types: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',

    },
    typesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        display: 'flex',
        marginTop: 20
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        //backgroundColor:'black'
    },


    //MODAL DESIGN
    safeAreaViewContainerAdd: {
        padding: 15,
        flex: 1,
        backgroundColor: '#fff'
    },
    dateContainer: {
        flexDirection: 'row',
        height: 80,
        paddingHorizontal: 20,
        alignItems: 'center',
        fontSize: 18,
        backgroundColor: '#3a87ad',
    },
    datetimeCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    textPicker: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold'
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

    inputContainer2: {
        height: 50,
        marginHorizontal: 3,
        marginVertical: 2,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        fontSize: 13,
        backgroundColor: 'white',
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonCont: {
        marginHorizontal: 5,
        marginTop: 10,
        backgroundColor: 'green'
    },
    buttonDate: {
        marginHorizontal: 5,
        marginTop: 10,
    },
    logoImg2: {
        width: 50,
        height: 50,
        marginRight: 10,
        marginLeft: 10,
        resizeMode: 'contain',
    },
    errorMsg: {
        color: 'red',
        fontSize: 13,
        marginHorizontal: 3,
        marginBottom: 10,
    },
    textTitle: {
        fontSize: 18,
        fontWeight: '700',
        padding: 5,
        color: 'white',
    },
      skeltonMainView: {
        margin: 10,
        borderWidth: 0,
        elevation: 5,
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderRadius: 5,
        alignSelf: "center",
        width: Dimensions.get('window').width-20,
        height: Dimensions.get('window').height / 6,
        borderRadius: 20,
        // height: globals.screenHeight * 0.24,
      },

      //DIALOG BOX
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
      header: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
      },

      googleIconContainer:{
          flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      gCalendarIcon: {
        padding: 0,
        width: "30%",
        height: 20,
        resizeMode: 'contain',
    },

    syncGC:{
        width: '100%',
        height: "5%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    syncGCImageCont:{
        width: "40%",
        height: "80%",
    },

    syncGCImage: {
        width: undefined, 
        height: undefined,
        resizeMode: 'contain',
        flex: 1,
    },

    syncGCText: {
        fontSize: 15
    },

    buttonGPlusStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'gray',
        height: 40,
        borderRadius: 5,
        margin: 5,
        justifyContent: 'center'
      },
      buttonImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
      },
      buttonTextStyle: {
        color: 'black',
        marginBottom: 4,
        marginLeft: 10,
      },
      buttonIconSeparatorStyle: {
        backgroundColor: 'gray',
        width: 1,
        height: 40,
      },
});

export default memo(Calendar);