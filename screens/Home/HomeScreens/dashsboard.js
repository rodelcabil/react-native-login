import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableHighlight, useWindowDimensions, Dimensions, Button, Animated, TouchableOpacity, LogBox } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AppBar from '../../ReusableComponents/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Avatar, } from 'react-native-paper';
import StatisticsComponent from '../../ReusableComponents/statisticsCoponent';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Animatable from 'react-native-animatable';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Dialog, {
    DialogFooter,
    DialogButton,
    DialogContent
} from "react-native-popup-dialog";
import { MenuProvider } from 'react-native-popup-menu';
import HorizontalBarGraph from '@chartiful/react-native-horizontal-bar-graph'
import VerticalBarGraph from '@chartiful/react-native-vertical-bar-graph';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLegend } from "victory-native";


import ReportSummary from '../../Charts/ReportSummary/reportSummary';
import SurgeonsChart from '../../Charts/Surgeons/surgeonsChart';
import ProceduresChart from '../../Charts/Procedures/proceduresChart';
import LocationChart from '../../Charts/Location/locationChart';
import SourceOfInquiryChart from '../../Charts/SourceofInquiry/source_of_inquiry';
import MonthlyChart from '../../Charts/MonthlyCalendar/monthlyCalendar';
import LeadsFunnel from '../../Charts/LeadsFunnel/LeadsFunnelChart';


const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};



