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
import { List } from 'react-native-paper';

import LottieView from 'lottie-react-native';

const ViewPatientDetails = ({ route }) => {

    const [patientDetails, setPatientDetails] = useState([]);
    // const [cases, setCases] = useState([{case_id: 1, notes: 'notes 1', type: 'type 1'}, {case_id: 2, notes: 'notes 2', type: 'type 2'}, {case_id: 3, notes: 'notes 3', type: 'type 3'}, {case_id: 4, notes: 'notes 4', type: 'type 4'} , {case_id: 5, notes: 'notes 5', type: 'type 5'} , {case_id: 6, notes: 'notes 6', type: 'type 6'}, {case_id: 7, notes: 'notes 7', type: 'type 7'}, {case_id: 9, notes: 'notes 9', type: 'type 8'}]);
    const [cases, setCases] = useState();
    const [messageBoard, setMessageBoard] = useState([]);
    const [messageHtml, setMessageHtml] = useState([]);
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
            let caseID = [];
            // for (var i = 0; i < cases.length; i++) {
            //     caseID.push(cases[i].id)
            // }
            // console.log('CASE ID: ', caseID)
    
            await fetch('https://beta.centaurmd.com/api/patient/case/' + route.params.data?.id , {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }).then(res => res.json())
                .then(resData => {
    
                    setMessageBoard(resData)
                    setMessageHtml(JSON.parse(resData.message_html))
    
                });
    
        }

        console.log('message board: ', messageBoard)
        getPatientDatails();
        messageBoardDatails();

    }, []);


   




    const Loader = () => {
        return (
            <View style={styles.loaderContainer}>
                <LottieView
                    source={require('../assets/lottie.json')}
                    autoPlay loop
                />

            </View>
        )
    }

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



    const header = (item) => {
        return (
            <View >
                <Separator style={{ backgroundColor: '#da7331', height: 50, paddingHorizontal: 10, borderWidth: 0.6, borderColor: '#e3e3e3', marginTop: 2, borderRadius: 5 }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                        <Text style={{ color: '#fff', fontSize: 16, paddingVertical: 10 }}>{item.case_id}</Text>
                    </View>
                </Separator>

            </View>


        );
    }


    const accordionBody = (item) => {
        return (
            <>
                <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 2, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2 }}>
                    <View style={{ padding: 10, backgroundColor: '#fff', borderWidth: 1, marginHorizontal: 10, marginBottom: 10, borderRadius: 6, borderColor: '#e3e3e3' }}>
                        <Text style={{ color: 'black', fontSize: 16 }}>{item.type}</Text>
                        <Text style={{ fontSize: 14, color: 'black' }}>{item.notes}</Text>
                    </View>
                    <View style={{ padding: 10, backgroundColor: '#fff', borderWidth: 1, marginHorizontal: 10, marginBottom: 10, borderRadius: 6, borderColor: '#e3e3e3' }}>
                        <AccordionList
                            list={messageBoard}
                            header={messageBoardAccordionHeader}
                            body={messageBoardAccordionBody}
                            keyExtractor={item => `${item.id}`}

                        />
                    </View>
                </View>
                {/* <View style={{paddingVertical:12, backgroundColor: '#fff', borderBottomWidth: 2, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor:'#e3e3e3', marginTop: -2}}>
                   
                </View> */}
            </>
        );
    }

    const messageBoardAccordionHeader = (item) => {
        return (
            <View >
                <Separator style={{ backgroundColor: '#da7331', height: 50, paddingHorizontal: 10, borderWidth: 0.6, borderColor: '#e3e3e3', marginTop: 2, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 16, paddingVertical: 10 }}>{item.subject}</Text>
                        {/* <EntypoIcon name={selectedCase !== item.case_id ? "chevron-down" : "chevron-up"}  size={23} color="#da7331" /> */}
                    </View>
                </Separator>
            </View>


        );
    }

    const messageBoardAccordionBody = (item) => {
        return (
            <>
                <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 2, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2 }}>
                    <View style={{ padding: 10, backgroundColor: '#fff', borderWidth: 1, marginHorizontal: 10, marginBottom: 10, borderRadius: 6, borderColor: '#e3e3e3' }}>
                        <Text style={{ color: 'black', fontSize: 16 }}>{item.message}</Text>

                    </View>

                </View>
                {/* <View style={{paddingVertical:12, backgroundColor: '#fff', borderBottomWidth: 2, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor:'#e3e3e3', marginTop: -2}}>
                   
                </View> */}
            </>
        );
    }





    const CasesRoute = () => (
        <View style={styles.casesContainer} >
            <AccordionList
                list={cases}
                header={header}
                body={accordionBody}
                keyExtractor={item => `${item.case_id}`}

            />
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
            {loader === true ? <Loader /> :
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
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#fff'
    }
});

export default ViewPatientDetails