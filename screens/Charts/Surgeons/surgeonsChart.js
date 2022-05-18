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

import SurgeonsInquiriesTab from '../../Tabs/SurgeonsTab/surgeonInquiries';
import SurgeonsConsultsTab from '../../Tabs/SurgeonsTab/surgeonConsults';
import SurgeonsProceduresTab from '../../Tabs/SurgeonsTab/surgeonProcedures';

const black_theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#000',
        accent: '#f1c40f',
    },
};

const SurgeonsChart = ({ route }) => {

    const today = moment(new Date(Date.now()));
    const begginingOfYear = today.startOf('year').format("YYYY-MM-DD");
    const endOfYear = today.endOf('year').format("YYYY-MM-DD");

    const [dateFrom, setDateFrom] = useState(begginingOfYear);
    const [dateTo, setDateTo] = useState(endOfYear);

    const [summaryDataNames, setSummaryDatanames] = useState([]);
    const [toggleCheckBox1, setToggleCheckBox1] = useState(false)
    const [toggleCheckBox2, setToggleCheckBox2] = useState(false)
    const [toggleCheckBox3, setToggleCheckBox3] = useState(false)
    const [toggleCheckBox4, setToggleCheckBox4] = useState(false)
    const [toggleCheckBox5, setToggleCheckBox5] = useState(false)

    const [isInquiriesZero, setInquiriesZero] = useState(false);
    const [isConsultsZero, setConsultsZero] = useState(false);
    const [isProceduresZero, setProceduresZero] = useState(false);

    const [filterText, setFilterText] = useState(null);

    const [index, setIndex] = useState(0);


    const [routes] = useState([
        { key: 'first', title: 'Consult Form' },
        { key: 'second', title: 'Consults' },
        { key: 'third', title: 'Procedures' },
    ]);

    const [surgeonInquiries, setSurgeonInquiries] = useState([]);
    const [surgeonDataInquiries, setSurgeonDataInquiriess] = useState();

    const [surgeonConsults, setSurgeonConsults] = useState([]);
    const [surgeonDataConsults, setSurgeonDataConsults] = useState();

    const [surgeonProcedures, setSurgeonProcedures] = useState([]);
    const [surgeonDataProcedures, setSurgeonDataProcedures] = useState();

    const [monthSelected, setmonthSelected] = useState(false);
    const initialLayout = { width: Dimensions.get('window').width };

    const [loader, setLoader] = useState(true);
    useEffect(() => {

        getSurgeonData();

    }, []);


    const mappedNames = summaryDataNames.map((item, i, name) => {
        if (i + 1 === name.length) {
            return `data%5B%5D=${item}`
        } else {
            return `data%5B%5D=${item}&`
        }
    })


    let removeComma;

    const getSurgeonData = async () => {

        const today = moment(new Date(Date.now()));
        const begginingOfYear = today.startOf('year').format("YYYY-MM-DD");
        const endOfYear = today.endOf('year').format("YYYY-MM-DD");

        setDateFrom(begginingOfYear);
        setDateTo(endOfYear);

        setmonthSelected(false)

        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=surgeons&filter=Inquiries`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data, color: response.data.datasets[i].backgroundColor };
                }
                setSurgeonDataInquiriess(data[0].data);
                console.log("SURGEON INQUIRIES: ", data[0].color)

                // const isAllZero = data[0].data.every(item => item === 0);

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


                //  console.log("IS INQUIRIES ALL ZERO? ",isAllZero)
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=surgeons&filter=Consults`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setSurgeonDataConsults(data[0].data);
                console.log("SURGEON CONSULTS: ", data[0].data)

                // const isAllZero = data[0].data.every(item => item === 0);
                // console.log("IS CONSULTS ALL ZERO? ",isAllZero)
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }

                /*if (isAllZero ===  true) {
                    setConsultsZero(true);
                }
                else {
                    setConsultsZero(false);
                }*/
            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=surgeons&filter=Procedures`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                // const isAllZero = data[0].data.every(item => item === 0);

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }


                // console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /*   if (isAllZero ===  true) {
                       setProceduresZero(true);
                   }
                   else {
                       setProceduresZero(false);
                   }*/

                setLoader(false);
            })
    }

    const getSurgeonFilterData = async () => {

        removeComma = mappedNames.toString().replace(/,/g, '')
        console.log("REMOVE COMMA:", removeComma)
        console.log("URL:" + `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=surgeons&filter=Consults&${removeComma}`)

        setmonthSelected(false)

        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=surgeons&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setSurgeonDataConsults(data[0].data);
                console.log("SURGEON CONSULTS: ", data[0].data)

                // const isAllZero = data[0].data.every(item => item === 0);
                // console.log("IS CONSULTS ALL ZERO? ",isAllZero)

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }

                /*  if (isAllZero ===  true) {
                      setConsultsZero(true);
                  }
                  else {
                      setConsultsZero(false);
                  }*/

            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=surgeons&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                //  console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /* if (isAllZero ===  false) {
                     setProceduresZero(false);
                 }
                 else {
                     setProceduresZero(true);
                 }*/

            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${dateFrom}&dateto=${dateTo}&category=surgeons&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }
                setSurgeonDataInquiriess(data[0].data);
                console.log("SURGEON INQUIRIES: ", response.data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                //  console.log("IS INQUIRIES ALL ZERO? ",isAllZero)

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }

                /*if (isAllZero ===  false) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }*/
                setLoader(false)
            });


    }

    const clearFilter = () => {
        getSurgeonData();
        setToggleCheckBox1(false);
        setToggleCheckBox2(false);
        setToggleCheckBox3(false);
        setToggleCheckBox4(false);
        setToggleCheckBox5(false);
        setSummaryDatanames([]);


    }

    const getSurgeonDataThisWeek = async () => {

        // setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfCurrentWeek = today.startOf('week').format("YYYY-MM-DD");
        const endOfWeek = today.endOf('week').format("YYYY-MM-DD");

        setDateFrom(begginingOfCurrentWeek);
        setDateTo(endOfWeek);

        const setText = " DATE (" + begginingOfCurrentWeek + " - " + endOfWeek + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '');

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=surgeons&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonProcedures(response.data)
                console.log("SURGEON PRCEDURES THIS WEEK: ", response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                //  console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /* if (isAllZero ===  true) {
                     setProceduresZero(true);
                 }
                 else {
                     setProceduresZero(false);
                 }*/

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                console.log('Procedures Count', count);
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }



            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=surgeons&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonInquiries(response.data)
                console.log("SURGEON INQUIRIES THIS WEEK: ", response.data)

                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataInquiriess(data[0].data)


                //  const isAllZero = data[0].data.every(item => item === 0);
                //  console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /*  if (isAllZero ===  true) {
                      setProceduresZero(true);
                  }
                  else {
                      setProceduresZero(false);
                  }*/

                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                console.log('Inquiries Count', count);
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfCurrentWeek}&dateto=${endOfWeek}&category=surgeons&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {
                console.log("SURGEON CONSULTS THIS WEEK: ", response.data)
                setSurgeonConsults(response.data)
                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2[i] = { data: response.data.datasets[i].data };
                }
                setSurgeonDataConsults(data2[0].data);
                console.log("SURGEON CONSULTS: ", data2[0].data)

                // const isAllZero = data[0].data.every(item => item === 0);
                //  console.log("IS PROCEDURES ALL ZERO? ",isAllZero)

                /* if (isAllZero ===  true) {
                     setProceduresZero(true);
                 }
                 else {
                     setProceduresZero(false);
                 }*/
                let count = 0;
                for (let x = 0; x < data2[0].data.length; x++) {
                    count = count + data2[0].data[x];
                }
                console.log('Consults Count', count);
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }
                setLoader(false)
            });

    }


    const getSurgeonDataThisMonth = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfMonth = today.startOf('month').format("YYYY-MM-DD");
        const endOfMonth = today.endOf('month').format("YYYY-MM-DD");


        setDateFrom(begginingOfMonth);
        setDateTo(endOfMonth);

        const setText = " DATE (" + begginingOfMonth + " - " + endOfMonth + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&category=surgeons&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonInquiries(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color,
                    };
                });

                setSurgeonDataInquiriess(mappedData)

                console.log("SUMMARY DATA INQUIRIES: ", mappedData)

                let count = 0;
                for (let x = 0; x < mappedData[0].data.length; x++) {
                    count = count + mappedData[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&category=surgeons&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonConsults(response.data)


                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }


                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSurgeonDataConsults(mappedData)
                console.log("SUMMARY DATA CONSULTS: ", mappedData)

                let count = 0;
                for (let x = 0; x < mappedData[0].data.length; x++) {
                    count = count + mappedData[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }



            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfMonth}&dateto=${endOfMonth}&category=surgeons&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonProcedures(response.data)
                console.log("SUMMARY DATA PROCEDURES: ", response.data)

                let data2 = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data2.push({
                        data: response.data.datasets[i].data,
                        name: response.data.datasets[i].label,
                        color: response.data.datasets[i].backgroundColor
                    });
                }

                const mappedData = data2.reverse().map((data) => {
                    const color = data.color;
                    return {
                        ...data,
                        color: () => color,
                        backgroundColor: color
                    };
                });
                setSurgeonDataProcedures(mappedData)


                let count = 0;
                for (let x = 0; x < mappedData[0].data.length; x++) {
                    count = count + mappedData[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }
                setLoader(false)

            })

    }
    const getSurgeonDataLastMonth = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'month');
        const begginingOfLastMonth = today.startOf('month').format("YYYY-MM-DD");
        const endOfLastMonth = today.endOf('month').format("YYYY-MM-DD");

        setDateFrom(begginingOfLastMonth);
        setDateTo(endOfLastMonth);

        const setText = " DATE (" + begginingOfLastMonth + " - " + endOfLastMonth + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&category=surgeons&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataInquiriess(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }




            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&category=surgeons&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }

            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastMonth}&dateto=${endOfLastMonth}&category=surgeons&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })

    }
    const getSurgeonDataThisYear = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now()));
        const begginingOfYear = today.startOf('year').format("YYYY-MM-DD");
        const endOfYear = today.endOf('year').format("YYYY-MM-DD");

        setDateFrom(begginingOfYear);
        setDateTo(endOfYear);

        const setText = " DATE (" + begginingOfYear + " - " + endOfYear + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=surgeons&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataInquiriess(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }




            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=surgeons&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfYear}&dateto=${endOfYear}&category=surgeons&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })

    }
    const getSurgeonDataLastYear = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(1, 'year');
        const begginingOfLastYear = today.startOf('year').format("YYYY-MM-DD");
        const endOfLastYear = today.endOf('year').format("YYYY-MM-DD");

        setDateFrom(begginingOfLastYear);
        setDateTo(endOfLastYear);

        const setText = " DATE (" + begginingOfLastYear + " - " + endOfLastYear + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&category=surgeons&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataInquiriess(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&category=surgeons&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }


            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastYear}&dateto=${endOfLastYear}&category=surgeons&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }


                setLoader(false)
            })

    }
    const getSurgeonDataLastTwoYear = async () => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;

        const today = moment(new Date(Date.now())).subtract(2, 'year');
        const begginingOfLastTwoYears = today.startOf('year').format("YYYY-MM-DD");
        const endOfLastTwoYears = today.endOf('year').format("YYYY-MM-DD");

        setDateFrom(begginingOfLastTwoYears);
        setDateTo(endOfLastTwoYears);

        const setText = " DATE (" + begginingOfLastTwoYears + " - " + endOfLastTwoYears + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&category=surgeons&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataInquiriess(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&category=surgeons&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }


            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${begginingOfLastTwoYears}&dateto=${endOfLastTwoYears}&category=surgeons&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })

    }

    const getSurgeonDataRangeDate = async (startDate, endDate) => {

        setmonthSelected(false)
        const token = await AsyncStorage.getItem('token');
        const tokenget = token === null ? route.params.token : token;



        setDateFrom(startDate);
        setDateTo(endDate);

        const setText = " DATE (" + startDate + " - " + endDate + ")";
        setFilterText(setText);


        removeComma = mappedNames.toString().replace(/,/g, '')

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&category=surgeons&filter=Inquiries&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonInquiries(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataInquiriess(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setInquiriesZero(false);
                }
                else {
                    setInquiriesZero(true);
                }

            });

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&category=surgeons&filter=Consults&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {

                setSurgeonConsults(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataConsults(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setConsultsZero(false);
                }
                else {
                    setConsultsZero(true);
                }

            })

        await axios.get(
            `https://beta.centaurmd.com/api/dashboard/filter-graph?datefrom=${startDate}&dateto=${endDate}&category=surgeons&filter=Procedures&${removeComma}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenget
                },
            }).then(response => {


                setSurgeonProcedures(response.data)
                let data = [];
                for (var i = 0; i < response.data.datasets.length; i++) {
                    data[i] = { data: response.data.datasets[i].data };
                }

                setSurgeonDataProcedures(data[0].data);
                console.log("SURGEON PROCEDURES: ", data[0].data)

                //  const isAllZero = data[0].data.every(item => item === 0);
                let count = 0;
                for (let x = 0; x < data[0].data.length; x++) {
                    count = count + data[0].data[x];
                }
                if (count !== 0) {
                    setProceduresZero(false);
                }
                else {
                    setProceduresZero(true);
                }

                setLoader(false)
            })

    }

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

    const renderSceneSurgeons = SceneMap({
        first: () => <SurgeonsInquiriesTab data={surgeonInquiries} surgeonData={surgeonDataInquiries} isZero={isInquiriesZero} loader={loader} />,
        second: () => <SurgeonsConsultsTab data={surgeonConsults} surgeonData={surgeonDataConsults} isZero={isConsultsZero} loader={loader} />,
        third: () => <SurgeonsProceduresTab data={surgeonProcedures} surgeonData={surgeonDataProcedures} isZero={isProceduresZero} loader={loader} />,
    });


    return (
        <PaperProvider theme={black_theme}>
            <List.Accordion
                title="Surgeons"
                titleStyle={{ color: '#fff', fontWeight: 'bold', }}
                style={{ borderWidth: 1, flex: 1, borderColor: '#e3e3e3', borderRadius: 5, color: 'black', float: 'left', backgroundColor: '#2A2B2F', }}>
                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, height: 430, borderLeftWidth: 0.6, borderRightWidth: 0.6, borderColor: '#e3e3e3', marginTop: -2, }}>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}> {filterText} </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Menu>
                                <MenuTrigger><AntdIcon name="calendar" size={25} color="#7e7e7e" style={{ marginRight: 10 }} /></MenuTrigger>
                                <MenuOptions>
                                    <MenuOption onSelect={() => { getSurgeonData(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>All</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getSurgeonDataThisWeek(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Week</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getSurgeonDataThisMonth(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Month</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getSurgeonDataLastMonth(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Month</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getSurgeonDataThisYear(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>This Year</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getSurgeonDataLastYear(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last Year</Text></View>
                                    </MenuOption>
                                    <MenuOption onSelect={() => { getSurgeonDataLastTwoYear(); setLoader(true) }} >
                                        <View style={styles.popupItem}><Text style={styles.popupItemText}>Last 2 Years</Text></View>
                                    </MenuOption>
                                    {/* <MenuOption onSelect={() => {
                                    setSelectedCategory('location'); setShowDateRangePicker(true); setShowErrorEmpSD(false), setShowErrorEmpED(false)
                                    setdatePickerTitleStart(null); setdatePickerTitleEnd(null); setDateFrom(null);
                                    setDateTo(null); console.log(selectedCategory);
                                }} >
                                    <View style={styles.popupItem}><Text style={styles.popupItemText}>Custom Range</Text></View>
                                </MenuOption> */}
                                </MenuOptions>
                            </Menu>
                            <Menu>
                                <MenuTrigger><AntdIcon name="filter" size={25} color="#7e7e7e" /></MenuTrigger>
                                <MenuOptions>

                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <CheckBox
                                            disabled={false}
                                            value={toggleCheckBox1}
                                            onValueChange={(newValue) => {
                                                setToggleCheckBox1(newValue)
                                                if (newValue === true) {
                                                    summaryDataNames.push("Dr. Patrick Hsu");


                                                }
                                                else {
                                                    summaryDataNames.pop();
                                                    setToggleCheckBox1(false)
                                                }


                                            }}
                                        />

                                        <Text style={{ marginLeft: 5 }}>Dr. Patrick Hsu</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <CheckBox
                                            disabled={false}
                                            value={toggleCheckBox2}
                                            onValueChange={(newValue) => {
                                                setToggleCheckBox2(newValue)
                                                if (newValue === true) {
                                                    summaryDataNames.push("Dr. Kendall Roehl")

                                                }
                                                else {
                                                    summaryDataNames.pop();
                                                    setToggleCheckBox2(false)
                                                }

                                            }}
                                        />

                                        <Text style={{ marginLeft: 5 }}>Dr. Kendall Roehl</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row', }}>
                                        <CheckBox
                                            disabled={false}
                                            value={toggleCheckBox3}
                                            onValueChange={(newValue) => {
                                                setToggleCheckBox3(newValue)
                                                if (newValue === true) {
                                                    summaryDataNames.push("Dr. Vasileios Vasilakis")

                                                }
                                                else {
                                                    summaryDataNames.pop();
                                                    setToggleCheckBox3(false)
                                                }


                                            }}
                                        />

                                        <Text style={{ marginLeft: 5 }}>Dr. Vasileios Vasilakis</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <CheckBox
                                            disabled={false}
                                            value={toggleCheckBox4}
                                            onValueChange={(newValue) => {
                                                setToggleCheckBox4(newValue)
                                                if (newValue === true) {
                                                    summaryDataNames.push("MedSpa Provider")

                                                }
                                                else {
                                                    summaryDataNames.pop();
                                                    setToggleCheckBox4(false)
                                                }


                                            }}
                                        />

                                        <Text style={{ marginLeft: 5 }}>MedSpa Provider</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <CheckBox
                                            disabled={false}
                                            value={toggleCheckBox5}
                                            onValueChange={(newValue) => {
                                                setToggleCheckBox5(newValue)
                                                if (newValue === true) {
                                                    summaryDataNames.push("No preference")

                                                }
                                                else {
                                                    summaryDataNames.pop();
                                                    setToggleCheckBox5(false)
                                                }



                                            }}
                                        />

                                        <Text style={{ marginLeft: 5 }}>No preference</Text>
                                    </View>

                                    <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, justifyContent: 'space-between' }}>
                                        <TouchableHighlight onPress={() => { clearFilter(); setLoader(true) }} style={{ bodrderRadius: 5 }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, borderRadius: 5, backgroundColor: '#FFC000', justifyContent: 'space-evenly' }}>
                                                <AntdIcon name='close' size={15} style={{ marginRight: 3 }} />
                                                <Text style={{ fontWeight: 'bold' }}>CLEAR</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight onPress={() => { getSurgeonFilterData(); setLoader(true) }} style={{ bodrderRadius: 5 }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, padding: 10, borderRadius: 5, color: '#fff', backgroundColor: '#00C292', justifyContent: 'space-evenly' }}>
                                                <FeatherIcon name='send' size={15} style={{ marginRight: 3 }} color="#fff" />
                                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>SUBMIT</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderSceneSurgeons}
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

const styles = StyleSheet.create({
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
});

export default SurgeonsChart