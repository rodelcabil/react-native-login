import React, { useState, useEffect, memo } from "react";
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView,Button, ActivityIndicator, TouchableHighlight, Modal, TouchableOpacity, Animated } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import { Dimensions } from "react-native";
import { FormItem, Label } from 'react-native-form-component';
import axios from "axios";
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent
} from "react-native-popup-dialog";
import { set } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LoaderSmall from './ReusableComponents/LottieLoader-Small';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

var width = Dimensions.get('window').width;

const EditSchedule = ({ route, navigation }) => {

  const [dialogBoxEdit, setDialogBoxEdit] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleStart, setDatePickerVisibilityStart] = useState(false);
  const [isDatePickerTimeVisible, setDatePickerTimeVisibility] = useState(false);

  const [endDate, setEndDate] = useState(route.params.item?.date_to);
  const [startTime, setStartTime] = useState(moment(route.params.item?.time_from, ["HH.mm"]).format("hh:mm"));
  const [endTime, setEndTime] = useState(moment(route.params.item?.time_to, ["HH.mm"]).format("hh:mm"));
  const [datePickerTitle, setdatePickerTitle] = useState( route.params.item?.date_to);
  const [datePickerTitleTime, setdatePickerTitleTime] = useState(moment(route.params.item?.time_to, ["HH.mm"]).format("hh:mm A"));
  const [datePickerTitleTimeStart, setdatePickerTitleTimeStart] = useState(moment(route.params.item?.time_from, ["HH.mm"]).format("hh:mm A"));


  const [title, setTitle] = useState(route.params.item?.title);
  const [desc, setDesc] = useState(route.params.item?.description);

  useEffect(()=>{
      console.log(route.params.item);

  }, []);

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
          setTimeout(() => setShowModalAdd(false), 500);
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
              style={{height: 150, width: 150, marginVertical: 10}}
            />
          </View>
  
          <Text style={{marginBottom: 20, fontSize: 20, color: 'black', textAlign: 'center'}}>
             Editted Successfully
          </Text>
        </ModalPoup>
      );
  }
  

  const [addLoader, setAddLoader] = useState(false);

  const create = async () => {
      setAddLoader(true);
      setDialogBoxEdit(false)
      const token = route.params.accessToken;
      const email = route.params.email;

      console.log(route.params.item?.date_from, startTime, endDate, endTime, title, desc);
      const config = {
          headers: { Authorization: `Bearer ${token}` }
      };
      const resp = await axios.put(
        `https://www.googleapis.com/calendar/v3/calendars/${email}/events/${route.params.item?.googleEventId}`,
        {
          start: {
           // dateTime: `${startSplitted[0]}T${startSplitted[1]}:00.0Z`
            dateTime: `${route.params.item?.date_from}T${startTime}:00`, //`2019-04-04T09:30:00.0z`
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
        },
        config
      );
      if (resp.status === 200) {
          setAddLoader(false);
          setVisibleAdd(true);
          setTimeout(() => {navigation.navigate('Calendar');}, 1000)
          
     } else {
       alert("Error, please try again");
     }
  }

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
      setEndTime(moment(convTime, ["HH.mm"]).format("HH:mm"));
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
      setStartTime(moment(convTime, ["HH.mm"]).format("HH:mm"));
      hideDatePickerTimeStart();
  };

  const [showErrorTitle, setShowErrorTitle] = useState(false);
  const [showErrorDesc, setShowErrorDesc] = useState(false);
  const [showErrorStartTime, setShowErrorStartTime] = useState(false);
  const [showErrorEndTime, setShowErrorEndTime] = useState(false);
  const [showErrorEndTimeAhead, setShowErrorEndTimeAhead] = useState(false);


  return (
      <View style={styles.container}>
          <DialogBox/>
                      <Dialog
                              visible={dialogBoxEdit}
                              width={300}
                              footer={
                          <DialogFooter>
                              <DialogButton
                                  text="CANCEL"
                                  onPress={() => {
                                    setDialogBoxEdit(false);
                                  }}
                                  />
                                  <DialogButton text="OK" onPress={create} />
                          </DialogFooter>
                              }>
                              <DialogContent style={{margin: 10,}}>
                                  <View style={{alignItems: 'center'}}>
                                  <Image
                                      source={require('../assets/askIcon.png')}
                                      style={{height: 120, width: 120, marginVertical: 10, resizeMode: 'contain'}}
                                      />
                              </View>
                              <Text style={{textAlign: 'center', fontSize: 15, fontWeight: "bold"}}>Are you sure you want to edit this schedule?</Text>
                              </DialogContent>
                      </Dialog>
          <AppBar title={"Edit Schedule"} showMenuIcon={true} />
          <View style={styles.dateContainer}>
                    <Image
                        style={styles.logoImg2}
                        source={require('../assets/calendar.png')}
                    />
                    <Text style={styles.textTitle}>Date - {route.params.item?.date_from} </Text>
                  </View>
              <ScrollView style={styles.safeAreaViewContainerAdd}>
                  <SafeAreaView style={styles.safeAreaViewContainerAdd}>
                  <View style={{flexDirection: 'row',}}>
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
                              onChangeText={titleInp => {
                                 if(titleInp === "" ){
                                    setShowErrorTitle(true)
                                    setTitle("")
                                  }
                                  else{
                                    setShowErrorTitle(false) 
                                    setTitle(titleInp)
                                  }
                              }}
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
                              onChangeText={descript => {
                                if(descript === "" ){
                                    setShowErrorDesc(true)
                                    setDesc("")
                                  }
                                  else{
                                    setShowErrorDesc(false) 
                                    setDesc(descript)
                                  }
                              }}
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
                                      onConfirm={handleConfirmTimeStart}
                                      onCancel={hideDatePickerTimeStart}
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
                                onPress={() => {
                                    if(startTime !== null && endTime !== null && title !== "" && desc !== ""){
                                        if(route.params.item?.date_from === endDate){
                                            if(endTime < startTime){
                                                setShowErrorEndTimeAhead(true)
                                            }
                                            else{
                                                setShowErrorEndTimeAhead(false)
                                                setDialogBoxEdit(true)
                                            }
                                        }
                                        else{
                                          setShowErrorEndTimeAhead(false)
                                          setDialogBoxEdit(true)
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
                                        if(title === "" ){
                                          setShowErrorTitle(true)
                                        }
                                        else{
                                          setShowErrorTitle(false) 
                                        }
                                        if(desc === "" ){
                                          setShowErrorDesc(true)
                                        }
                                        else{
                                          setShowErrorDesc(false) 
                                        }
                                      }
                                }
                                }
                            />
                          </View>}
                      </View>

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
  card: {
    padding: 18,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
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
      paddingHorizontal: 20,
      paddingVertical: 10
  },
  safeAreaViewContainer: {
      padding: 20,
      flex: 1,

  },
  columnContainer: {
      flexDirection: 'column',
  },
  rowContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 8,
  },
  border: {
      borderBottomWidth: 0.8,
      borderBottomColor: '#EFF3F6',
      marginLeft: 55,
      marginRight: 20
  },
  titleStyle: {
      letterSpacing: 0.2,
      fontWeight: '800',
      color: '#0E2138',
      fontSize: 20,
      marginBottom: 10
  },
  tagStyle: {

      fontSize: 16,
      color: '#737A87',
      paddingHorizontal: 20
  },
  scheduleStyle: {

      fontSize: 16,
      color: '#737A87',
      paddingHorizontal: 20
  },
  textDetailsHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000'
  },
  carouselImg: {
      width: 380,
      height: 280,
      borderRadius: 10,
    
  },
  button: {
      borderRadius: 5,
      
    },
  editBtn: {
      marginTop: 10,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 5,
      backgroundColor: "#4482b8",
      padding: 10,
  },
  textFunc:{
      fontSize: 15,
      fontWeight: "bold",
      color: 'white'
  },
  delBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 5,
      backgroundColor: "#d4534a",
      padding: 10,
  },

  // Modal Design

   //MODAL DESIGN
   safeAreaViewContainerAdd: {
      padding: 10,
      flex: 1,
      backgroundColor: '#fff'
  },
  dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 18,
      backgroundColor: '#3a87ad',
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 20,
      paddingRight: 20
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
      marginHorizontal: 3,
      marginBottom: 10,
  },
  textTitle: {
      fontSize: 20,
      fontWeight: '700',
      padding: 5,
      color: 'white',
  },

  //ALERT
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
});

export default memo(EditSchedule);