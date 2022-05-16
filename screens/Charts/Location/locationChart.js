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
import FeatherIcon from 'react-native-vector-icons/Feather';

import LocationConsultsTab from '../../Tabs/LocationTab/consutsTabLocation';
import LocationInquiriesTab from '../../Tabs/LocationTab/InquiriesTabLocation';
import LocationProceduresTab from '../../Tabs/LocationTab/proceduresTabLocation';

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const LocationChart = ({ route }) => {
    const [locationConsultForm, setLocationConsultForm] = useState([]);
    const [locationConsult, setLocationConsult] = useState([]);
    const [locationProcedures, setLocationProcedures] = useState([]);

    const [index, setIndexL] = useState(0);

    const [routes] = useState([
        { key: 'first', title: 'Consult Form' },
        { key: 'second', title: 'Consults' },
        { key: 'third', title: 'Procedures' },
    ]);

    const initialLayout = { width: Dimensions.get('window').width };
    

    useEffect(() =>{
        getLocationAll();    
    },[]);

    const getLocationAll = async () => {
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?filter=Consult Form&category=location`,
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
            `https://beta.centaurmd.com/api/dashboard/filter-graph?filter=Consults&category=location`,
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
            `https://beta.centaurmd.com/api/dashboard/filter-graph?filter=Procedures&category=location`,
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

    const renderSceneLocation = SceneMap({
        first: () => <LocationInquiriesTab locationdata={locationConsultForm} loader={locationLoader}/>,
        second: () => <LocationConsultsTab locationdata={locationConsult} loader={locationLoader}/>,
        third: () => <LocationProceduresTab locationdata={locationProcedures} loader={locationLoader}/>,
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

    const [locationLoader, setLocationLoader] = useState(true);


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
                                            getLocationRangeDate(startDate, endDate);
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
                                                    <MenuOption onSelect={() => {getLocationAll(), setLocationLoader(true)}} >
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
                                                        setLocationLoader(true); setShowDateRangePicker(true); setShowErrorEmpSD(false), setShowErrorEmpED(false)
                                                        setdatePickerTitleStart(null); setdatePickerTitleEnd(null); setStartDate(null);
                                                        setEndDate(null);
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

export default LocationChart