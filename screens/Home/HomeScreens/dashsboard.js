import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableHighlight, useWindowDimensions, Dimensions, Button, Animated, TouchableOpacity, LogBox } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AppBar from '../../ReusableComponents/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Avatar, } from 'react-native-paper';
import StatisticsComponent from '../../ReusableComponents/statisticsCoponent';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Label } from 'react-native-form-component';
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
import { VictoryBar, VictoryChart, VictoryGroup } from "victory-native";
import MonthlyCTab from '../../Tabs/MonthlyCalendar/monthly';
import WeeklyCTab from '../../Tabs/MonthlyCalendar/weekly';



//Location
import LocationInquiriesTab from '../../Tabs/LocationTab/InquiriesTabLocation';
import LocationConsultsTab from '../../Tabs/LocationTab/consutsTabLocation';
import LocationProceduresTab from '../../Tabs/LocationTab/proceduresTabLocation';
import { ar } from 'date-fns/locale';
import ReportSummary from '../../Charts/ReportSummary/reportSummary';
import SurgeonsChart from '../../Charts/Surgeons/surgeonsChart';
import ProceduresChart from '../../Charts/Procedures/proceduresChart';



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

   
    const [ifZeroDataSOI, setIfZeroDataSOI] = useState(false);

    const [index, setIndex] = useState(0);
    const [indexM, setIndexM] = useState(0);
    const [indexL, setIndexL] = useState(0);
    const layout = useWindowDimensions();
    const [routes] = useState([
        { key: 'first', title: 'Consult Form' },
        { key: 'second', title: 'Consults' },
        { key: 'third', title: 'Procedures' },
    ]);

    const [routesMonthlyCalendar] = useState([
        { key: 'first', title: 'Weekly' },
        { key: 'second', title: 'Monthly' },
    ]);


   
    const initialLayout = { width: Dimensions.get('window').width };

    const [locationConsultForm, setLocationConsultForm] = useState([]);
    const [locationConsult, setLocationConsult] = useState([]);
    const [locationProcedures, setLocationProcedures] = useState([]);

    const [filterDataSOI, setFilterDataSOI] = useState([]);
    const [filterDataSOIData, setFilterDataSOIData] = useState([]);

    const filters = ['Procedures', 'Surgeons', 'Location', 'Source of Inquiry', 'Leads Funnel'];

    const dataBar = {
        planned: [null, { x: 'Week 1', y: 20 }],
        actual: [
            { x: 'Week 1', y: 50 },
            { x: 'Week 1', y: 80 },
            { x: 'Week 2', y: 20 }
        ]
    }

    const renderSceneMonthlyCalendar = SceneMap({
        first: () => <MonthlyCTab />,
        second: () => <WeeklyCTab/>,
    });



    const renderTabBarMonthlyCalendar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#da7331' }}
            style={{ backgroundColor: '#fff', }}
            renderLabel={({ routesMonthlyCalendar }) => (
                <Text style={{ color: 'black', margin: 8, textTransform: 'uppercase', fontSize: 12 }}>
                    {routesMonthlyCalendar.title}
                </Text>
            )}
        />
    );

   

    useEffect(() => {
        const getMySchedule = async () => {
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


        const getSurgeons = async (filter) => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/dashboard/charts?filter=${filter}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    setSurgeons(response.data)
                    console.log("SURGEONS: ", response.data.datasets.labels);

                    console.log("DATA NOW: ", moment(Date.now()).format('YYYY-MM-DD'));
                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
        }

        const getFilteredQuerySOI = async (filter) => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/dashboard/charts?filter=${filter}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {
                    setFilterDataSOI(response.data)
                    console.log("SOI DATA: ", response.data)
                    let data = [];
                    for (var i = 0; i < response.data.datasets.length; i++) {
                        data[i] = { data: response.data.datasets[i].data };
                    }
                    setFilterDataSOIData(data[0].data);
                    console.log("SOI DATA 2: ", data[0].data)
                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
        }
        

        const getLeadsFunnelData = async () => {
            const token = await AsyncStorage.getItem('token');
            const tokenget = token === null ? route.params.token : token;

            await axios.get(
                `https://beta.centaurmd.com/api/dashboard/charts?filter=Leads Funnel`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenget
                    },
                }).then(response => {

                    //  setProceduresProcedures(response.data)
                    let data = [];
                    for (var i = 0; i < response.data.datasets.length; i++) {
                        data.push({
                            data: response.data.datasets[i].data,
                            name: response.data.datasets[i].label,
                        });
                    }


                    const mappedData = data.map((data) => {
                        return {
                            // ...data,

                            seriesname: data.name,
                            data: data.data.map((item) => {
                                return { values: item }
                            }),

                        };
                    });
                    // setProcedureDataProcedures(data[0].data);
                    // console.log("PROCEDURES CONSULTS: ", response.data)

                    console.log("LEADS FUNNEL DATA: ", mappedData[0].data)
                })
            // console.log("DASHBOARD - SCHEDULES: ", schedule)
        }


        getMySchedule();
        getDashboardData();
    
        //Location
        getLocationAll("", "");

        getFilteredQuerySOI(filters[3]);
        getLeadsFunnelData();

    }, [])



    const renderSceneLocation = SceneMap({
        first: () => <LocationInquiriesTab locationdata={locationConsultForm} />,
        second: () => <LocationConsultsTab locationdata={locationConsult} />,
        third: () => <LocationProceduresTab locationdata={locationProcedures} />,
    });

    const renderTabBarLocation = props => (
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


    const getLocationAll = async (datefrom, dateto) => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${datefrom}&dateto=${dateto}&filter=Consult Form&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];

                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA: ", temoArr)
                setLocationConsultForm(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${datefrom}&dateto=${dateto}&filter=Consults&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 1: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT: ", temoArr)
                setLocationConsult(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${datefrom}&dateto=${dateto}&filter=Procedures&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 3: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT 3: ", temoArr)
                setLocationProcedures(temoArr)
            })
            setLocationLoader(false);
    }

    const getLocationThisWeek = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('week').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('week').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Procedures&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 3: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT 3: ", temoArr)
                setLocationProcedures(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consults&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 1: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT: ", temoArr)
                setLocationConsult(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consult Form&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];

                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA: ", temoArr)
                setLocationConsultForm(temoArr)
                setLocationLoader(false);
            })
    }

    const getLocationThisMonth = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('month').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('month').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Procedures&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 3: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT 3: ", temoArr)
                setLocationProcedures(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consults&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 1: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT: ", temoArr)
                setLocationConsult(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consult Form&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];

                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA: ", temoArr)
                setLocationConsultForm(temoArr)
                setLocationLoader(false);
            })
    }

    const getLocationLastMonth = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'month');
        const begginingOfCurrentWeek = today.startOf('month').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('month').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Procedures&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 3: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT 3: ", temoArr)
                setLocationProcedures(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consults&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 1: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT: ", temoArr)
                setLocationConsult(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consult Form&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];

                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA: ", temoArr)
                setLocationConsultForm(temoArr)
                setLocationLoader(false);
            })
    }

    const getLocationThisYear = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Procedures&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 3: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT 3: ", temoArr)
                setLocationProcedures(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consults&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 1: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT: ", temoArr)
                setLocationConsult(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consult Form&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];

                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA: ", temoArr)
                setLocationConsultForm(temoArr)
                setLocationLoader(false);
            })
    }

    const getLocationLastYear = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'year');
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Procedures&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 3: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT 3: ", temoArr)
                setLocationProcedures(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consults&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 1: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT: ", temoArr)
                setLocationConsult(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consult Form&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];

                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA: ", temoArr)
                setLocationConsultForm(temoArr)
                setLocationLoader(false);
            })
    }

    const getLocationLastTwoYears = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(2, 'year');
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Procedures&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 3: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT 3: ", temoArr)
                setLocationProcedures(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consults&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 1: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT: ", temoArr)
                setLocationConsult(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&filter=Consult Form&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];

                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA: ", temoArr)
                setLocationConsultForm(temoArr)
                setLocationLoader(false);
            })
    }

    const getLocationRangeDate = async (startDate, endDate) => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const setText = " DATE (" + startDate + " - " + endDate + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&filter=Procedures&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 3: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT 3: ", temoArr)
                setLocationProcedures(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&filter=Consults&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];
                console.log("LOCATION DATA CONSULT 1: ", response.data)
                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA CONSULT: ", temoArr)
                setLocationConsult(temoArr)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&filter=Consult Form&category=location`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                const temoArr = [];

                for (let x = 0; x < response.data.labels.length; x++) {
                    temoArr.push(
                        {
                            name: response.data.labels[x],
                            counts: response.data.datasets[0].data[x],
                            //counts: 1,
                            color: response.data.datasets[0].backgroundColor[x],
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    )

                }
                console.log("LOCATION DATA: ", temoArr)
                setLocationConsultForm(temoArr)
                setLocationLoader(false);
            })
    }

    const getSOI = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/charts?filter=Source of Inquiry`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setFilterDataSOI(response.data)
                console.log("SOI DATA: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setFilterDataSOIData(data[0].data);
                console.log("SOI DATA 2: ", data[0].data)

                let count = 0;
                for(let x = 0; x<data[0].data.length; x++){
                    count = count +  data[0].data[x];
                }
                if(count !== 0){
                    setIfZeroDataSOI(false);
                }
                else{
                    setIfZeroDataSOI(true);
                }
                setSourceofinquiryLoader(false)
            })
        // console.log("DASHBOARD - SCHEDULES: ", schedule)
    }

    const getSOIThisWeek = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('week').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('week').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterTextSOI(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=source_of_inquiry`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setFilterDataSOI(response.data)
                console.log("SOI DATA: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setFilterDataSOIData(data[0].data);
                console.log("SOI DATA 2: ", data[0].data)

                let count = 0;
                for(let x = 0; x<data[0].data.length; x++){
                    count = count +  data[0].data[x];
                }
                if(count !== 0){
                    setIfZeroDataSOI(false);
                }
                else{
                    setIfZeroDataSOI(true);
                }
                setSourceofinquiryLoader(false)
            })

       
    }

    const getSOIThisMonth = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('month').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('month').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterTextSOI(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=source_of_inquiry`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setFilterDataSOI(response.data)
                console.log("SOI DATA: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setFilterDataSOIData(data[0].data);
                console.log("SOI DATA 2: ", data[0].data)

                let count = 0;
                for(let x = 0; x<data[0].data.length; x++){
                    count = count +  data[0].data[x];
                }
                if(count !== 0){
                    setIfZeroDataSOI(false);
                }
                else{
                    setIfZeroDataSOI(true);
                }
                setSourceofinquiryLoader(false)
            })

       
    }

    const getSOILastMonth = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'month');
        const begginingOfCurrentWeek = today.startOf('month').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('month').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterTextSOI(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=source_of_inquiry`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setFilterDataSOI(response.data)
                console.log("SOI DATA: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setFilterDataSOIData(data[0].data);
                console.log("SOI DATA 2: ", data[0].data)

                let count = 0;
                for(let x = 0; x<data[0].data.length; x++){
                    count = count +  data[0].data[x];
                }
                if(count !== 0){
                    setIfZeroDataSOI(false);
                }
                else{
                    setIfZeroDataSOI(true);
                }
                setSourceofinquiryLoader(false)
            })

       
    }

    const getSOIThisYear = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterTextSOI(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=source_of_inquiry`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setFilterDataSOI(response.data)
                console.log("SOI DATA: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setFilterDataSOIData(data[0].data);
                console.log("SOI DATA 2: ", data[0].data)

                let count = 0;
                for(let x = 0; x<data[0].data.length; x++){
                    count = count +  data[0].data[x];
                }
                if(count !== 0){
                    setIfZeroDataSOI(false);
                }
                else{
                    setIfZeroDataSOI(true);
                }
                setSourceofinquiryLoader(false)
            })

       
    }

    const getSOILastYear = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'year');
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterTextSOI(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=source_of_inquiry`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setFilterDataSOI(response.data)
                console.log("SOI DATA: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setFilterDataSOIData(data[0].data);
                console.log("SOI DATA 2: ", data[0].data)

                let count = 0;
                for(let x = 0; x<data[0].data.length; x++){
                    count = count +  data[0].data[x];
                }
                if(count !== 0){
                    setIfZeroDataSOI(false);
                }
                else{
                    setIfZeroDataSOI(true);
                }
                setSourceofinquiryLoader(false)
            })

       
    }

    const getSOILastTwoYear = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(2, 'year');
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterTextSOI(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=source_of_inquiry`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setFilterDataSOI(response.data)
                console.log("SOI DATA: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setFilterDataSOIData(data[0].data);
                console.log("SOI DATA 2: ", data[0].data)

                let count = 0;
                for(let x = 0; x<data[0].data.length; x++){
                    count = count +  data[0].data[x];
                }
                if(count !== 0){
                    setIfZeroDataSOI(false);
                }
                else{
                    setIfZeroDataSOI(true);
                }
                setSourceofinquiryLoader(false)
            })

       
    }

    const getSOIDateRange = async (startDate, endDate) => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const setText = " DATE (" + startDate + " - " + endDate + ")";
        setFilterTextSOI(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&category=source_of_inquiry`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setFilterDataSOI(response.data)
                console.log("SOI DATA: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setFilterDataSOIData(data[0].data);
                console.log("SOI DATA 2: ", data[0].data)

                let count = 0;
                for(let x = 0; x<data[0].data.length; x++){
                    count = count +  data[0].data[x];
                }
                if(count !== 0){
                    setIfZeroDataSOI(false);
                }
                else{
                    setIfZeroDataSOI(true);
                }
                setSourceofinquiryLoader(false)
            })

       
    }


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

    const [filterText, setFilterText] = useState(null);
    const [filterTextRS, setFilterTextRS] = useState(null);
    const [filterTextSOI, setFilterTextSOI] = useState(null);

    const [locationLoader, setLocationLoader] = useState(true);
    
    const [sourceofinquiryLoader, setSourceofinquiryLoader] = useState(true);
    const [todaySchedLoader, setTodaySchedLoader] = useState(true);


    return (
        <MenuProvider>
            <PaperProvider theme={black_theme}>
                <View style={styles.container}>
                    <Dialog
                        visible={showDateRangePicker}
                        width={300}
                        footer={
                            <DialogFooter>
                                <DialogButton
                                    text="Cancel"
                                    onPress={() => {
                                        setShowDateRangePicker(false);
                                        setdatePickerTitleStart(null);
                                        setdatePickerTitleEnd(null);
                                        setStartDate(null);
                                        setEndDate(null);
                                        setSelectedCategory(null)
                                    }}
                                />
                                <DialogButton text="Submit" onPress={() => {
                                    if (startDate === null) {
                                        setShowErrorEmpSD(true);
                                    }
                                    else {
                                        setShowErrorEmpSD(false);
                                    }
                                    if (endDate === null) {
                                        setShowErrorEmpED(true);
                                    }
                                    else {
                                        setShowErrorEmpED(false);
                                    }
                                    if (startDate !== null && endDate !== null) {
                                        if (moment(startDate).format("YYYY-MM-DD") > moment(endDate).format("YYYY-MM-DD")) {
                                            alert('End Date must be after the selected Start Date');
                                        }
                                        else {
                                            if (selectedCategory === "location") {
                                                getLocationRangeDate(startDate, endDate);
                                            }
                                            else if(selectedCategory === "Source of Inquiry"){
                                                getSOIDateRange(startDate, endDate);
                                            }
                                            else if(selectedCategory === "Report Summary"){
                                                getReportSummaryDataRangeDate(startDate, endDate);
                                            }
                                            setShowDateRangePicker(false);
                                            setSelectedCategory(null);
                                        }
                                    }
                                }} />
                            </DialogFooter>
                        }>
                        <DialogContent>
                            <View>
                                <View style={styles.dtrContainer}>
                                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: "bold", color: 'white' }}>Date Range Picker</Text>
                                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: "bold", color: 'white' }}>Category - {selectedCategory}</Text>
                                </View>

                                <Label text="Start Date" isRequired asterik />
                                {showErrorEmpSD === true ?
                                    <Animatable.View animation='fadeInLeft' duration={500}>
                                        <Text style={styles.errorMsg}>Please select Start Date</Text>
                                    </Animatable.View>
                                    : <></>}
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={showDatePickerStart}
                                >
                                    <View style={styles.inputContainer2}>
                                        <Text style={styles.textPicker}>{datePickerTitleStart === null ? "Show Date Picker" : datePickerTitleStart}</Text>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisibleStart}
                                            mode="date"
                                            value={startDate}
                                            onConfirm={handleConfirmStart}
                                            onCancel={hideDatePickerStart}
                                        />
                                    </View>
                                </TouchableOpacity>


                                <Label text="End Date" isRequired asterik />
                                {showErrorEmpED === true ?
                                    <Animatable.View animation='fadeInLeft' duration={500}>
                                        <Text style={styles.errorMsg}>Please select End Date</Text>
                                    </Animatable.View>
                                    : <></>}
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={showDatePickerEnd}
                                >
                                    <View style={styles.inputContainer2}>
                                        <Text style={styles.textPicker}>{datePickerTitleEnd === null ? "Show Date Picker" : datePickerTitleEnd}</Text>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisibleEnd}
                                            mode="date"
                                            value={endDate}
                                            onConfirm={handleConfirmEnd}
                                            onCancel={hideDatePickerEnd}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </DialogContent>
                    </Dialog>
                    <AppBar title={"Dashboard"} showMenuIcon={false} />
                    <ScrollView >
                        <View style={styles.wrapper} >

                            <View>
                                <Text style={styles.text}>Today's schedule</Text>

                                {todaySchedLoader === true ? <View style={{ justifyContent: 'center', borderRadius: 30, marginBottom: 10, }}><LoaderSmall/></View> :
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
                            <ReportSummary route={route}/>

                            <List.Accordion
                                title="Monthly Calendar"
                                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: 300, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                                <TabView
                                    navigationState={{ indexM, routesMonthlyCalendar }}
                                    renderScene={renderSceneMonthlyCalendar}
                                    onIndexChange={setIndexM}
                                    initialLayout={{ initialLayout }}
                                    renderTabBar={renderTabBarMonthlyCalendar}
                                />
                                </View>


                            </List.Accordion>
                            <View style={{ marginBottom: 5 }} />
                            <ProceduresChart route={route} />
                             {/* SURGEONS CHART */}
                            <SurgeonsChart route={route} />
                            <List.Accordion
                                title="Location"
                                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                                <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                    <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: 400, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}> {filterText}  </Text>
                                            <Menu>
                                                <MenuTrigger><AntdIcon name="calendar" size={25} color="#7e7e7e" style={{ marginRight: 10 }} /></MenuTrigger>
                                                <MenuOptions>
                                                    <MenuOption onSelect={() => {getLocationAll("", ""), setLocationLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>All</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLocationThisWeek(),  setLocationLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Week</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLocationThisMonth(), setLocationLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Month</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLocationLastMonth(), setLocationLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Month</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLocationThisYear(), setLocationLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Year</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLocationLastYear(), setLocationLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Year</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLocationLastTwoYears(), setLocationLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last 2 Years</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {
                                                        setSelectedCategory('location'); setLocationLoader(true); setShowDateRangePicker(true); setShowErrorEmpSD(false), setShowErrorEmpED(false)
                                                        setdatePickerTitleStart(null); setdatePickerTitleEnd(null); setStartDate(null);
                                                        setEndDate(null); console.log(selectedCategory);
                                                    }} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Custom Range</Text></View>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                        <TabView
                                            navigationState={{ index, routes }}
                                            renderScene={renderSceneLocation}
                                            onIndexChange={setIndexL}
                                            initialLayout={{ initialLayout }}
                                            renderTabBar={renderTabBarLocation}
                                        />


                                    </View>
                                </View>
                            </List.Accordion>

                            <View style={{ marginBottom: 5 }} />

                            <List.Accordion
                                title="Source of Inquiry"
                                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                                <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                <View style={{ paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}> {filterTextSOI}  </Text>
                                            <Menu>
                                                <MenuTrigger><AntdIcon name="calendar" size={25} color="#7e7e7e" style={{ marginRight: 10 }} /></MenuTrigger>
                                                <MenuOptions>
                                                    <MenuOption onSelect={() => {getSOI(), setSourceofinquiryLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>All</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getSOIThisWeek(),  setSourceofinquiryLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Week</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getSOIThisMonth(), setSourceofinquiryLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Month</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getSOILastMonth(), setSourceofinquiryLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Month</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getSOIThisYear(), setSourceofinquiryLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Year</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getSOILastYear(), setSourceofinquiryLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Year</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getSOILastTwoYear(), setSourceofinquiryLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last 2 Years</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {
                                                        setSelectedCategory('Source of Inquiry'); setSourceofinquiryLoader(true); setShowDateRangePicker(true); setShowErrorEmpSD(false), setShowErrorEmpED(false)
                                                        setdatePickerTitleStart(null); setdatePickerTitleEnd(null); setStartDate(null);
                                                        setEndDate(null); console.log(selectedCategory);
                                                    }} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Custom Range</Text></View>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                 <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: 400, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: 5, }}>
                                { sourceofinquiryLoader === true ? <View style={{ height: '100%', justifyContent: 'center'}}><LoaderSmall/></View> :
                                    ifZeroDataSOI === true ?
                                    <HorizontalBarGraph
                                        //data={filterDataSOIData}
                                        data={[1, 1, 1, 1, 5, 2, 3, 3, 3, 10]}
                                        labels={filterDataSOI.labels}
                                        width={Dimensions.get("window").width - 44}
                                        height={400}
                                        barRadius={5}
                                        barColor="transparent"
                                        barWidthPercentage={0.5}
                                        baseConfig={{
                                            hasYAxisBackgroundLines: true,
                                            hasXAxisBackgroundLines: true,
                                            xAxisLabelStyle: {
                                                rotation: 0,
                                                fontSize: 12,
                                                width: 150,
                                                yOffset: 0,
                                                xOffset: -60,
                                                margin: 10,
                                            },
                                            yAxisLabelStyle: {
                                                fontSize: 13,
                                                position: 'bottom',
                                                xOffset: 15,
                                                height: 100,
                                                decimal: 1
                                            }
                                        }}
                                    />
                                    :
                                    <HorizontalBarGraph
                                        //data={filterDataSOIData}
                                        data={filterDataSOIData}
                                        labels={filterDataSOI.labels}
                                        width={Dimensions.get("window").width - 44}
                                        height={400}
                                        barRadius={5}
                                        barColor="#e3e3e3"
                                        barWidthPercentage={0.5}
                                        baseConfig={{
                                            hasYAxisBackgroundLines: true,
                                            hasXAxisBackgroundLines: true,
                                            xAxisLabelStyle: {
                                                rotation: 0,
                                                fontSize: 12,
                                                width: 150,
                                                yOffset: 0,
                                                xOffset: -60,
                                                margin: 10,
                                            },
                                            yAxisLabelStyle: {
                                                fontSize: 13,
                                                position: 'bottom',
                                                xOffset: 15,
                                                height: 100,
                                                decimal: 1
                                            }
                                        }}
                                    />
                                }
                                </View>

                                </View>
                            </List.Accordion>
                            <View style={{ marginBottom: 5 }} />
                            <List.Accordion
                                title="Leads Funnel"
                                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                                expanded="true"
                                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                                <View style={{ paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>

                                </View>
                            </List.Accordion>
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
