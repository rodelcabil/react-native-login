/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, SafeAreaView, TouchableOpacity, Modal, Button, ScrollView, Animated} from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import { showNotification, handleScheduleNotification, handleCancel } from '../../ReusableComponents/notification.android'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { Dimensions } from "react-native";
import DoubleClick from 'react-native-double-tap';
import { Form, FormItem, Label } from 'react-native-form-component';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
import axios from 'axios';
import SkeletonLoaderCard from '../../ReusableComponents/SkeletonLoader'
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

var width = Dimensions.get('window').width - 20;

export function Calendar ({ navigation, route }) {

    const isFocused = useIsFocused();
    const [checkSignIn, setCheckSignIn] = useState(false);

    const [items, setItems] = useState({});
    const [tempItems, setTempItems] = useState([]);
    const [mergeItems, setMergeItems] = useState([]);
    const [dayGet, setDay] = useState(null);
    const [deviceID, setDeviceID] = useState();
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState({});

    const [dummy, setDummy] = useState({
        '2022-03-20': [{ event: 'Schedule title 1', tag: {name:['Dr. Al', 'Dr. Jay Ar']}, schedule: '12nn - 1pm', category: 'consults' }],
        '2022-04-20': [
            { event: 'Schedule Title 2', tag: {name:['Dr. Jim',  'Dr. Rodel']}, schedule: '12nn - 1pm', type: 'procedures' }, 
            { event: 'Schedule Title 2', tag: {name:['Dr. Jim',  'Dr. Rodel']}, schedule: '12nn - 1pm', type: 'other' }
        ], 
        '2022-04-21': [{ event: 'Schedule Title 3', tag: {name:['Dr. Al',  'Dr. Jim']}, schedule: '12nn - 1pm', category: 'reminder' }],
        '2022-04-21': [{ event: 'Schedule Title 3', tag: {name:['Dr. Al',  'Dr. Jim']}, schedule: '12nn - 1pm', category: 'others' }],
        '2022-04-22': [{ event: 'Schedule Title 4', tag: {name:['Dr. Rodel', 'Dr. Jay Ar']}, schedule: '12nn - 1pm', category: 'consults' }],
        '2022-04-23': [{ event: 'Schedule Title 5', tag: {name:['Dr. Jay Ar', 'Dr. Jim']}, schedule: '12nn - 1pm', category: 'other' }],
        '2022-04-23': [{ event: 'Schedule Title 6', tag: {name:['Dr. Jay Ar', 'Dr. Jim']}, schedule: '12nn - 1pm', category: 'other' }],
    });

    
    const [loader, setLoader] = useState(true);
    GoogleSignin.configure({
        scopes: [
          "profile",
          "email",
          "https://www.googleapis.com/auth/calendar.events"
        ],
        webClientId: '909386486823-jd4it3bachacc8fbmp8dfo5clnd4hmru.apps.googleusercontent.com',
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
      
    const getDeviceID = () => {
        var uniqueID = DeviceInfo.getUniqueId;
        setDeviceID(uniqueID);
    }

    useEffect(() => {
        isSignedIn()
    }, []);

    useEffect(() => {
        getData();
        getDeviceID()
        console.log("ITEMS: ", items)
        console.log("Device ID", deviceID);
        console.log("Items: ", items);

    }, [isFocused]);

    const getData = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token; 
        const arrTemp = {};
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
                    const SyncGoogleCalendar = async (setAlert) =>{
                        const isSignedIn = await GoogleSignin.isSignedIn();
                        if(!!isSignedIn){
                            const userInfo = await GoogleSignin.signInSilently();
                            const userInfoToken = await GoogleSignin.getTokens();
                            const token = userInfoToken.accessToken;
                
                            const resp = await axios.get(
                                `https://www.googleapis.com/calendar/v3/calendars/${userInfo.user.email}/events?access_token=${token}`
                            );
                
                            for (let i = 0; i < resp.data.items.length; i++) {
                                const date = moment(resp.data.items[i].start.dateTime).format("YYYY-MM-DD");
                                const timeStart = moment(resp.data.items[i].start.dateTime).format("HH:mma");
                                const dateEnd = moment(resp.data.items[i].end.dateTime).format("YYYY-MM-DD");
                                const timeEnd = moment(resp.data.items[i].end.dateTime).format("HH:mma");
                                const title = (resp.data.items[i].summary);
                                const description = (resp.data.items[i].description);
        
                                if (!arrTemp[date]) {
                                    arrTemp[date] = [];
                                }
                                arrTemp[date].push({ title: title, description: description, date_from: date, time_from: timeStart, date_to: dateEnd, time_to: timeEnd, category: "Others",
                                googleEventId: resp.data.items[i].id, googleCalendar: true });
                            //newSet.push( { [date] : [{ title: title, description: description, date_from: date, time_from: timeStart, date_to: dateEnd, time_to: timeEnd, category: "Others",
//                                googleEventId: resp.data.items[i].id, googleCalendar: true }] })
                            }
                            // const output = Object.assign({}, ...newSet)


                            // const newElement = {
                            //     ...reduced,
                            //    ...output
                            // }
                            setItems(arrTemp);
                            setLoader(false);
                            if(setAlert === true){
                                alert('Successful Sync');
                            }
                        }
                        else{
                          //  alert('Google Account not Connected');
                            setItems(arrTemp);
                            setLoader(false)
                        }
                    } 
                    SyncGoogleCalendar(false);
            }
        );
    }

    const signIn = async () => {
        try{
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          setUser(userInfo)
          setCheckSignIn(true);
          setLoader(true);
          SyncGoogleCalendar(true);
        }
        catch(error){
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
         // console.log('edit______', user);
          setUser(userInfo);
          setCheckSignIn(true);
        }
        catch(error){
            setCheckSignIn(false);
          if(error.code === statusCodes.SIGN_IN_REQUIRED){
            alert('User has not signed in yet');
            console.log('User has not signed in yet');
          }
          else{
            alert('Somethign went wrong');
            console.log('Somethign went wrong');
          }
        }
      }
    
      const SyncGoogleCalendar = async (setAlert) =>{
        const arrTemp = items;
        const isSignedIn = await GoogleSignin.isSignedIn();
        if(!!isSignedIn){
            const userInfo = await GoogleSignin.signInSilently();
            const userInfoToken = await GoogleSignin.getTokens();
            const token = userInfoToken.accessToken;

            const resp = await axios.get(
                `https://www.googleapis.com/calendar/v3/calendars/${userInfo.user.email}/events?access_token=${token}`
            );

            for (let i = 0; i < resp.data.items.length; i++) {
                const date = moment(resp.data.items[i].start.dateTime).format("YYYY-MM-DD");
                const timeStart = moment(resp.data.items[i].start.dateTime).format("HH:mma");
                const dateEnd = moment(resp.data.items[i].end.dateTime).format("YYYY-MM-DD");
                const timeEnd = moment(resp.data.items[i].end.dateTime).format("HH:mma");
                const title = (resp.data.items[i].summary);
                const description = (resp.data.items[i].description);

                if (!arrTemp[date]) {
                    arrTemp[date] = [];
                }
                arrTemp[date].push({ title: title, description: description, date_from: date, time_from: timeStart, date_to: dateEnd, time_to: timeEnd, category: "Others",
                googleEventId: resp.data.items[i].id, googleCalendar: true });
              }

              setItems(arrTemp); 
              setLoader(false);
        }
        else{
            alert('Google Account not Connected');
            setItems(arrTemp);
            setLoader(false)
        }
        } 

    const getAllSchedules = async () => {
        setLoader(true);
        const token = await AsyncStorage.getItem('token');
        // console.log(token, "token");
        await fetch('https://beta.centaurmd.com/api/schedules', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
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
            moment(item.date_from).format('YYYY-MM-DD') === ( dayGet === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") :  dayGet ) ? 
                <TouchableHighlight
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
                                            </View>
                                        </Card.Content>
                            }
                        </Card>
                    </SafeAreaView>
                </TouchableHighlight>
               : <></>
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

    function toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum;
    }

    const checkSched = (item) => {
        var dateString = toTimestamp(item.date);
        console.log(dateString);
        if (dateString === item.date) {
            handleScheduleNotification("Hi!", "WELCOME", item.date)
        }
    }

    const clickHandler = () => {
        navigation.navigate('Add Schedule', { getdate: dayGet === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") : dayGet })
    };

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


    const [visible, setVisible] = useState(false);

    const ModalPoup = ({visible, children}) => {
        const [showModal, setShowModal] = React.useState(visible);
        const scaleValue = React.useRef(new Animated.Value(0)).current;
        React.useEffect(() => {
          toggleModal();
        }, [visible]);
        const toggleModal = () => {
          if (visible) {
            setShowModal(true);
            Animated.spring(scaleValue, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          } else {
            setTimeout(() => setShowModal(false), 200);
            Animated.timing(scaleValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }
        };
        return (
          <Modal transparent visible={showModal}>
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
            <ModalPoup visible={visible}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../../assets/calendar.png')}
                style={{height: 150, width: 150, marginVertical: 10}}
              />
            </View>
    
            <Text style={{marginBottom: 20, fontSize: 20, color: 'black', textAlign: 'center'}}>
               Added Successfully
            </Text>
            <View style={{alignItems: 'center'}}>
              <View style={styles.header}>
                <Button title='close' onPress={() => setVisible(false)}/>
              </View>
            </View>
          </ModalPoup>
        );
    }

    const AddSchedModal = () => {
        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
        const [isDatePickerVisibleStart, setDatePickerVisibilityStart] = useState(false);
        const [isDatePickerTimeVisible, setDatePickerTimeVisibility] = useState(false);
    
        const [title, setTitle] = useState(null);
        const [desc, setDesc] = useState(null);
        const [endDate, setEndDate] = useState(null);
        const [startTime, setStartTime] = useState(null);
        const [endTime, setEndTime] = useState(null);
    
        const [datePickerTitle, setdatePickerTitle] = useState(null);
        const [datePickerTitleTime, setdatePickerTitleTime] = useState(null);
    
        const [datePickerTitleTimeStart, setdatePickerTitleTimeStart] = useState(null);

        const [addLoader, setAddLoader] = useState(false);

        const showDatePicker = () => {
            setDatePickerVisibility(true);
        };

        const hideDatePicker = () => {
            setDatePickerVisibility(false);
        };

        const handleConfirm = (date) => {
            //console.warn("A date has been picked: ", date);
            setdatePickerTitle(moment(date).format("YYYY-MM-DD"))
            setEndDate(moment(date).format("YYYY-MM-DD"));
            hideDatePicker();
        };

        const showDatePickerTime = () => {
            setDatePickerTimeVisibility(true);
        };

        const hideDatePickerTime = () => {
            setDatePickerTimeVisibility(false);
        };

        const handleConfirmTime = (time) => {
            var convTime = moment(time).format("HH:mm")
            setdatePickerTitleTime(moment(convTime, ["HH.mm"]).format("hh:mm A"))
            setStartTime(moment(convTime, ["HH.mm"]).format("HH:mm"));
            hideDatePickerTime();
        };

        const showDatePickerTimeStart = () => {
            setDatePickerVisibilityStart(true);
        };

        const hideDatePickerTimeStart = () => {
            setDatePickerVisibilityStart(false);
        };

        const handleConfirmTimeStart = (time) => {
            var convTime = moment(time).format("HH:mm")
            setdatePickerTitleTimeStart(moment(convTime, ["HH.mm"]).format("hh:mm A"))
            setEndTime(moment(convTime, ["HH.mm"]).format("HH:mm"));
            hideDatePickerTimeStart();
        };


        const create = async () => {
            setAddLoader(true);
            const userInfoToken = await GoogleSignin.getTokens();
            const token = userInfoToken.accessToken;
            const email = user.user.email;
            const getDaySelecte = dayGet === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") :  dayGet;
      
            console.log(token, email, getDaySelecte, startTime);
            console.log(endDate, endTime, title, desc);
            const resp = await axios.post(
              `https://www.googleapis.com/calendar/v3/calendars/${email}/events?access_token=${token}`,
              {
                start: {
                  dateTime: `${getDaySelecte}T${startTime}:00`,
                  timeZone: "Asia/Manila",
                },
                end: {
                  dateTime: `${endDate}T${endTime}:00`,
                  timeZone: "Asia/Manila",
                },
                summary: title,
                description: desc,
              }
            );
        
            //console.log(resp.data);   
        
            if (resp.status === 200) {
                 setLoader(true);
                 getData();
                 setShowModal(false);
                 setAddLoader(false);
                 setVisible(true);
            } else {
              alert("Error, please try again");
            }
          }


        return(
            <View style={styles.container}>         
                <View style={styles.dateContainer}>
                <Icon2 name="arrow-back" size={30} color="white"  onPress={() =>setShowModal(false)}/>
                    <Image
                        style={styles.logoImg2}
                        source={require('../../../assets/calendar.png')}
                    />
                    <Text style={styles.textTitle}>Date - {dayGet === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") : dayGet} </Text>
                </View>
                <ScrollView style={styles.safeAreaViewContainerAdd}>
                    <SafeAreaView style={styles.safeAreaViewContainerAdd}>
                        <Form onButtonPress={() => !user.idToken ? signIn() : create()}
                            buttonStyle={styles.buttonCont}
                        >
                            <FormItem
                                label="Title"
                                isRequired
                                value={title}
                                style={styles.inputContainer}
                                onChangeText={titleInp => setTitle(titleInp)}
                                asterik />

                            <FormItem
                                label="Description"
                                isRequired
                                value={desc}
                                style={styles.inputContainer}
                                onChangeText={descript => setDesc(descript)}
                                asterik />

                            <Label text="End Date" isRequired asterik />
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={showDatePicker}
                            >
                                <View style={styles.inputContainer2}>
                                    <Text style={styles.textPicker}>{datePickerTitle === null ? "Show Date Picker" : datePickerTitle}</Text>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="date"
                                        value={endDate}
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                    />
                                </View>
                            </TouchableOpacity>

                            <Label text="Start Time" isRequired asterik />
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={showDatePickerTimeStart}
                            >
                                <View style={styles.inputContainer2}>
                                    <Text style={styles.textPicker}>{datePickerTitleTimeStart === null ? "Show Time Picker" : datePickerTitleTimeStart}</Text>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisibleStart}
                                        mode="time"
                                        value={startTime}
                                        onConfirm={handleConfirmTimeStart}
                                        onCancel={hideDatePickerTimeStart}
                                    />
                                </View>
                            </TouchableOpacity>

                            <Label text="End Time" isRequired asterik />
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={showDatePickerTime}
                            >
                                <View style={styles.inputContainer2}>
                                    <Text style={styles.textPicker}>{datePickerTitleTime === null ? "Show Time Picker" : datePickerTitleTime}</Text>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerTimeVisible}
                                        mode="time"
                                        value={endTime}
                                        onConfirm={handleConfirmTime}
                                        onCancel={hideDatePickerTime}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Form>
                        {addLoader === true? 
                            <LoaderSmall/> : <></>}
                    </SafeAreaView>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* <AppBar title={"My Schedule"} showMenuIcon={false} /> */}
            {checkSignIn === false ?
             <Button title="Sign In Google" onPress={signIn} titleStyle={styles.text2} style={styles.buttonCont}></Button> 
             :
            // <Button title="Sync Google Calendar" onPress={ SyncGoogleCalendar} titleStyle={styles.text2} style={styles.buttonCont}></Button> 
            <></>
            }
            <View style={styles.typesContainer}>
                <DialogBox/>
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
                onDayPress={day => {
                    setDay(day.dateString);
                }}
                selected={Date.now()}
                theme={{
                    selectedDayBackgroundColor: '#075DA7',
                }}

            />

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={
                    ()=>setShowModal(true)
                    //clickHandler
                }
                style={styles.touchableOpacityStyle}>
                <Image
                    source={require('../../../assets/addIcon.png')}
                    style={styles.floatingButtonStyle}
                />
            </TouchableOpacity>

            <Modal
                animationType={'slide'}
                transparent={false}
                visible={showModal}
            >
                <AddSchedModal/>
            </Modal>

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
        width: '80%',
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
});

export default Calendar;