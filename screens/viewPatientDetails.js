import React, { useState, useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, Text, Image, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import AppBar from './ReusableComponents/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon5 from 'react-native-vector-icons/FontAwesome5';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import moment from 'moment';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { AccordionList } from "accordion-collapse-react-native";
import { Separator } from 'native-base';
import { List,DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import LoaderFullScreen from './ReusableComponents/LottieLoader-FullScreen';
import LottieView from 'lottie-react-native';
import { id } from 'date-fns/locale';

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};
const blue_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3a87ad',
        accent: '#f1c40f',
    },
};
const white_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#fff',
        accent: '#f1c40f',
    },
};
const green_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#81c784',
        accent: '#f1c40f',
    },
};


const ViewPatientDetails = ({ route }) => {

    const [patientDetails, setPatientDetails] = useState([]);
    // const [cases, setCases] = useState([{case_id: 1, notes: 'notes 1', type: 'type 1'}, {case_id: 2, notes: 'notes 2', type: 'type 2'}, {case_id: 3, notes: 'notes 3', type: 'type 3'}, {case_id: 4, notes: 'notes 4', type: 'type 4'} , {case_id: 5, notes: 'notes 5', type: 'type 5'} , {case_id: 6, notes: 'notes 6', type: 'type 6'}, {case_id: 7, notes: 'notes 7', type: 'type 7'}, {case_id: 9, notes: 'notes 9', type: 'type 8'}]);
    const [cases, setCases] = useState();
    const [messageBoard, setMessageBoard] = useState([]);
    const [messageHtml, setMessageHtml] = useState([]);
    const [theme, setTheme] = useState(black_theme);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Information' },
        { key: 'second', title: 'Cases' },
    ]);

    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);
    const [loader, setLoader] = useState(true);

    const layout = useWindowDimensions();

    useEffect(() => {

        const getPatientDatails = async () => {
            const token = await AsyncStorage.getItem('token');
            // console.log(token, "token");
            await fetch('https://beta.centaurmd.com/api/patient-details/' + route.params.data?.lead_id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(res => res.json())
                .then(resData => {

                    setPatientDetails(resData);
                    setCases(resData.cases)
                    setLoader(false)
                });



        }



        const messageBoardDatails = async () => {
            const token = await AsyncStorage.getItem('token');
           
            await fetch('https://beta.centaurmd.com/api/patient/case/2', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(res => res.json())
                .then(resData => {

                    const decodedHtml = resData.map(obj =>
                        obj.category === "logs"  ? { ...obj, message_html: JSON.parse(obj.message_html) } : obj.category === "action" || obj.category === "email" ? { ...obj, message: JSON.parse(obj.message) } : obj
                    );

                    const filteredMessageBoard = decodedHtml.filter(item => item.category !== "logs");

                    console.log("DECODED: ",filteredMessageBoard[filteredMessageBoard.length - 1])

                    setMessageBoard(filteredMessageBoard)




                });

        }
        // console.log('message board: ', messageBoard)
        getPatientDatails();
        messageBoardDatails();

    }, []);

    const InformationRoute = () => (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.body}>

                    <View style={styles.detailsColumnContainer}>
                        {/* <FAIcon5 name="birthday-cake" size={20} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>BIRTHDAY</Text>
                        <Text style={styles.textColDetails}>{moment(patientDetails.birthday).format('ll')}</Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <Icon name="human-male-height" size={20} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>HEIGHT</Text>
                        <Text style={styles.textColDetails}>{patientDetails.height}</Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <Icon name="weight" size={20} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>WEIGHT</Text>
                        <Text style={styles.textColDetails}>{patientDetails.weight} lbs </Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <EntypoIcon name="location-pin" size={23} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>LOCATION</Text>
                        <Text style={styles.textColDetails}>{patientDetails.city}, {patientDetails.state}, {patientDetails.country}</Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <EntypoIcon name="location-pin" size={23} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>SURGEON</Text>
                        <Text style={styles.textColDetails}>{patientDetails.surgeon}</Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <EntypoIcon name="location-pin" size={23} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>ETHNICITY</Text>
                        <Text style={styles.textColDetails}>{patientDetails.ethnicity}</Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <EntypoIcon name="location-pin" size={23} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>PREFFERED METHOD</Text>
                        <Text style={styles.textColDetails}>{patientDetails.preferred_method}</Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <EntypoIcon name="location-pin" size={23} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>HOW DID YOU HEAR US?</Text>
                        <Text style={styles.textColDetails}>{patientDetails.how_did_hear}</Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <EntypoIcon name="location-pin" size={23} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>COMMENTS</Text>
                        <Text style={styles.textColDetails}>{patientDetails.comments}</Text>
                    </View>
                    <View style={styles.detailsColumnContainer}>
                        {/* <EntypoIcon name="location-pin" size={23} color="#da7331" /> */}
                        <Text style={styles.textBigDetails}>PAST SURGERY</Text>
                        <Text style={styles.textColDetails}>{patientDetails.past_surgery}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );




    const CasesRoute = () => (
        <View style={styles.casesContainer} >


            {
                cases.map((cases, index) => {
                    return <ScrollView key={index}>
                        <PaperProvider theme={theme}>
                            <List.Accordion
                                key={index}
                                title={cases.case_id}
                                style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, backgroundColor: '#D9DEDF'}}
                                expanded="true"
                            >

                                <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2 }}>
                                    <View style={{ padding: 10, backgroundColor: '#fff', borderWidth: 1, marginHorizontal: 10, marginBottom: 10, borderRadius: 6, borderColor: '#e3e3e3' }}>
                                        <Text style={{ color: 'black', fontSize: 16 }}>{cases.type}</Text>
                                        <Text style={{ fontSize: 14, color: 'black' }}>{cases.notes}</Text>
                                    </View>

                                    <View style={{ padding: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 16, marginBottom: 10}}>Message board</Text>
                                        {
                                            messageBoard.map((mb, index) => {
                                                return <>

                                                {
                                                    mb.subject === "Set Reminder" &&  mb.category === "logs" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#2A2B2F', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#2A2B2F', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Title:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Description:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date From:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time To:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date To:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time To:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Reschedule:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#2A2B2F', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message_html?.title}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.description}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{moment(mb.message_html?.date_from).format('ll')}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.time_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{moment(mb.message_html?.date_to).format('ll')}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.time_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.reschedule}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Set Reminder" &&  mb.category === "action" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#2A2B2F', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#2A2B2F', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Title:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Description:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date From:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time To:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date To:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time To:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Reschedule:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message?.title}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.description}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{moment(mb.message?.date_from).format('ll')}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.time_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{moment(mb.message?.date_to).format('ll')}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.time_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.reschedule}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Assign Case" &&  mb.category === "logs" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#3a87ad', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Title:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Notes:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Assigned to:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message_html?.title}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.notes}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.assigned_to}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Assign Case" &&  mb.category === "action" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#3a87ad', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Title:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Notes:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Assigned to:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message?.title}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.notes}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.assigned_to}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Booked Procedure" &&  mb.category === "logs" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#3a87ad', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date From:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time from:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date to:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time to:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Surgeon:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Location:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Proceures:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Procedure Deccription:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message_html?.date_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.time_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.date_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message_html?.time_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.surgeon}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.location}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.procedures}&nbsp;</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.procedure_description}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Booked Procedure" &&  mb.category === "action" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#3a87ad', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date From:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time from:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date to:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time to:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Surgeon:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Location:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Proceures:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Procedure Deccription:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message?.date_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.time_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.date_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message?.time_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.surgeon}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.location}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.procedures}&nbsp;</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.procedure_description}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Booked Consult" &&  mb.category === "logs" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#3a87ad', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date From:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time from:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date to:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time to:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Surgeon:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Location:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Proceures:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Procedure Description:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message_html?.date_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.time_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.date_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message_html?.time_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.surgeon}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.location}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.procedures}&nbsp;</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.procedure_description}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Booked Consult" &&  mb.category === "action" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#3a87ad', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date From:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time from:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Date to:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time to:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Surgeon:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Location:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Proceures:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Procedure Description:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message?.date_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.time_from}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.date_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message?.time_to}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.surgeon}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.location}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.procedures}&nbsp;</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.procedure_description}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Received Info" &&  mb.category === "action" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#5EA93D', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#5EA93D', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>First name:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Last name:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Birthday:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Gender:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Height:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Weight:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Country:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>State:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>City:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Contact number:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Email address:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Preffered method:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Ethnicity:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Surgeon:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Location:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>How did hear:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Procedures:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Past surgery:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time frame:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Comments:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Reschedule:</Text>
                                                                    </View>
                                                                   
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#5EA93D', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.first_name}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.last_name}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.birthday}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.gender}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.height}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.weight}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.country}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.state}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.city}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.contact_number}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>{mb.message?.email_address}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}} >
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.preferred_method}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.ethnicity}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.surgeon}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.location}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.how_did_hear}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.procedures}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.past_surgery}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.time_frame}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.comments}:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.reschedule}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Received Info" &&  mb.category === "logs" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#5EA93D', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#5EA93D', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>First name:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Last name:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Birthday:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Gender:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Height:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Weight:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Country:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>State:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>City:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Contact number:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Email address:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Preffered method:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Ethnicity:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Surgeon:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Location:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>How did hear:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Procedures:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Past surgery:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Time frame:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Comments:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Reschedule:</Text>
                                                                    </View>
                                                                   
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#5EA93D', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.first_name}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.last_name}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.birthday}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.gender}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.height}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.weight}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.country}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.state}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.city}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.contact_number}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>{mb.message_html?.email_address}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}} >
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.preferred_method}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.ethnicity}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.surgeon}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.location}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.how_did_hear}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.procedures}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.past_surgery}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.time_frame}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.comments}:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.reschedule}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Other" &&  mb.category === "action" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#3a87ad', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Type:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Notes:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#3a87ad', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message?.type}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.notes}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Other" &&  mb.category === "logs" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#3a87ad', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#e3e3e3', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Type:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Notes:</Text>
                                                                    </View>
                                                                    
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#e3e3e3', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb?.message_html?.type}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.notes}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Received Inquiry" &&  mb.category === "logs" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#5EA93D', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#e3e3e3', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>First Name:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Last Name:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Email address:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Contact number:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Message:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Location:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Newsletter:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Source:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Linkform:</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#e3e3e3', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.first_name}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.last_name}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.email_address}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.contact_number}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.message}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.location}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.newsletter}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.source}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message_html?.linkform}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    mb.subject === "Received Inquiry" &&  mb.category === "email" ?
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" color='#fff'/>}
                                                        description="Rodel Cabil"
                                                        titleStyle={{color: '#fff'}}
                                                        descriptionStyle={{color: '#fff'}}
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left',backgroundColor: '#5EA93D', }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 5, backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, borderRadius: 6, flexDirection:'row', justifyContent:'space-between' }}>
                                                                <View style={{flexDirection: 'column', width: 120,}}>
                                                                    <Text style={{ color: '#5EA93D', fontSize: 16, fontWeight: 'bold', backgroundColor: '#D9DEDF', padding: 5 }}>FIELD NAME</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>First Name:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Last Name:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Email address:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>Contact number:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Message:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Location:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Newsletter:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Source:</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>Linkform:</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={{flexDirection: 'column', width: 210, }}>
                                                                    <Text style={{ color: '#5EA93D', fontSize: 16, fontWeight: 'bold',backgroundColor: '#D9DEDF', padding: 5 }}>FIELD VALUE</Text>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.first_name}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.last_name}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>{mb.message?.email_address}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>{mb.message?.contact_number}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.message}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.location}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.newsletter}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }}>{mb.message?.source}</Text>
                                                                    </View>
                                                                    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#D9DEDF'}}>
                                                                        <Text style={{ color: '#7E7E7E', fontSize: 16, paddingVertical: 5 }} numberOfLines={1}>{mb.message?.linkform}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                    :
                                                    <>
                                                    <List.Accordion
                                                        key={index}
                                                        title={mb.subject}
                                                        left={props => <List.Icon {...props} icon="folder" />}
                                                        description="Rodel Cabil"
                                                        style={{ borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left' }}>
                                                        <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                                            <View style={{ marginLeft: -55, padding: 10, backgroundColor: '#fff', borderWidth: 1, marginHorizontal: 10, marginBottom: 10, borderRadius: 6, borderColor: '#e3e3e3' }}>
                                                                <Text style={{ color: 'black', fontSize: 16 }}>{mb.message_html === null ? "null" : mb.message_html.first_name}</Text>
                                                            </View>
                                                        </View>
                                                    </List.Accordion>
                                                    <View style={{ marginBottom: 5 }} />
                                                    </>
                                                }
                                                   
                                                </>
                                            })
                                        }
                                    </View>
                                </View>
                            </List.Accordion>
                        </PaperProvider>
                        <View style={{ marginBottom: 5 }} />
                    </ScrollView>
                })
            }


        </View>
    );




    const renderScene = SceneMap({
        first: InformationRoute,
        second: CasesRoute,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#da7331' }}
            style={{ backgroundColor: '#fff', }}
            renderLabel={({ route }) => (
                <Text style={{ color: 'black', margin: 8, textTransform: 'uppercase' }}>
                    {route.title}
                </Text>
            )}
        />
    );


    return (
        <View style={styles.container}>
            <AppBar title={"Patient Details"} showMenuIcon={true} />
            {loader === true ? <LoaderFullScreen /> :
                <>
                    <View style={styles.body}>
                        <View style={styles.rowContainer}>
                            <Text style={styles.textName}>{patientDetails.first_name} {patientDetails.last_name}</Text>
                        </View>
                        <View style={styles.detailsContainer}>
                            <Icon name="email" size={20} color="#da7331" />
                            <Text style={styles.textDetails}>{patientDetails.email_address}</Text>
                        </View>
                        <View style={styles.detailsContainer}>
                            <EntypoIcon name="phone" size={20} color="#da7331" />
                            <Text style={styles.textDetails}>{patientDetails.contact_number}</Text>
                        </View>

                    </View>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    />
                </>
            }
        </View>

    )
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "Poppins",

    },
    casesContainer: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "Poppins",
        padding: 10
    },

    body: {
        padding: 20,
        flexDirection: 'column'

    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    detailsContainer: {
        paddingTop: 15,

        flexDirection: 'row',
        alignItems: 'center',

    },
    detailsColumnContainer: {
        flexDirection: 'column',
        borderBottomWidth: 0.6,
        borderColor: '#e2e2e2',
        paddingVertical: 10,
    },
    textName: {
        fontSize: 22,
        color: '#0E2138',
        fontWeight: 'bold',
        textTransform: 'uppercase',

    },
    circleBlue: {

        marginRight: 10,
        height: 10,
        width: 10,
        borderRadius: 15,
        backgroundColor: "#da7331",
    },
    textDetails: {
        marginLeft: 20,
        color: '#000',
        fontSize: 16,
        fontWeight: '400'
    },
    textColDetails: {

        color: '#000',
        fontSize: 18,
        fontWeight: '400'
    },
    textBigDetails: {
        color: '#737A87',
        fontSize: 13,
        fontWeight: '400',
        marginBottom: 3
    },
    historyWrapper: {
        paddingTop: 20,
        flexDirection: 'column',

    },
    historyContainer: {
        backgroundColor: "#da7331",
        borderRadius: 5,
        padding: 10,
        flexDirection: 'column',
    },
    textHistory: {
        fontSize: 16,
        color: '#0E2138',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    caseTitle: {
        color: '#fff',
        fontSize: 16
    },
});

export default ViewPatientDetails