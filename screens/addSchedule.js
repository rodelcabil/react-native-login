import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, SafeAreaView, TouchableOpacity, Modal, Button, ScrollView, Animated, Flatlist } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import { Form, FormItem, Label } from 'react-native-form-component';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { Dimensions } from "react-native";
import Icon2 from 'react-native-vector-icons/Ionicons';
import LoaderSmall from './ReusableComponents/LottieLoader-Small';

const AddSchedule = ({ route, navigation }) => {

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleStart, setDatePickerVisibilityStart] = useState(false);
    const [isDatePickerTimeVisible, setDatePickerTimeVisibility] = useState(false);

    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [endDate, setEndDate] = useState( moment(route.params.getdate).format("YYYY-MM-DD"));
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const [datePickerTitle, setdatePickerTitle] = useState(route.params.getdate);
    
    const [datePickerTitleTime, setdatePickerTitleTime] = useState(null);
    const [datePickerTitleTimeStart, setdatePickerTitleTimeStart] = useState(null);

    const [addLoader, setAddLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [showErrorTitle, setShowErrorTitle] = useState(false);
    const [showErrorDesc, setShowErrorDesc] = useState(false);
    const [showErrorStartTime, setShowErrorStartTime] = useState(false);
    const [showErrorEndTime, setShowErrorEndTime] = useState(false);
    const [showErrorEndTimeAhead, setShowErrorEndTimeAhead] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
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
        setdatePickerTitleTimeStart(moment(convTime, ["HH.mm"]).format("hh:mm A"))
        setStartTime(moment(convTime, ["HH.mm"]).format("HH:mm"));
        hideDatePickerTime();
    };

    const showDatePickerTimeStart = () => {
        setDatePickerVisibilityStart(true);
    };

    const hideDatePickerTimeEnd = () => {
        setDatePickerVisibilityStart(false);
    };

    const handleConfirmTimeEnd = (time) => {
        var convTime = moment(time).format("HH:mm")
        setdatePickerTitleTime(moment(convTime, ["HH.mm"]).format("hh:mm A"))
        setEndTime(moment(convTime, ["HH.mm"]).format("HH:mm"));
        hideDatePickerTimeEnd();
    };

    const create = async () => {
        setAddLoader(true);
        const accToken = await GoogleSignin.getTokens();
        const getDaySelecte = route.params.getdate === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") : route.params.getdate;
  
        console.log(getDaySelecte, startTime, endDate, endTime, title, desc, accToken.accessToken);
        const resp = await axios.post(
          `https://www.googleapis.com/calendar/v3/calendars/${route.params.email}/events?access_token=${accToken.accessToken}`,
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
    
        console.log(resp.data);   
    
        if (resp.status === 200) {
             setShowModal(false);
             setAddLoader(false);
             setVisibleAdd(true);
             setTimeout(() => {navigation.navigate('Calendar');}, 1000)
        } else {
          alert("Error, please try again");
        }
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
                source={require('../assets/sucess.png')}
                style={{height: 120, width: 120, marginVertical: 10}}
              />
            </View>
    
            <Text style={{marginBottom: 20, fontSize: 20, color: 'black', textAlign: 'center'}}>
               Added Successfully
            </Text>
          </ModalPoup>
        );
    }

      return(
        <View style={styles.container}>    
             <DialogBox/>     
            <View style={styles.dateContainer}>
               <Icon2 name="arrow-back" size={30} color="white"  onPress={() => navigation.navigate('Calendar')}/>
               <Text style={{marginLeft: 8, color: 'white', fontSize: 18, fontWeight: '600'}}>Add Item to Google Calendar</Text>
            </View>
            <ScrollView style={styles.safeAreaViewContainerAdd}>
                <SafeAreaView style={styles.safeAreaViewContainerAdd}>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <Image
                        style={styles.logoImg2}
                        source={require('../assets/calendar.png')}
                      />
                      <View style={{flexDirection: 'column'}}>
                        <Text style={{fontSize: 13, fontWeight: 'bold', color: 'black', marginLeft: 5, marginTop: 5}}>Start Date</Text>
                        <Text style={styles.textTitle}>Date - {route.params.getdate} </Text>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', marginVertical: 5}}>
                      <Text style={styles.formText}>All fields marked with </Text>
                      <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                      <Text style={styles.formText}> are required.</Text>
                    </View>

                    <View style={[styles.card, styles.shadowProp]}>
                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                          <Text style={styles.formText}>Title</Text>
                          <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                        </View>
                        {showErrorTitle === true ? 
                                <Animatable.View animation='fadeInLeft' duration={500}>
                                  <Text style={styles.errorMsg}>Please enter Title</Text>
                                </Animatable.View>
                          :<></>}

                        <FormItem
                            value={title}
                            style={styles.inputContainer}
                            placeholder= "Enter Title"
                            onChangeText={titleInp => setTitle(titleInp)}
                            asterik />

                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                          <Text style={styles.formText}>Description</Text>
                          <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                        </View>
                        {showErrorDesc === true ? 
                                <Animatable.View animation='fadeInLeft' duration={500}>
                                  <Text style={styles.errorMsg}>Please enter Description</Text>
                                </Animatable.View>
                          :<></>}
                        <FormItem
                            value={desc}
                            style={styles.inputContainer}
                            placeholder= "Enter Description"
                            onChangeText={descript => setDesc(descript)}
                            asterik />
      
                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                          <Text style={styles.formText}>End Date</Text>
                          <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                        </View>
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
                                          minimumDate={Date.now()}
                                      />
                                  </View>
                              </TouchableOpacity>

                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                          <Text style={styles.formText}>Start Time</Text>
                          <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                        </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={showDatePickerTimeStart}
                            >
                              {showErrorStartTime === true ? 
                                    <Animatable.View animation='fadeInLeft' duration={500}>
                                      <Text style={styles.errorMsg}>Please select Start Time</Text>
                                    </Animatable.View>
                              :<></>}

                                <View style={styles.inputContainer2}>
                                    <Text style={styles.textPicker}>{datePickerTitleTimeStart === null ? "Show Time Picker" : datePickerTitleTimeStart}</Text>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisibleStart}
                                        mode="time"
                                        value={startTime}
                                        onConfirm={handleConfirmTime}
                                        onCancel={hideDatePickerTime}
                                    />
                                </View>
                            </TouchableOpacity>

                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                          <Text style={styles.formText}>End Time</Text>
                          <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>*</Text>
                        </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={showDatePickerTime}
                            >
                            {showErrorEndTime === true ? 
                                    <Animatable.View animation='fadeInLeft' duration={500}>
                                      <Text style={styles.errorMsg}>Please select End Time</Text>
                                    </Animatable.View>
                              :<></>}
                              {showErrorEndTimeAhead === true ? 
                                    <Animatable.View animation='fadeInLeft' duration={500}>
                                      <Text style={styles.errorMsg}>Same Date! End Time must be after Start Time ahead</Text>
                                    </Animatable.View>
                              :<></>}
                                <View style={styles.inputContainer2}>
                                    <Text style={styles.textPicker}>{datePickerTitleTime === null ? "Show Time Picker" : datePickerTitleTime}</Text>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerTimeVisible}
                                        mode="time"
                                        value={endTime}
                                        onConfirm={handleConfirmTimeEnd}
                                        onCancel={hideDatePickerTimeEnd}
                                    />
                                </View>
                            </TouchableOpacity>

                            {addLoader === true? 
                          <LoaderSmall/> : 
                           <View style={{marginTop: 10, marginBottom: 20}}>
                            <Button 
                                style={styles.buttonCont}
                                title="Submit" 
                                onPress={() => {
                                  console.log(endDate);
                                  if(startTime !== null && endTime !== null && title !== null && desc !== null){
                                    if(route.params.getdate === endDate){
                                        if(endTime < startTime){
                                            setShowErrorEndTimeAhead(true)
                                        }
                                        else{
                                            setShowErrorEndTimeAhead(false)
                                            create()
                                        }
                                    }
                                    else{
                                      setShowErrorEndTimeAhead(false)
                                      create()
                                    }
                                  }
                                  else{
                                    if(startTime === null){
                                      setShowErrorStartTime(true)
                                    }
                                    else{
                                      setShowErrorStartTime(false) 
                                    }
                                    if(endTime === null){
                                      setShowErrorEndTime(true)
                                    }
                                    else{
                                      setShowErrorEndTime(false) 
                                    }
                                    if(title === null ){
                                      setShowErrorTitle(true)
                                    }
                                    else{
                                      setShowErrorTitle(false) 
                                    }
                                    if(desc === null ){
                                      setShowErrorDesc(true)
                                    }
                                    else{
                                      setShowErrorDesc(false) 
                                    }
                                  }
                                }}
                            />
                          </View>}

                      </View>

                </SafeAreaView>
            </ScrollView >
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
    card: {
        padding: 18,
        backgroundColor: 'white',
        borderRadius: 8,
        width: '100%',
        marginVertical: 10,
        marginBottom: 20,
      },
      shadowProp: {
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8
      },
      formText:{
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Poppins-Bold',
        color: 'black'
    },

    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderLeftColor: 'green',
        borderLeftWidth: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    safeAreaViewContainerAdd: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
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
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
        alignItems: 'center',
        fontSize: 13,
        backgroundColor: 'white',
    },

    inputContainer2: {
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
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
        resizeMode: 'contain',
    },
    errorMsg: {
        color: 'red',
        fontSize: 13,
        marginBottom: 10,
    },
    textTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
        marginLeft: 5
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
});

export default AddSchedule;