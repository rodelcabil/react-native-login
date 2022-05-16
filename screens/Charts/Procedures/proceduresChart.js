import React, { ReactNode, useEffect, useState } from 'react';

import { StyleSheet, View, Text, ScrollView, Image, TouchableHighlight, useWindowDimensions, Dimensions, Button, Modal, Animated, TouchableOpacity } from 'react-native';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import moment from 'moment';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';

import ProceduresInquiriesTab from '../../Tabs/ProceduresTab/proceduresInquiriesTab';
import ProceduresConsultsTab from '../../Tabs/ProceduresTab/proceduresConsultTab';
import ProceduresProceduresTab from '../../Tabs/ProceduresTab/proceduresProceduresTab';

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const ProceduresChart = ({ route }) => {

    const [index, setIndex] = useState(0);

    const [dateFrom, setDateFrom] = useState("2022-01-01");
    const [dateTo, setDateTo] = useState("2022-12-31");

    const [proceduresInquiries, setProceduresInquiries] = useState([]);
    const [procedureDataInquiries, setProcedureDataInquiries] = useState();

    const [proceduresConsults, setProceduresConsults] = useState([]);
    const [procedureDataConsults, setProcedureDataConsults] = useState();

    const [proceduresProcedures, setProceduresProcedures] = useState([]);
    const [procedureDataProcedures, setProcedureDataProcedures] = useState();


    const [routes] = useState([
        { key: 'first', title: 'Consult Form' },
        { key: 'second', title: 'Consults' },
        { key: 'third', title: 'Procedures' },
    ]);

    const initialLayout = { width: Dimensions.get('window').width };
    

    useEffect(() =>{
        const getProceduresData = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Inquiries`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    setProceduresInquiries(response.data)
                    let data = [];
                    for (var i = 0; i < response.data.datasets.length; i++) {
                        data[i] = { data: response.data.datasets[i].data };
                    }
                    setProcedureDataInquiries(data[0].data);
                    console.log("PROCEDURES CONSULTS: ", response.data)
                });

                await axios.get(
                    `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Procedures`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + tokenget
                        },
                    }).then(response => {
    
                        setProceduresProcedures(response.data)
                        let data = [];
                        for (var i = 0; i < response.data.datasets.length; i++) {
                            data[i] = { data: response.data.datasets[i].data };
                        }
                        setProcedureDataProcedures(data[0].data);
                        console.log("PROCEDURES CONSULTS: ", response.data)
                    });

                    await axios.get(
                        `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=procedures&filter=Consults`,
                        {
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': 'Bearer ' + tokenget
                            },
                        }).then(response => {
        
                            setProceduresConsults(response.data)
                            let data = [];
                            for (var i = 0; i < response.data.datasets.length; i++) {
                                data[i] = { data: response.data.datasets[i].data };
                            }
                            setProcedureDataConsults(data[0].data);
                            console.log("PROCEDURES CONSULTS: ", response.data)
                        })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
        }

        getProceduresData();
    },[]);

    const renderSceneProcedures = SceneMap({
        first: () => <ProceduresInquiriesTab data={proceduresInquiries} proceduresData={procedureDataConsults} />,
        second: () => <ProceduresConsultsTab data={proceduresConsults} proceduresData={procedureDataConsults} />,
        third: () => <ProceduresProceduresTab data={proceduresProcedures} proceduresData={procedureDataProcedures} />,
    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#3a87ad' }}
            style={{ backgroundColor: '#fff', }}
            renderLabel={({ route }) => (
                <Text style={{ color: 'black', margin: 8, textTransform: 'uppercase', fontSize: 12 }}>
                    {route.title}
                </Text>
            )}
        />
    );


    return (
        <PaperProvider theme={black_theme}>
            <List.Accordion
                                title="Procedures"
                                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: 1040, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                                    <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                        <AntdIcon name="calendar" size={25} color="#7e7e7e" style={{ marginRight: 10 }} />
                                        <AntdIcon name="filter" size={25} color="#7e7e7e" />
                                    </View>
                                    <TabView
                                        navigationState={{ index, routes }}
                                        renderScene={renderSceneProcedures}
                                        onIndexChange={setIndex}
                                        initialLayout={{ initialLayout }}
                                        renderTabBar={renderTabBar}
                                    />
                                </View>

                            </List.Accordion>
                            <View style={{ marginBottom: 5 }} />
        </PaperProvider>
    )
}

export default ProceduresChart