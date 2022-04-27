/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Image, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { Card, Avatar, Button } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import AppBar from '../../ReusableComponents/AppBar';
import { showNotification, handleScheduleNotification, handleCancel } from '../../ReusableComponents/notification.android'
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { FloatingAction } from "react-native-floating-action";
import { Dimensions } from "react-native";
import DoubleClick from 'react-native-double-tap';
import { addDays, format } from 'date-fns';
import { Form, FormItem, Label } from 'react-native-form-component';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { CalendarApiClient } from "google-calendar-api-client";


var width = Dimensions.get('window').width - 20;

const Calendar = ({ navigation, route }) => {

    const [items, setItems] = useState({});
    const [tempItems, setTempItems] = useState([]);

    const [mergeItems, setMergeItems] = useState([]);

    const [dayGet, setDay] = useState(null);

    const [deviceID, setDeviceID] = useState();

    const [showModal, setShowModal] = useState(false);

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
        setStartTime(moment(convTime, ["HH.mm"]).format("hh:mm"));
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
        setEndTime(moment(convTime, ["HH.mm"]).format("hh:mm"));
        hideDatePickerTimeStart();
    };

    

    // const [dummy, setDummy] = useState({
    //     '2022-03-20': [{ event: 'Schedule title 1', tag: {name:['Dr. Al', 'Dr. Jay Ar']}, schedule: '12nn - 1pm', category: 'consults' }],
    //     '2022-04-20': [
    //         { event: 'Schedule Title 2', tag: {name:['Dr. Jim',  'Dr. Rodel']}, schedule: '12nn - 1pm', type: 'procedures' }, 
    //         { event: 'Schedule Title 2', tag: {name:['Dr. Jim',  'Dr. Rodel']}, schedule: '12nn - 1pm', type: 'other' }
    //     ], 
    //     '2022-04-21': [{ event: 'Schedule Title 3', tag: {name:['Dr. Al',  'Dr. Jim']}, schedule: '12nn - 1pm', category: 'reminder' }],
    //     '2022-04-21': [{ event: 'Schedule Title 3', tag: {name:['Dr. Al',  'Dr. Jim']}, schedule: '12nn - 1pm', category: 'others' }],
    //     '2022-04-22': [{ event: 'Schedule Title 4', tag: {name:['Dr. Rodel', 'Dr. Jay Ar']}, schedule: '12nn - 1pm', category: 'consults' }],
    //     '2022-04-23': [{ event: 'Schedule Title 5', tag: {name:['Dr. Jay Ar', 'Dr. Jim']}, schedule: '12nn - 1pm', category: 'other' }],
    //     '2022-04-23': [{ event: 'Schedule Title 6', tag: {name:['Dr. Jay Ar', 'Dr. Jim']}, schedule: '12nn - 1pm', category: 'other' }],
    // });

    

    const submitSched = (title, desc, endDate, startTime, endTime, dayGet) => {
        console.log(title, desc, endDate, startTime, endTime, "Others", dayGet);
        const convDate = moment(dayGet).format('YYYY-MM-DD');

        const newSet = {};
        Object.keys(items).forEach((key) =>{
            console.log(items[convDate] === convDate );
            if(items[key] === convDate ){
                newSet[convDate] =  {[convDate] : [{ title: title, description: desc, date_from: dayGet, time_from: startTime, date_to: endDate, time_to: endTime, category: "Others" }]} 
                 setItems(newSet);
                 console.log("dsadasdas11");
            }
            else{
                const newElement = {
                    ...items,
                    [convDate] : [{ title: title, description: desc, date_from: dayGet, time_from: startTime, date_to: endDate, time_to: endTime, category: "Others" }] 
                 }
                 setItems(newElement);
                 
                 console.log("dsadasdas22");
            }
        })

        console.log(items);
    
        /*
                        const newElement = {
                    ...items,
                    [convDate] : [{ title: title, description: desc, date_from: dayGet, time_from: startTime, date_to: endDate, time_to: endTime, category: "Others" }] 
                 }
                 setItems(newElement);
                 
                 console.log("dsadasdas22"); */
    
    };

    /*useEffect(()=>{
        const getDeviceID = () => {
            var uniqueID = DeviceInfo.getUniqueId;
            setDeviceID(uniqueID); 
        }

        const getData = async () =>{
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
                console.log(resData);
                const newItem = {};
                Object.keys(resData).forEach((key) =>{
                    const dateget = moment(resData[key].start).format("YYYY-MM-DD");
                    newItem[dateget] = [resData[key]];
                })

        console.log("Items: ",items);

                setItems(newItem);
            });
        }
        
        getData()
        getDeviceID()
        console.log("Device ID", deviceID);
        console.log("Items: ",items);
    },[]);*/

    useEffect(() => {
        const getDeviceID = () => {
            var uniqueID = DeviceInfo.getUniqueId;
            setDeviceID(uniqueID);
        }

        const getData = async () => {
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


                });
        }
        console.log("ITEMS: ", items)
        getData()
        getDeviceID()
        console.log("Device ID", deviceID);
        console.log("Items: ", items);
    }, []);


    const getAllSchedules = async () => {
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


            });
    }
    componentDidMount = () =>{
        const newSet = [];
        let postsUrl = "https://www.googleapis.com/calendar/v3/calendars/camsberts26@gmail.com/events?key=AIzaSyCDHOhDOJglv7VRLP37-yskTXqjNflfej8"
        fetch(postsUrl)
            .then((response) => response.json())
            .then((responseData) => {
              console.log(responseData);
              console.log(responseData.items[0].start.dateTime);
              for (let i = 0; i < responseData.items.length; i++) {
                const date = moment(responseData.items[i].start.dateTime).format("YYYY-MM-DD");
                const timeStart = moment(responseData.items[i].start.dateTime).format("HH:mma");
                const dateEnd = moment(responseData.items[i].end.dateTime).format("YYYY-MM-DD");
                const timeEnd = moment(responseData.items[i].end.dateTime).format("HH:mma");
                const title = (responseData.items[i].summary);
                const description = (responseData.items[i].description);

                console.log(responseData.items[i].start.dateTime);
                console.log(newSet[date], "dateeeeeee");

                newSet.push( { [date] : [{ title: title, description: description, date_from: date, time_from: timeStart, date_to: dateEnd, time_to: timeEnd, category: "Others" }] })
                const output = Object.assign({}, ...newSet)
                
     
                const newElement = {
                    ...items, ...output
                 }
                 setItems(newElement);
                 console.log(output, "NEW SETTTTTTTTTTTTTTT");
              }
            })
            console.log(items)
    } 

    const renderDay = (day, item) => {
        return (
            moment(item.date_from).format('YYYY-MM-DD') !== dayGet ? <></> :
                <TouchableHighlight
                    style={{ margin: 10, width: width }}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                    onPress={() => {
                        navigation.navigate('View Schedule', {
                            item: item,
                        });
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
                                            <Text style={styles.scheduleStyle}>{item.time_from} - {item.time_to}</Text>
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
                                                <Text style={styles.scheduleStyle}>{item.time_from} - {item.time_to}</Text>
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
                                                    <Text style={styles.scheduleStyle}>{item.time_from} - {item.time_to}</Text>
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
                                                    <Text style={styles.scheduleStyle}>{item.time_from} - {item.time_to}</Text>
                                                </View>
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
    };

    return (
        <View style={styles.container}>
            {/* <AppBar title={"My Schedule"} showMenuIcon={false} /> */}
            {/* <Button title="Sync Google Calendar" onPress={componentDidMount} titleStyle={styles.text2} style={styles.buttonCont}></Button> */}
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
                onPress={() => {
                    setShowModal(!showModal)
                }}
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
                onRequestClose={() => {

                }}
            >

                <View style={styles.container}>
                    <SafeAreaView>
                        <View style={styles.headerWrapper}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', fontFamily: 'Roboto' }}>
                                <Icon2 name="arrow-back" size={30} color="black" onPress={() => { setShowModal(!showModal) }} />
                                <Text style={{ marginLeft: 10, fontSize: 16, color: 'black' }}>Add Personal Schedule</Text>
                            </View>

                        </View>
                    </SafeAreaView>

                    <View style={styles.dateContainer}>
                        <Image
                            style={styles.logoImg2}
                            source={require('../../../assets/calendar.png')}
                        />
                        <Text style={styles.textTitle}>Date - {dayGet === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") : dayGet}</Text>
                    </View>

                    <SafeAreaView style={styles.safeAreaViewContainer}>
                        <Form onButtonPress={() => submitSched(title, desc, endDate, startTime, endTime, dayGet === null ? moment(new Date(Date.now())).format("YYYY-MM-DD") : dayGet)}
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
                                    <Text style={styles.text3}>{datePickerTitle === null ? "Show Date Picker" : datePickerTitle}</Text>
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
                                    <Text style={styles.text3}>{datePickerTitleTimeStart === null ? "Show Time Picker" : datePickerTitleTimeStart}</Text>
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
                                    <Text style={styles.text3}>{datePickerTitleTime === null ? "Show Time Picker" : datePickerTitleTime}</Text>
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
                    </SafeAreaView>
                </View>
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
    itemContainer: {
        marginTop: 17,
        marginRight: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    cardContainer: {

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
        padding: 20,
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
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    text3: {
        fontSize: 15,
        fontWeight: '400',
        alignSelf: 'center',
        marginHorizontal: 15,
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
    buttonCont: {
        marginHorizontal: 5,
        marginTop: 10,
        backgroundColor: '#81c784',
        color: '#fff'
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
        fontSize: 18,
        fontWeight: '700',
        padding: 5,
        color: 'white',
    },
});

export default Calendar;