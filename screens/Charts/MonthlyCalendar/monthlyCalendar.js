import React, { ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { StyleSheet, View, Text, ScrollView, Image, TouchableHighlight, useWindowDimensions, Dimensions, Button, Modal, Animated, TouchableOpacity } from 'react-native';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import MonthlyCTab from '../../Tabs/MonthlyCalendar/monthly';
import WeeklyCTab from '../../Tabs/MonthlyCalendar/weekly';

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const MonthlySchedChart = ({ navigation, route }) => {
    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'first', title: 'Weekly' },
        { key: 'second', title: 'Monthly' },
    ]);

    const initialLayout = { width: Dimensions.get('window').width };

    const today = moment(new Date(Date.now()));
    const begginingOfCurrentMonth = today.startOf('month').format("YYYY-MM-DD");
    const endOfMonth = today.endOf('month').format("YYYY-MM-DD");
    const [scheduleMonthly, setScheduleMonthly] = useState([]);

    const begginingOfCurrentWeekly = today.startOf('week').format("YYYY-MM-DD");
    const endOfWeek = today.endOf('week').format("YYYY-MM-DD");
    const [scheduleWeekly, setScheduleWeekly] = useState([]);

    const [wLoader, setWLoader] = useState(true);
    const [mLoader, setMLoader] = useState(true);

    const [weekIsEmpty, setWeekIsEmpty] = useState(true);
    const [monthIsEmpty, setMonthIsEmpty] = useState(true);

    useEffect(() =>{
        const getMyScheduleMonthly = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/schedules`,
                {
                    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + tokenget, },
                }).then(response => {
                    const filteredSchedule = response.data.filter(item => 
                        moment(item.date_from).format("YYYY-MM-DD") >= begginingOfCurrentMonth &&
                        moment(item.date_to).format("YYYY-MM-DD") <= endOfMonth);

                    console.log("Monthly - SCHEDULES: ", filteredSchedule)
                    if (filteredSchedule.length !== 0) {
                        setScheduleMonthly(filteredSchedule);
                        setMonthIsEmpty(false);
                    }
                    else{
                        setMonthIsEmpty(true);
                    }
                    setMLoader(false);
                })
        }

        const getMyScheduleWeekly = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/schedules`,
                {
                    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + tokenget, },
                }).then(response => {
                    const filteredSchedule = response.data.filter(item => 
                        moment(item.date_from).format("YYYY-MM-DD") >= begginingOfCurrentWeekly &&
                        moment(item.date_to).format("YYYY-MM-DD") <= endOfWeek);

                    console.log("Weekly - SCHEDULES: ", filteredSchedule)
                    if (filteredSchedule.length !== 0) {
                        setScheduleWeekly(filteredSchedule);
                        setWeekIsEmpty(false);
                    }
                    else{
                        setWeekIsEmpty(true);
                    }
                    setWLoader(false);
                })
        }


        getMyScheduleMonthly();
        getMyScheduleWeekly();
    },[]);
    

    const renderSceneMonthlyCalendar = SceneMap({
        first: () => <WeeklyCTab route={route} weeklyData={scheduleWeekly} loader={wLoader} empty={weekIsEmpty}/>,
        second: () => <MonthlyCTab route={route} monthlyData={scheduleMonthly} loader={mLoader} empty={monthIsEmpty}/>
    });


    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#da7331' }}
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
                                title="Monthly Calendar"
                                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: 350, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                                <TabView
                                    navigationState={{ index, routes }}
                                    renderScene={renderSceneMonthlyCalendar}
                                    onIndexChange={setIndex}
                                    initialLayout={{ initialLayout }}
                                    renderTabBar={renderTabBar}
                                />
                                </View>
                            </List.Accordion>
        </PaperProvider>
    )
}

export default MonthlySchedChart