const Dashboard = ({ navigation, route }) => {
    LogBox.ignoreLogs([
        "ViewPropTypes will be removed",
        "ColorPropType will be removed",
    ])

    const [schedule, setSchedule] = useState([]);
    const [hasSched, setHasSched] = useState(false);
    const [dashboardData, setDashboardData] = useState([]);
    const [surgeons, setSurgeons] = useState([])

    const layout = useWindowDimensions();

    const initialLayout = { width: Dimensions.get('window').width };


    const dataBar2 = {
        planned: [null, { x: 'Week 1', y: 20 }],
        actual: [
            { x: 'Week 1', y: 50 },
            { x: 'Week 1', y: 80 },
            { x: 'Week 2', y: 20 }
        ]
    }

   
    useEffect(() => {
        const getMySchedule = async () => {
            console.log("GET SCHED LOADING");
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/schedules`,
                {
                    headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + tokenget, },
                }).then(response => {

                    const filteredSchedule = response.data.filter(item => moment(item.date_from).format("YYYY-MM-DD") === moment(new Date(Date.now())).format("YYYY-MM-DD"));
                    console.log("DASHBOARD - SCHEDULES: ", filteredSchedule)
                    if (filteredSchedule.length !== 0) {
                        setHasSched(true)
                        setSchedule(filteredSchedule);
                    }
                    else {
                        setHasSched(false)
                    }
                    setTodaySchedLoader(false);
                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
            console.log("HAS SCHED?: ", hasSched)
        }
        const getDashboardData = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/dashboard/main-info`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    setDashboardData(response.data)


                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
            console.log("DASHBOARD DATA: ", dashboardData.data)
        }

        getMySchedule();
        getDashboardData();

    }, [])


    const screenWidth = Dimensions.get("window").width;


    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [isDatePickerVisibleStart, setDatePickerVisibilityStart] = useState(false);
    const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false);
    const [datePickerTitleStart, setdatePickerTitleStart] = useState(null);
    const [datePickerTitleEnd, setdatePickerTitleEnd] = useState(null);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const showDatePickerStart = () => {
        setDatePickerVisibilityStart(true);
    };
    const showDatePickerEnd = () => {
        setDatePickerVisibilityEnd(true);
    };

    const hideDatePickerStart = () => {
        setDatePickerVisibilityStart(false);
    };
    const hideDatePickerEnd = () => {
        setDatePickerVisibilityEnd(false);
    };

    const handleConfirmStart = (date) => {
        setdatePickerTitleStart(moment(date).format("YYYY-MM-DD"))
        setStartDate(moment(date).format("YYYY-MM-DD"));
        hideDatePickerStart();
    };

    const handleConfirmEnd = (date) => {
        setdatePickerTitleEnd(moment(date).format("YYYY-MM-DD"))
        setEndDate(moment(date).format("YYYY-MM-DD"));
        hideDatePickerEnd();
    };

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showErrorEmpSD, setShowErrorEmpSD] = useState(false);
    const [showErrorEmpED, setShowErrorEmpED] = useState(false);

    const [filterTextRS, setFilterTextRS] = useState(null);

    const [todaySchedLoader, setTodaySchedLoader] = useState(true);


    return (
        <MenuProvider>
            <PaperProvider theme={black_theme}>
                <View style={styles.container}>
                    <AppBar title={"Dashboard"} showMenuIcon={false} />
                    <ScrollView nestedScrollEnabled = {true}>
                        <View style={styles.wrapper} >

                            <View>
                                <Text style={styles.text}>Today's schedule</Text>

                                {todaySchedLoader === true ? <View style={{ justifyContent: 'center', borderRadius: 30, marginBottom: 10, }}><LoaderSmall /></View> :
                                    hasSched === false ?
                                        <View style={styles.itemEmptyContainer}>
                                            <Image
                                                style={styles.logoImg}
                                                source={require('../../../assets/calendar.png')}
                                            />
                                            <Text style={styles.text1}>You have no schedule at the moment for this day</Text>
                                        </View>
                                        :
                                        <>
                                            {schedule?.map((item, i) => {
                                                return <TouchableHighlight
                                                    key={i}
                                                    style={{ marginBottom: 10, }}
                                                    activeOpacity={0.6}
                                                    underlayColor="#DDDDDD"
                                                    onPress={() => navigation.navigate('View Schedule', {
                                                        item: item,
                                                    })

                                                    }
                                                >

                                                    <Card style={{ borderLeftWidth: 5, borderColor: item.category === 'consults' ? '#da7331' : item.category === 'procedures' ? '#ffc000' : item.category === 'reminder' ? '#3a87ad' : '#81c784' }}>

                                                        {item.category === 'reminder' ?
                                                            <Card.Content key={i}>
                                                                <View style={styles.columnContainer}>
                                                                    <Text style={styles.titleStyle}>{item.title}</Text>
                                                                    <View style={styles.rowSchedContainer}>
                                                                        <Icon name="information" size={20} color="#3a87ad" style={{ marginRight: 5 }} />
                                                                        <Text style={styles.tagStyle}>{item.description}&nbsp;</Text>

                                                                    </View>

                                                                    <View style={styles.rowSchedContainer}>
                                                                        <Icon name="calendar" size={20} color="#3a87ad" style={{ marginRight: 5 }} />
                                                                        <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                                    </View>
                                                                </View>
                                                            </Card.Content>

                                                            :

                                                            item.category === 'procedures' ?
                                                                <Card.Content key={i}>
                                                                    <View style={styles.columnContainer}>
                                                                        <Text style={styles.titleStyle}>{item.procedures}</Text>
                                                                        <View style={styles.rowSchedContainer}>
                                                                            <Icon name="information" size={20} color="#ffc000" style={{ marginRight: 5 }} />
                                                                            <Text style={styles.tagStyle}>{item.procedure_description}&nbsp;</Text>

                                                                        </View>

                                                                        <View style={styles.rowSchedContainer}>
                                                                            <Icon name="calendar" size={20} color="#ffc000" style={{ marginRight: 5 }} />
                                                                            <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                                        </View>
                                                                    </View>
                                                                </Card.Content>

                                                                :

                                                                item.category === 'consults' ?
                                                                    <Card.Content key={i}>
                                                                        <View style={styles.columnContainer}>
                                                                            <Text style={styles.titleStyle}>{item.procedures}</Text>
                                                                            <View style={styles.rowSchedContainer}>
                                                                                <Icon name="information" size={20} color="#da7331" style={{ marginRight: 5 }} />
                                                                                <Text style={styles.tagStyle}>{item.notes}&nbsp;</Text>

                                                                            </View>

                                                                            <View style={styles.rowSchedContainer}>
                                                                                <Icon name="calendar" size={20} color="#da7331" style={{ marginRight: 5 }} />
                                                                                <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </Card.Content>

                                                                    :

                                                                    <Card.Content key={i}>
                                                                        <View style={styles.columnContainer}>
                                                                            <Text style={styles.titleStyle}>{item.title}</Text>
                                                                            <View style={styles.rowSchedContainer}>
                                                                                <Icon name="information" size={20} color="#81c784" style={{ marginRight: 5 }} />
                                                                                <Text style={styles.tagStyle}>{item.description}&nbsp;</Text>

                                                                            </View>

                                                                            <View style={styles.rowSchedContainer}>
                                                                                <Icon name="calendar" size={20} color="#81c784" style={{ marginRight: 5 }} />
                                                                                <Text style={styles.scheduleStyle}>{moment(item.time_from, ["HH.mm"]).format("hh:mm A")} - {moment(item.time_to, ["HH.mm"]).format("hh:mm A")}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </Card.Content>
                                                        }

                                                    </Card>
                                                </TouchableHighlight>
                                            }
                                            )}
                                        </>
                                }
                            </View>
                            <View>
                                <StatisticsComponent bgColor="#03A9F3" title="CONSULT FORM" count={dashboardData?.total_inquiries} iconName="email-newsletter" iconFolder="Icon" popOverContent={'Overall consult from submitted'} />
                                <StatisticsComponent bgColor="#ED7D31" title="BOOK CONSULTS" count={dashboardData?.total_booked_consults} iconName="book-online" iconFolder="MaterialIcon" popOverContent={'Overall booked consults'} />
                                <StatisticsComponent bgColor="#FFC000" title="BOOK PROCEDURES" count={dashboardData?.total_booked_procedures} iconName="procedures" iconFolder="FAIcon5" popOverContent={'Overall booked procedures'} />
                                <StatisticsComponent bgColor="#00C292" title="COMPLETED PROCEDURES" count={dashboardData?.total_completed_procedures} iconName="check-circle" iconFolder="FeatherIcon" popOverContent={'Overall completed procedures'} />
                            </View>
                            {/* REPORT SUMMARY CHART*/}
                            <ReportSummary route={route} />
                            <MonthlyChart route={route} />
                            <View style={{ marginBottom: 5 }} />
                            <ProceduresChart route={route} />
                            {/* SURGEONS CHART */}
                            <SurgeonsChart route={route} />
                            <LocationChart route={route} />
                            <SourceOfInquiryChart route={route} />
                            <LeadsFunnel route={route}/>

                            <View style={{ marginBottom: 5 }} />
                        </View>
                    </ScrollView>
                </View>
            </PaperProvider>
        </MenuProvider>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    wrapper: {
        padding: 10,
        flex: 1,
    },
    text: {
        marginBottom: 5,
        fontSize: 16,
        color: '#0E2138',
    },
    columnContainer: {
        flexDirection: 'column',

    },
    rowSchedContainer: {
        flexDirection: 'row',

        alignItems: 'center',

    },
    rowContainer: {
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between'

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
    iconBg: {
        backgroundColor: '#fff',
        borderRadius: 500,
        display: 'flex',
        padding: 10,
        marginRight: 10,
        paddingRight: 5
    },
    itemEmptyContainer: {
        padding: 20,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    text1: {
        marginTop: 15,
        fontSize: 15,
    },
    logoImg: {
        width: 50,
        height: 50,
        opacity: 0.5,
        resizeMode: 'contain',
    },
    types: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        marginBottom: 5,
        marginRight: 20
    },
    typesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        display: 'flex',
        marginTop: 20,
        flexWrap: 'wrap'

    },

    typesPie: {
        flexDirection: 'row',
        display: 'flex',
        marginBottom: 5,
    },
    typesContainerPie: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        display: 'flex',
        marginTop: 20,
    },
    text2: {
        fontSize: 12,
        color: 'black'
    },
    popupItem: {
        backgroundColor: '#edeef0',
        width: '100%',
        borderRadius: 5,
        padding: 10
    },
    popupItemText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#316fd4'
    },
    inputContainer2: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        fontSize: 13,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    textPicker: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dtrContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: '#075DA7',
        marginBottom: 10
    },
    errorMsg: {
        color: 'red',
        fontSize: 13,
        marginBottom: 10,
    },
});

export default Dashboard;
