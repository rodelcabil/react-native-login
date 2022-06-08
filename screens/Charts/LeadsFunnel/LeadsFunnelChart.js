import React, { ReactNode, useEffect, useState } from 'react';
import { Label } from 'react-native-form-component';
import { StyleSheet, View, Text, ScrollView, Image, TouchableHighlight, useWindowDimensions, Dimensions, Button, Modal, Animated, TouchableOpacity } from 'react-native';
import { List, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Animatable from 'react-native-animatable';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import moment from 'moment';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import LoaderSmall from '../../ReusableComponents/LottieLoader-Small';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLegend, VictoryAxis, VictoryLabel } from "victory-native";

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const LeadsFunnelChart = ({ route }) => {

    const [initialWidth, setInitialWidth] = useState( Dimensions.get("window").width+500);

    const [DataBar, setDataBar] = useState({});
    const [DataBarLegend, setDataBarLegend] = useState({});

    useEffect(() =>{
        getLeadsFunnelDataThisYear();
    },[]);

    const getLeadsFunnelData = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/charts?filter=Leads Funnel`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log('lead funnels', response.data)
                let data = [];
                let dataLegend = [];
                let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                    });
                    dataLegend.push({
                        name: response.data.datasets[i].label + "   ",
                        symbol: {fill: response.data.datasets[i].backgroundColor,}
                    });
                }

                console.log("LOOOOPPP: ", data)

                let data2 = {
                    Inquiry: [
                        {x: months[0], y: data[0].data[0]},
                        {x: months[1], y: data[0].data[1]},
                        {x: months[2], y: data[0].data[2]},
                        {x: months[3], y: data[0].data[3]},
                        {x: months[4], y: data[0].data[4]},
                        {x: months[5], y: data[0].data[5]},
                        {x: months[6], y: data[0].data[6]},
                        {x: months[7], y: data[0].data[7]},
                        {x: months[8], y: data[0].data[8]},
                        {x: months[9], y: data[0].data[9]},
                        {x: months[10], y: data[0].data[10]},
                        {x: months[11], y: data[0].data[11]},
                    ],
                    ConsultForm: [
                        {x: months[0], y: data[1].data[0]},
                        {x: months[1], y: data[1].data[1]},
                        {x: months[2], y: data[1].data[2]},
                        {x: months[3], y: data[1].data[3]},
                        {x: months[4], y: data[1].data[4]},
                        {x: months[5], y: data[1].data[5]},
                        {x: months[6], y: data[1].data[6]},
                        {x: months[7], y: data[1].data[7]},
                        {x: months[8], y: data[1].data[8]},
                        {x: months[9], y: data[1].data[9]},
                        {x: months[10], y: data[1].data[10]},
                        {x: months[11], y: data[1].data[11]},
                    ],
                    BookedConsult: [
                        {x: months[0], y: data[2].data[0]},
                        {x: months[1], y: data[2].data[1]},
                        {x: months[2], y: data[2].data[2]},
                        {x: months[3], y: data[2].data[3]},
                        {x: months[4], y: data[2].data[4]},
                        {x: months[5], y: data[2].data[5]},
                        {x: months[6], y: data[2].data[6]},
                        {x: months[7], y: data[2].data[7]},
                        {x: months[8], y: data[2].data[8]},
                        {x: months[9], y: data[2].data[9]},
                        {x: months[10], y: data[2].data[10]},
                        {x: months[11], y: data[2].data[11]},
                    ],
                    BookedProcedure: [
                        {x: months[0], y: data[3].data[0]},
                        {x: months[1], y: data[3].data[1]},
                        {x: months[2], y: data[3].data[2]},
                        {x: months[3], y: data[3].data[3]},
                        {x: months[4], y: data[3].data[4]},
                        {x: months[5], y: data[3].data[5]},
                        {x: months[6], y: data[3].data[6]},
                        {x: months[7], y: data[3].data[7]},
                        {x: months[8], y: data[3].data[8]},
                        {x: months[9], y: data[3].data[9]},
                        {x: months[10], y: data[3].data[10]},
                        {x: months[11], y: data[3].data[11]},
                    ],
                    Closed: [
                        {x: months[0], y: data[4].data[0]},
                        {x: months[1], y: data[4].data[1]},
                        {x: months[2], y: data[4].data[2]},
                        {x: months[3], y: data[4].data[3]},
                        {x: months[4], y: data[4].data[4]},
                        {x: months[5], y: data[4].data[5]},
                        {x: months[6], y: data[4].data[6]},
                        {x: months[7], y: data[4].data[7]},
                        {x: months[8], y: data[4].data[8]},
                        {x: months[9], y: data[4].data[9]},
                        {x: months[10], y: data[4].data[10]},
                        {x: months[11], y: data[4].data[11]},
                    ],
                };

                console.log("SET LEAD FUNNELS", data2);
                setDataBarLegend(dataLegend)
                setDataBar(data2)
                setLoader(false);
                console.log("LEADS FUNNEL DATA: ", data[0].data, data[1].data, data[2].data, data[3].data, data[4].data)
            })
        // console.log("DASHBOARD - SCHEDULES: ", schedule)
    }

    const getLeadsFunnelDataThisWeek = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('week').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('week').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        setInitialWidth(Dimensions.get("window").width)

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?category=leads_funnel&datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log('lead funnels this week', response.data)
                let data = [];
                let dataLegend = [];

                let months = response.data.labels;

                console.log("Days", months);
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                    });
                    dataLegend.push({
                        name: response.data.datasets[i].label + "   ",
                        backgroundColor: response.data.datasets[i].backgroundColor,
                    });
                }

                console.log("LOOOOPPP: ", data)

                let getCountI = 0;
                let getCountCo = 0;
                let getCountBC = 0;
                let getCountBP = 0;
                let getCountC = 0;

                for(let x = 0; x<months.length; x++){
                    getCountI += data[0].data[x]
                    getCountCo += data[1].data[x]
                    getCountBC += data[2].data[x]
                    getCountBP += data[3].data[x]
                    getCountC += data[4].data[x]

                    console.log("Count", x, getCountI, getCountCo, getCountBC, getCountBP, getCountC);
                }

                const getMonth = today.startOf('week').format("MMMM DD") + " - " + today.endOf('week').format("DD, YYYY");;
                
                let data2 = {
                    Inquiry: [{x: getMonth, y: getCountI}],
                    ConsultForm: [{x: getMonth, y: getCountCo}],
                    BookedConsult:[{x: getMonth, y: getCountBC}],
                    BookedProcedure: [{x: getMonth, y: getCountBP}],
                    Closed: [{x: getMonth, y: getCountC}],
                };

                console.log("SET LEAD FUNNELS", data2);
                setDataBarLegend(dataLegend)
                setDataBar(data2)
                setLoader(false);
            })
    }

    const getLeadsFunnelDataThisMonth = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('month').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('month').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);

        setInitialWidth(Dimensions.get("window").width)
        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?category=leads_funnel&datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log('lead funnels this month', response.data)
                let data = [];
                let dataLegend = [];

                let months = response.data.labels;

                console.log("Days", months);
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                    });
                    dataLegend.push({
                        name: response.data.datasets[i].label + "   ",
                        backgroundColor: response.data.datasets[i].backgroundColor,
                    });
                }

                console.log("LOOOOPPP: ", data)

                let getCountI = 0;
                let getCountCo = 0;
                let getCountBC = 0;
                let getCountBP = 0;
                let getCountC = 0;

                for(let x = 0; x<months.length; x++){
                    getCountI += data[0].data[x]
                    getCountCo += data[1].data[x]
                    getCountBC += data[2].data[x]
                    getCountBP += data[3].data[x]
                    getCountC += data[4].data[x]

                    console.log("Count", x, getCountI, getCountCo, getCountBC, getCountBP, getCountC);
                }

                const getMonth = today.startOf('month').format("MMMM YYYY");

                let data2 = {
                    Inquiry: [{x: getMonth, y: getCountI}],
                    ConsultForm: [{x: getMonth, y: getCountCo}],
                    BookedConsult:[{x: getMonth, y: getCountBC}],
                    BookedProcedure: [{x: getMonth, y: getCountBP}],
                    Closed: [{x: getMonth, y: getCountC}],
                };

                console.log("SET LEAD FUNNELS", data2);
                setDataBarLegend(dataLegend)
                setDataBar(data2)
                setLoader(false);
            })
    }

    const getLeadsFunnelDataThisLastMonth = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'month');
        const begginingOfCurrentWeek = today.startOf('month').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('month').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);
        setInitialWidth(Dimensions.get("window").width)

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?category=leads_funnel&datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log('lead funnels this month', response.data)
                let data = [];
                let dataLegend = [];

                let months = response.data.labels;

                console.log("Days", months);
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                    });
                    dataLegend.push({
                        name: response.data.datasets[i].label + "   ",
                        backgroundColor: response.data.datasets[i].backgroundColor,
                    });
                }

                console.log("LOOOOPPP: ", data)

                let getCountI = 0;
                let getCountCo = 0;
                let getCountBC = 0;
                let getCountBP = 0;
                let getCountC = 0;

                for(let x = 0; x<months.length; x++){
                    getCountI += data[0].data[x]
                    getCountCo += data[1].data[x]
                    getCountBC += data[2].data[x]
                    getCountBP += data[3].data[x]
                    getCountC += data[4].data[x]

                    console.log("Count", x, getCountI, getCountCo, getCountBC, getCountBP, getCountC);
                }

                const getMonth = today.startOf('month').format("MMMM YYYY");

                let data2 = {
                    Inquiry: [{x: getMonth, y: getCountI}],
                    ConsultForm: [{x: getMonth, y: getCountCo}],
                    BookedConsult:[{x: getMonth, y: getCountBC}],
                    BookedProcedure: [{x: getMonth, y: getCountBP}],
                    Closed: [{x: getMonth, y: getCountC}],
                };

                console.log("SET LEAD FUNNELS", data2);
                setDataBarLegend(dataLegend)
                setDataBar(data2)
                setLoader(false);
            })
    }

    const getLeadsFunnelDataThisLastTwoYears = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(2, 'year');
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);
        setInitialWidth(Dimensions.get("window").width)

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?category=leads_funnel&datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log('lead funnels this month', response.data)
                let data = [];
                let dataLegend = [];

                let months = response.data.labels;

                console.log("Days", months);
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                    });
                    dataLegend.push({
                        name: response.data.datasets[i].label + "   ",
                        backgroundColor: response.data.datasets[i].backgroundColor,
                    });
                }

                console.log("LOOOOPPP: ", data)

                let getCountI = 0;
                let getCountCo = 0;
                let getCountBC = 0;
                let getCountBP = 0;
                let getCountC = 0;

                for(let x = 0; x<months.length; x++){
                    getCountI += data[0].data[x]
                    getCountCo += data[1].data[x]
                    getCountBC += data[2].data[x]
                    getCountBP += data[3].data[x]
                    getCountC += data[4].data[x]

                    console.log("Count", x, getCountI, getCountCo, getCountBC, getCountBP, getCountC);
                }

                const getMonth = today.startOf('year').format("YYYY");

                let data2 = {
                    Inquiry: [{x: getMonth, y: getCountI}],
                    ConsultForm: [{x: getMonth, y: getCountCo}],
                    BookedConsult:[{x: getMonth, y: getCountBC}],
                    BookedProcedure: [{x: getMonth, y: getCountBP}],
                    Closed: [{x: getMonth, y: getCountC}],
                };

                console.log("SET LEAD FUNNELS", data2);
                setDataBarLegend(dataLegend)
                setDataBar(data2)
                setLoader(false);
            })
    }

    const getLeadsFunnelDataThisYear = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract('year');
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);
        setInitialWidth(Dimensions.get("window").width)

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?category=leads_funnel&datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log('lead funnels this month', response.data)
                let data = [];
                let dataLegend = [];

                let months = response.data.labels;

                console.log("Days", months);
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                    });
                    dataLegend.push({
                        name: response.data.datasets[i].label + "   ",
                        backgroundColor: response.data.datasets[i].backgroundColor,
                    });
                }

                console.log("LOOOOPPP: ", data)

                let getCountI = 0;
                let getCountCo = 0;
                let getCountBC = 0;
                let getCountBP = 0;
                let getCountC = 0;

                for(let x = 0; x<months.length; x++){
                    getCountI += data[0].data[x]
                    getCountCo += data[1].data[x]
                    getCountBC += data[2].data[x]
                    getCountBP += data[3].data[x]
                    getCountC += data[4].data[x]

                    console.log("Count", x, getCountI, getCountCo, getCountBC, getCountBP, getCountC);
                }

                const getMonth = today.startOf('year').format("YYYY");
                let data2 = {
                    Inquiry: [{x: getMonth, y: getCountI}],
                    ConsultForm: [{x: getMonth, y: getCountCo}],
                    BookedConsult:[{x: getMonth, y: getCountBC}],
                    BookedProcedure: [{x: getMonth, y: getCountBP}],
                    Closed: [{x: getMonth, y: getCountC}],
                };
                console.log("SET LEAD FUNNELS", data2);
                setDataBarLegend(dataLegend)
                setDataBar(data2)
                setLoader(false);
            })
    }

    const getLeadsFunnelDataThisLastYear = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'year');
        const begginingOfCurrentWeek = today.startOf('year').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('year').format("YYYY-MM-DD");
        console.log(begginingOfCurrentWeek, endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);
        setInitialWidth(Dimensions.get("window").width)

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?category=leads_funnel&datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log('lead funnels this month', response.data)
                let data = [];
                let dataLegend = [];

                let months = response.data.labels;

                console.log("Days", months);
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                    });
                    dataLegend.push({
                        name: response.data.datasets[i].label + "   ",
                        backgroundColor: response.data.datasets[i].backgroundColor,
                    });
                }

                console.log("LOOOOPPP: ", data)

                let getCountI = 0;
                let getCountCo = 0;
                let getCountBC = 0;
                let getCountBP = 0;
                let getCountC = 0;

                for(let x = 0; x<months.length; x++){
                    getCountI += data[0].data[x]
                    getCountCo += data[1].data[x]
                    getCountBC += data[2].data[x]
                    getCountBP += data[3].data[x]
                    getCountC += data[4].data[x]

                    console.log("Count", x, getCountI, getCountCo, getCountBC, getCountBP, getCountC);
                }

                const getMonth = today.startOf('year').format("YYYY");

                let data2 = {
                    Inquiry: [{x: getMonth, y: getCountI}],
                    ConsultForm: [{x: getMonth, y: getCountCo}],
                    BookedConsult:[{x: getMonth, y: getCountBC}],
                    BookedProcedure: [{x: getMonth, y: getCountBP}],
                    Closed: [{x: getMonth, y: getCountC}],
                };

                console.log("SET LEAD FUNNELS", data2);
                setDataBarLegend(dataLegend)
                setDataBar(data2)
                setLoader(false);
            })
    }

    const getLeadsFunnelRangeDate = async (startDate, endDate) => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const setText = " DATE (" + startDate + " - " + endDate + ")";
        setFilterText(setText);

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?category=leads_funnel&datefrom=${startDate}&dateto=${endDate}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log('lead funnels this month', response.data)
                let data = [];
                let dataLegend = [];

                let months = response.data.labels;

                console.log("Days", months);
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                    });
                    dataLegend.push({
                        name: response.data.datasets[i].label + "   ",
                        backgroundColor: response.data.datasets[i].backgroundColor,
                    });
                }

                console.log("LOOOOPPP: ", data)

                let getCountI = 0;
                let getCountCo = 0;
                let getCountBC = 0;
                let getCountBP = 0;
                let getCountC = 0;

                for(let x = 0; x<months.length; x++){
                    getCountI += data[0].data[x]
                    getCountCo += data[1].data[x]
                    getCountBC += data[2].data[x]
                    getCountBP += data[3].data[x]
                    getCountC += data[4].data[x]

                    console.log("Count", x, getCountI, getCountCo, getCountBC, getCountBP, getCountC);
                }

                const getMonth = moment(startDate).format("MMMM YYYY") + " -  " + moment(endDate).format("MMMM YYYY");

                let data2 = {
                    Inquiry: [{x: getMonth, y: getCountI}],
                    ConsultForm: [{x: getMonth, y: getCountCo}],
                    BookedConsult:[{x: getMonth, y: getCountBC}],
                    BookedProcedure: [{x: getMonth, y: getCountBP}],
                    Closed: [{x: getMonth, y: getCountC}],
                };

                console.log("SET LEAD FUNNELS", data2);
                setDataBarLegend(dataLegend)
                setDataBar(data2)
                setLoader(false);
            })
    }

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

    const [Loader, setLoader] = useState(true);


    return (
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
                                            getLeadsFunnelRangeDate(startDate, endDate);
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
                                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: "bold", color: 'white' }}>Category - Location</Text>
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

                    <List.Accordion
                                title="Leads Funnel"
                                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                            
                                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                                <View style={{ paddingVertical: 12, paddingHorizontal: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                                 <View style={{ paddingHorizontal: 5, paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}> {filterText}  </Text>
                                            <Menu>
                                                <MenuTrigger><AntdIcon name="calendar" size={25} color="#7e7e7e" style={{ marginRight: 10 }} /></MenuTrigger>
                                                <MenuOptions>
                                                    <MenuOption onSelect={() => {getLeadsFunnelDataThisYear(), setLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>All</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLeadsFunnelDataThisWeek(), setLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Week</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLeadsFunnelDataThisMonth(), setLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Month</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLeadsFunnelDataThisLastMonth(), setLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Month</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLeadsFunnelDataThisYear(), setLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Year</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLeadsFunnelDataThisLastYear(), setLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Year</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {getLeadsFunnelDataThisLastTwoYears(), setLoader(true)}} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last 2 Years</Text></View>
                                                    </MenuOption>
                                                    <MenuOption onSelect={() => {
                                                        setLoader(true); setShowDateRangePicker(true); setShowErrorEmpSD(false), setShowErrorEmpED(false)
                                                        setdatePickerTitleStart(null); setdatePickerTitleEnd(null); setStartDate(null);
                                                        setEndDate(null);
                                                    }} >
                                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Custom Range</Text></View>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>
                                 </View>
                                 {    Loader === true ? <></> :
                                 <View style={styles.typesContainer}>
                                    {DataBarLegend.map((item, i) => {
                                        return <View style={styles.types} key={i}>
                                            <View style={{ marginRight: 10, height: 15, width: 15, borderRadius: 15, backgroundColor: item.backgroundColor }}></View>
                                            <Text style={styles.text2}>{item.name}</Text>
                                        </View>
                                    })}
                                </View>}
                                 {    Loader === true ? <View style={{ flex: 1, justifyContent: 'center'}}><LoaderSmall/></View> :
                                <ScrollView nestedScrollEnabled = {true} horizontal={true}>
                                <View style={{ paddingVertical: 5,  backgroundColor: '#fff', marginTop: -2,}}>
                                   <VictoryChart width={initialWidth} >
                                       <VictoryGroup offset={5}>
                                        <VictoryBar
                                            data={DataBar.Inquiry}
                                            style={{data:{fill: '#4472C4'}}}
                                        />
                                         <VictoryBar
                                            data={DataBar.ConsultForm}
                                            style={{data:{fill: '#5B9BD5'}}}
                                        />
                                        <VictoryBar
                                            data={DataBar.BookedConsult}
                                            style={{data:{fill: '#ED7D31'}}}
                                        />
                                        <VictoryBar
                                            data={DataBar.BookedProcedure}
                                            style={{data:{fill: '#FFC000'}}}
                                        />
                                        <VictoryBar
                                            data={DataBar.Closed}
                                            style={{data:{fill: '#A9D18E'}}}
                                        />
                                       </VictoryGroup>

                                   </VictoryChart>
                                </View>
                                </ScrollView>}

                                </View>

                            </List.Accordion>

                            <View style={{ marginBottom: 5 }} />
            </View>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginTop: 10,
        flexWrap: 'wrap',
        marginLeft: 15
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

export default LeadsFunnelChart