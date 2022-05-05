import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView,Button, ActivityIndicator, TouchableHighlight, Modal, TouchableOpacity } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Form, FormItem, Label } from 'react-native-form-component';
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

var width = Dimensions.get('window').width;

const ViewSchedule = ({ route, navigation }) => {
    const [carouselItem, setCarouselItem] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [consultDetails, setConsulttDetails] = useState([]);
    const [imgLoading, setImgLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [titleGC, setTitleGC] = useState(route.params.item?.title);
    const [desceGC, setDescGC] = useState(route.params.item?.description);
    const [timefromGC, setTimeFromGC] = useState(moment(route.params.item?.time_from, ["HH.mm"]).format("hh:mm A"));
    const [timeToGC, setTimeToGC] = useState(moment(route.params.item?.time_to, ["HH.mm"]).format("hh:mm A"));

    useEffect(()=>{
        console.log(route.params.item);

        const geConsultFormData = async () => {
            setImgLoading(true);
            const token = await AsyncStorage.getItem('token');
            console.log(token, "token");
            await fetch('https://beta.centaurmd.com/api/consult-info/'+ route.params.item?.id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(res => res.json())
                .then(resData => {
                    let arrayImages = [];

                    console.log("CONSULT FORM DETAILS", resData);
                    arrayImages.push(resData.front_photo);
                    arrayImages.push(resData.right_side_photo);
                    arrayImages.push(resData.left_side_photo);


                    setCarouselItem(arrayImages);
                    setImgLoading(false)
                    
                });
        }

        geConsultFormData();
    }, []);

    const renderItem = ({ item, index }) => {
        return (
            <Image
                key={index}
                style={styles.carouselImg}
                source={{
                    uri: item,
                }}
            />
        )
    }

    const [dialogBox, setDialogBox] = useState(false);

    const deleteEvent = async () => {
        const resp = await axios.delete(
          `https://www.googleapis.com/calendar/v3/calendars/${route.params.email}/events/${route.params.item?.googleEventId}?access_token=${route.params.accessToken}`
        );
        setDialogBox(false);
        alert("Deleted Successfully");
        navigation.navigate('Calendar');

    }


    
    const AddSchedModal = () => {
        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
        const [isDatePickerVisibleStart, setDatePickerVisibilityStart] = useState(false);
        const [isDatePickerTimeVisible, setDatePickerTimeVisibility] = useState(false);
    
        const [title, setTitle] = useState(route.params.item?.title);
        const [desc, setDesc] = useState(route.params.item?.description);
        const [endDate, setEndDate] = useState(route.params.item?.date_to);
        const [startTime, setStartTime] = useState(moment(route.params.item?.time_from, ["HH.mm"]).format("hh:mm"));
        const [endTime, setEndTime] = useState(moment(route.params.item?.time_to, ["HH.mm"]).format("hh:mm"));
        const [datePickerTitle, setdatePickerTitle] = useState( route.params.item?.date_to);
        const [datePickerTitleTime, setdatePickerTitleTime] = useState(moment(route.params.item?.time_from, ["HH.mm"]).format("hh:mm A"));
        const [datePickerTitleTimeStart, setdatePickerTitleTimeStart] = useState(moment(route.params.item?.time_to, ["HH.mm"]).format("hh:mm A"));
    
        const [addLoader, setAddLoader] = useState(false);

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
        
            //console.log(resp.data);
        
            if (resp.status === 200) {
                 setTimeFromGC(startTime);
                 setTimeToGC(endTime);
                 setTitleGC(title);
                 setDescGC(desc);
                 setShowModal(false)
                 setAddLoader(false);
                 alert("Edit Successfully");
                 navigation.navigate('Calendar');
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
                        source={require('../assets/calendar.png')}
                    />
                    <Text style={styles.textTitle}>Date - {route.params.item?.date_from} </Text>
                </View>
                <ScrollView style={styles.safeAreaViewContainerAdd}>
                    <SafeAreaView style={styles.safeAreaViewContainerAdd}>
                        <Form onButtonPress={() => {
                        <Dialog
                            visible={dialogBox}
                            width={400}
                            footer={
                            <DialogFooter>
                                <DialogButton
                                text="CANCEL"
                                onPress={() => {
                                    setDialogBox(false);
                                }}
                                />
                                <DialogButton text="OK" onPress={create()} />
                            </DialogFooter>
                            }
                        >
                            <DialogContent>
                            <Text>Are you sure?</Text>
                            </DialogContent>
                        </Dialog>
                        }}
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
            <AppBar title={route.params.item?.category === "consults" ||  route.params.item?.category === "procedures" ?  route.params.item?.procedures :  titleGC} showMenuIcon={true} />
            <ScrollView>
            <View style={{ paddingHorizontal: 20, paddingTop: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                { route.params.item?.category !== "consults" ? <></> :
               
                <View style={{ height: 340, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>

                {imgLoading === true ? <ActivityIndicator size="large" animating={true}/>
                :
                <>
                    <Carousel
                        layout={"default"}
                        //   ref={ref => carousel = ref}
                        data={carouselItem}
                        sliderWidth={380}
                        itemWidth={380}
                        renderItem={renderItem}
                        onSnapToItem={index => setActiveIndex(index)} />

                    <Pagination
                        dotsLength={carouselItem.length}
                        activeDotIndex={activeIndex}
                        containerStyle={{ backgroundColor: 'transparent', marginTop: -15 }}
                        dotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,

                            backgroundColor: 'rgba(0, 0, 0, 0.75)'
                        }}
                        inactiveDotStyle={{
                            // Define styles for inactive dots here
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        />
                    </>
                            }
                            </View>
                        }
                </View>
               
                {/* <SafeAreaView style={{ paddingHorizontal: 20, paddingTop: 20, color: '# 0E2138' }}>
                    <Text style={styles.textDetailsHeader}>Details</Text>
                </SafeAreaView> */}
                <SafeAreaView style={styles.safeAreaViewContainer}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 10,
                            marginTop: -30
                        }}>
                        {route.params.item?.category === "reminder" ?
                            <>
                                <View style={styles.columnContainer}>
                                    <Text style={styles.titleStyle}>{route.params.item?.title}</Text>
                                    <View style={styles.rowContainer}>
                                        <Icon name="information" size={23} color="#3a87ad" />
                                        <Text style={styles.tagStyle}>{route.params.item?.description}</Text>
                                    </View>
                                        <View style={styles.border} />
                                    <View style={styles.rowContainer}>
                                        <Icon name="calendar" size={23} color="#3a87ad" />
                                        <Text style={styles.scheduleStyle}>{route.params.item?.time_from} - {route.params.item?.time_to}</Text>
                                    </View>
                                    
                                </View>
                            </>
                            :
                            route.params.item?.category === "consults" ?
                                <>
                                    <View style={styles.columnContainer}>
                                        <Text style={styles.titleStyle}>{route.params.item?.procedures}</Text>
                                        <View style={styles.rowContainer}>
                                            <Icon name="information" size={23} color="#da7331" />
                                            <Text style={styles.tagStyle}>{route.params.item?.notes}</Text>
                                        </View>
                                       
                                        <View style={styles.rowContainer}>
                                            <Icon name="calendar" size={23} color="#da7331" />
                                            <Text style={styles.scheduleStyle}>{route.params.item?.time_from} - {route.params.item?.time_to}</Text>
                                        </View>
                                        
                                        <View style={styles.rowContainer}>
                                            <EntypoIcon name="location-pin" size={23} color="#da7331" />
                                            <Text style={styles.scheduleStyle}>{route.params.item?.location}</Text>
                                        </View>
                                       
                                        <View style={styles.rowContainer}>
                                            <FontistoIcon name="doctor" size={23} color="#da7331" />
                                            <Text style={styles.scheduleStyle}>{route.params.item?.surgeon}</Text>
                                        </View>
                                        <View style={{marginTop: 10}}>
                                            <Button
                                                style={styles.button}
                                                title="VIEW PATIENT DETAILS"
                                                color="#da7331"
                                                accessibilityLabel="Learn more about this purple button"
                                                onPress={()=>{
                                                    navigation.navigate('View Patient Details', {
                                                        data: route.params.item,
                                                      
                                                    });
                                                }}
                                            />
                                       </View>
                                    </View>
                                </>
                                :

                                route.params.item?.category === "procedures" ?
                                    <>
                                        <View style={styles.columnContainer}>
                                            <Text style={styles.titleStyle}>{route.params.item?.procedures}</Text>
                                            <View style={styles.rowContainer}>
                                                <Icon name="information" size={23} color="#ffc000" />
                                                <Text style={styles.tagStyle}>{route.params.item?.procedure_description}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#ffc000" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.time_from} - {route.params.item?.time_to}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <EntypoIcon name="location-pin" size={23} color="#ffc000" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.location}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <FontistoIcon name="doctor" size={23} color="#ffc000" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.surgeon}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="account-group" size={23} color="#ffc000" />
                                                <Text style={styles.scheduleStyle}>{route.params.item?.ethnicity}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                {route.params.item?.gender === "male" ? <Icon name="gender-male" size={25} color="#ffc000" /> : <Icon name="gender-female" size={25} color="#ffc000" />}
                                                <Text style={styles.scheduleStyle}>{route.params.item?.gender}</Text>
                                            </View>
                                        </View>
                                    </>
                                    :

                                    <>
                                        <View style={styles.columnContainer}>
                                            <Text style={styles.titleStyle}>{titleGC}</Text>
                                            <View style={styles.rowContainer}>
                                                <Icon name="information" size={23} color="#81c784" />
                                                <Text style={styles.tagStyle}>{desceGC}</Text>
                                            </View>
                                            <View style={styles.border} />
                                            <View style={styles.rowContainer}>
                                                <Icon name="calendar" size={23} color="#81c784" />
                                                <Text style={styles.scheduleStyle}>{timefromGC} - {timeToGC}</Text>
                                            </View>
                                                {route.params.item?.googleCalendar === true ?
                                                    <View>
                                                        <TouchableHighlight onPress={() => setShowModal(true)}>
                                                            <View style={styles.editBtn}>
                                                                <Icon name="calendar-edit" size={20} color="white" style={{ marginRight: 5 }} />
                                                                <Text style={styles.textFunc}>EDIT</Text>
                                                            </View>
                                                        </TouchableHighlight>

                                                        <TouchableHighlight onPress={() => setDialogBox(true)}>
                                                            <View style={styles.delBtn}>
                                                                <Icon name="delete-outline" size={20} color="white" style={{ marginRight: 5 }} />
                                                                <Text style={styles.textFunc}>DELETE</Text>
                                                            </View>
                                                        </TouchableHighlight>

                                                        <Dialog
                                                            visible={dialogBox}
                                                            width={400}
                                                            footer={
                                                            <DialogFooter>
                                                                <DialogButton
                                                                text="CANCEL"
                                                                onPress={() => {
                                                                    setDialogBox(false);
                                                                }}
                                                                />
                                                                <DialogButton text="OK" onPress={deleteEvent} />
                                                            </DialogFooter>
                                                            }
                                                        >
                                                            <DialogContent style={{margin: 10,}}>
                                                            <View style={{alignItems: 'center'}}>
                                                                <Image
                                                                    source={require('../assets/calendar.png')}
                                                                    style={{height: 120, width: 120, marginVertical: 10}}
                                                                />
                                                                </View>
                                                             <Text style={{textAlign: 'center', fontSize: 15, fontWeight: "bold"}}>Are you sure you want to delete this schedule?</Text>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Modal
                                                            animationType={'slide'}
                                                            transparent={false}
                                                            visible={showModal}
                                                        >
                                                            <AddSchedModal/>
                                                        </Modal>
                                                    </View> :
                                                    <></>
                                                }

                                        </View>
                                    </>
                        }
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
});

export default ViewSchedule;