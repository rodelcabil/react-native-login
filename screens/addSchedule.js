import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TextInput, Button, Image, TouchableOpacity} from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import {Card, Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';


const AddSchedule = ({route}) =>{
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
   /* const [items, setItems] = useState([
        {label: 'Consults', value: 'consults'},
        {label: 'Procedures', value: 'procedures'},
        {label: 'Reminder', value: 'reminder'},
        {label: 'Other', value: 'other'},
    ]);*/

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleStart, setDatePickerVisibilityStart] = useState(false);
    const [isDatePickerTimeVisible, setDatePickerTimeVisibility] = useState(false);

    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);

    const [datePickerTitle, setdatePickerTitle] = useState(null);
    const [datePickerTitleTime, setdatePickerTitleTime] = useState(null);

    const [datePickerTitleTimeStart, setdatePickerTitleTimeStart] = useState(null);
    

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };

      const handleConfirm = (date) => {
        //console.warn("A date has been picked: ", date);
        setdatePickerTitle(moment(date).format("YYYY-MM-DD"))
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
        setdatePickerTitleTime( moment(convTime, ["HH.mm"]).format("hh:mm A"))
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
        setdatePickerTitleTimeStart( moment(convTime, ["HH.mm"]).format("hh:mm A"))
        hideDatePickerTimeStart();
      };

    return(
        <View style={styles.container}>
             <AppBar title={"Add Personal Schedule"} showMenuIcon={true}/>
             <View style={styles.dateContainer}>
             <Image
                style={styles.logoImg}
                source={require('../assets/calendar.png')}
              />
                 <Text style={styles.textTitle}>Date - {route.params.getdate}</Text>
             </View>
             <SafeAreaView style={styles.safeAreaViewContainer}>
            {/*
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                textStyle={{
                    fontSize: 15,
                }}
                style={{ borderColor: value === 'consults' ? '#da7331' : value === 'procedures' ? '#ffc000' :  value === 'reminder' ? '#3a87ad' : value === 'other' ? '#81c784' :  '#fff', 
                    borderWidth: 2}}
             />
            */} 
            <Text style={styles.text}>Title</Text>
            <TextInput
                    style={styles.inputContainer}
                    keyboardType="email-address"
                    multiline={true}
                    onChangeText={titleInp => setTitle(titleInp)}
            />

            <Text style={styles.text}>Description</Text>
            <TextInput
                    style={styles.inputContainer}
                    keyboardType="email-address"
                    multiline={true}
                    onChangeText={descript => setDesc(descript)}
            />

                <View style={styles.columnContainer}>
                <Text style={styles.text}>End Date</Text>
                    <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={showDatePicker}
                    >
                    <View style={styles.inputContainer2}>
                        <Text style={styles.text2}>{datePickerTitle === null ? "Show Date Picker" : datePickerTitle}</Text>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                </TouchableOpacity>
                </View>


                <View style={styles.columnContainer}>
                    <Text style={styles.text}>Start Time</Text>
                    <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={showDatePickerTimeStart}
                    >
                    <View style={styles.inputContainer2}>
                        <Text style={styles.text2}>{datePickerTitleTimeStart === null ? "Show Time Picker" : datePickerTitleTimeStart}</Text>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisibleStart}
                            mode="time"
                            onConfirm={handleConfirmTimeStart}
                            onCancel={hideDatePickerTimeStart}
                        />
                    </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.columnContainer}>
                    <Text style={styles.text}>End Time</Text>
                    <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={showDatePickerTime}
                    >
                    <View style={styles.inputContainer2}>
                        <Text style={styles.text2}>{datePickerTitleTime === null ? "Show Time Picker" : datePickerTitleTime}</Text>
                        <DateTimePickerModal
                            isVisible={isDatePickerTimeVisible}
                            mode="time"
                            onConfirm={handleConfirmTime}
                            onCancel={hideDatePickerTime}
                        />
                    </View>
                    </TouchableOpacity>
                </View>


            <View style={styles.buttonCont}>
            <Button
                  title="Add"
                  color="#28A745"

            />
            </View>

             </SafeAreaView>
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
        marginVertical: 2,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 15,
        alignItems: 'center',
        fontSize: 13,
        backgroundColor: 'white',
        marginBottom: 15,
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
        marginBottom: 15,
        flexDirection: 'row',
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
        backgroundColor: '#F2F4F5'
    },
    columnContainer:{
        flexDirection: 'column',
       
    },
    rowContainer:{
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
    
    text:{
        marginHorizontal: 10,
        fontSize: 15,
        fontWeight: '400',
    },
    text2:{
        fontSize: 15,
        fontWeight: '400',
        alignSelf: 'center',
        marginHorizontal: 15,
    },
    textTitle:{
        fontSize: 18,
        fontWeight: '700',
        padding: 5,
        color: 'white',
    },
    buttonCont:{
        marginHorizontal: 5,
        marginTop: 30,
    },
    buttonDate:{
        marginHorizontal: 5,
        marginTop: 10,
    },
    logoImg: {
        width: 50,
        height: 50,
        marginRight: 10,
        resizeMode: 'contain',
    },
});

export default AddSchedule;