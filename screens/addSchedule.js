import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TextInput, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import { Form, FormItem, Label } from 'react-native-form-component';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
import axios from 'axios';

const AddSchedule = ({ route, navigation }) => {

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

    const [user, setUser] = useState({});

    useEffect(()=>{
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
      isSignedIn()
    },[])
  
    const signIn = async () => {
      try{
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        //console.log('due_______' , userInfo)
        setUser(userInfo)
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
        }
        else{
          console.log('Please Login..');
        }
    }
  
    const getCurrentUserInfo = async () => {
      try{
        const userInfo = await GoogleSignin.signInSilently();
       // console.log('edit______', user);
        setUser(userInfo);
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
      }
    }
  
    const signOut = async () => {
      try{
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setUser({});
      }
      catch(error){
        console.log('Error');
      }
    }
  
    const create = async () => {
      const userInfoToken = await GoogleSignin.getTokens();
      const token = userInfoToken.accessToken;
      const email = user.user.email;

      const resp = await axios.post(
        `https://www.googleapis.com/calendar/v3/calendars/${email}/events?access_token=${token}`,
        {
          start: {
           // dateTime: `${startSplitted[0]}T${startSplitted[1]}:00.0Z`
            dateTime: `${route.params.getdate}T${startTime}:00`, //`2019-04-04T09:30:00.0z`
            timeZone: "Asia/Manila",
          },
          end: {
            // dateTime: `${endSplitted[0]}T${endSplitted[1]}:00.0Z`
            //`20019-4-04T09:30:00.0z`
            dateTime: `${endDate}T${endTime}:00`,
            timeZone: "Asia/Manila",
          },
          summary: title,
          description: desc,
        }
      );
  
      //console.log(resp.data);
  
      if (resp.status === 200) {
        navigation.goBack();
        signOut();
        alert("Added Successfully");
      } else {
        alert("Error, please try again");
      }
    }

    const submitSched = (title, desc, endDate, startTime, endTime, dateSelected) => {
        console.log(title, desc, endDate, startTime, endTime, "Others", dateSelected);
         !user.idToken ? signIn() : create()

    };

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

    return (
        <View style={styles.container}>
            <AppBar title={"Add Personal Schedule"} showMenuIcon={true} />
         
                <View style={styles.dateContainer}>
                    <Image
                        style={styles.logoImg}
                        source={require('../assets/calendar.png')}
                    />
                    <Text style={styles.textTitle}>Date - {route.params.getdate}</Text>
                </View>
                <ScrollView>
                <SafeAreaView style={styles.safeAreaViewContainer}>
                    <Form onButtonPress={() => submitSched(title, desc, endDate, startTime, endTime, route.params.getdate)}
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
                                <Text style={styles.text2}>{datePickerTitle === null ? "Show Date Picker" : datePickerTitle}</Text>
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
                                <Text style={styles.text2}>{datePickerTitleTimeStart === null ? "Show Time Picker" : datePickerTitleTimeStart}</Text>
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
                                <Text style={styles.text2}>{datePickerTitleTime === null ? "Show Time Picker" : datePickerTitleTime}</Text>
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



                    {/*
           <Text style={styles.text}>Description</Text>
            <TextInput
                    style={styles.inputContainer}
                    keyboardType="email-address"
                    multiline={true}
                    onChangeText={descript => setDesc(descript)}
            />
            <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}> Description is required</Text>
            </Animatable.View>

           */}

                </SafeAreaView>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "Roboto",

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
    },

    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderLeftColor: 'green',
        borderLeftWidth: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    safeAreaViewContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: '#F2F4F5'
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
        color: 'white',
        fontSize: 18,
    },
    tagStyle: {
        fontWeight: '700',
        fontSize: 14,
        color: 'white',

    },
    scheduleStyle: {
        fontWeight: '700',
        fontSize: 14,
        color: 'white',
    },

    text: {
        marginHorizontal: 10,
        fontSize: 15,
        fontWeight: '400',
    },
    text2: {
        fontSize: 15,
        fontWeight: '400',
        alignSelf: 'center',
        marginHorizontal: 15,
    },
    textTitle: {
        fontSize: 18,
        fontWeight: '700',
        padding: 5,
        color: 'white',
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
    logoImg: {
        width: 50,
        height: 50,
        marginRight: 10,
        resizeMode: 'contain',
    },
    errorMsg: {
        color: 'red',
        fontSize: 13,
        marginHorizontal: 3,
        marginBottom: 10,
    }
});

export default AddSchedule;