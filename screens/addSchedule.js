import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, SafeAreaView, TouchableOpacity, Modal, Button, ScrollView, Animated, Flatlist } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import { Form, FormItem, Label } from 'react-native-form-component';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
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
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const [datePickerTitle, setdatePickerTitle] = useState(null);
    const [datePickerTitleTime, setdatePickerTitleTime] = useState(null);

    const [datePickerTitleTimeStart, setdatePickerTitleTimeStart] = useState(null);

    const [addLoader, setAddLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
        const getDaySelecte = route.params.getdate === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") : route.params.getdate;
  
        console.log(route.params.accessToken, route.params.email, getDaySelecte, startTime);
        console.log(endDate, endTime, title, desc);
        const resp = await axios.post(
          `https://www.googleapis.com/calendar/v3/calendars/${route.params.email}/events?access_token=${route.params.accessToken}`,
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
                <Image
                    style={styles.logoImg2}
                    source={require('../assets/calendar.png')}
                />
                <Text style={styles.textTitle}>Date - {route.params.getdate} </Text>
            </View>
            <ScrollView style={styles.safeAreaViewContainerAdd}>
                <SafeAreaView style={styles.safeAreaViewContainerAdd}>
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
                    {addLoader === true? 
                          <LoaderSmall/> : 
                           <View style={{marginTop: 10}}>
                            <Button 
                                style={styles.buttonCont}
                                title="Submit" 
                                onPress={() => route.params.user.idToken === null ? signIn() : create()
                                }
                            />
                          </View>}
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
});

export default AddSchedule;